// tslint:disable: max-line-length
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Observable, from, combineLatest, of, BehaviorSubject } from 'rxjs';
import { map, mergeMap, switchMap, first, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IUser } from '@r2m-common/interfaces/user.interface';

// Custom Types
// type CollectionPredicate<T> = string | firebase.firestore.CollectionReference;
// type DocPredicate<T> = string | firebase.firestore.DocumentReference;

export interface IdbQuery {
  limit?: number;
  orderBy?: {
    value: string;
    direction?: 'asc' | 'desc';
  };
  where?: {
    fieldPath: string;
    opStr: '==' | '>' | '<' | '>=' | '<=' | 'array-contains';
    value: string | boolean;
  };
  where2?: {
    fieldPath: string;
    opStr: '==' | '>' | '<' | '>=' | '<=' | 'array-contains';
    value: string | boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class RxfirestoreAuthService {

  user: Observable<IUser>;

  _isAdmin = new BehaviorSubject<boolean>(false);
  isAdmin$ = this._isAdmin.asObservable();

  redirectUrl: string;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.establishUser();
  }

  async establishUser() {
    this.user = this.lazyAuth().pipe(
      mergeMap(({ app, rxauth }) => {
        return rxauth.authState(app.auth());
      }),
      tap(user => this.checkIfAdmin(user)),
      switchMap(user => {
        if (user) {
          return this.doc$<IUser>(`users/${user.uid}`);
        } else {
          return of(null);
        }
      }),
      // tap(user => localStorage.setItem('user', JSON.stringify(user))),
      // startWith(JSON.parse(localStorage.getItem('user'))),
    );
  }

  private checkIfAdmin(user: firebase.User) {
    if (user) {
      this.docExists(`admins/${user.uid}`).then(result => {
        if (result) { this._isAdmin.next(true); }
      });
    }
  }

  // Auth

  lazyAuth() {
    const app$ = from(import('firebase/app'));
    const firestore$ = from(import('firebase/firestore'));
    const auth$ = from(import('firebase/auth'));
    const rxauth$ = from(import('rxfire/auth'));

    return combineLatest(app$, firestore$, auth$, rxauth$)
      .pipe(
        map(([firebase, firestore, auth, rxauth]) => {
          if (firebase.apps[0]) {
            const app = firebase.apps[0];
            return { app, rxauth };
          } else {
            const app = firebase.initializeApp(environment.firebaseConfig);
            app.firestore().enablePersistence({ synchronizeTabs: true });
            // Use to reset cache when modifying database directly in Firestore
            // app.firestore().clearPersistence().catch(error => {
            //   console.error('Could not enable persistence:', error.code);
            // });
            return { app, rxauth };
          }
        })
      );
  }

  getUser(): Promise<IUser> {
    return this.user.pipe(first()).toPromise();
  }

  async emailSignUp(email: string, password: string, enteredName: string) {
    try {
      const app = await this.firebase();
      const credential = await app.auth().createUserWithEmailAndPassword(email, password);
      await this.updateUserData(credential.user, enteredName);
      this.snackBar.open(`Account successfully created for ${enteredName}, using ${email}`, '', {
        duration: 6000,
      });
      this.navigateToPreviousPage();
      return credential.user.uid;
    } catch (error) {
      throw this.handleError(error.message);
    }
  }

  async emailLogin(email: string, password: string) {
    try {
      const app = await this.firebase();
      const credential = await app.auth().signInWithEmailAndPassword(email, password);
      this.navigateToPreviousPage();
      return credential.user.uid;
    } catch (error) {
      throw this.handleError(error.message);
    }
  }

  async googleLogin() {
    const firebase = await import('firebase/app');
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  // async facebookLogin() {
  //   const firebase = await import('firebase/app');
  //   const provider = new firebase.auth.FacebookAuthProvider();
  //   return this.oAuthLogin(provider);
  // }

  private async oAuthLogin(provider) {
    const app = await this.firebase();
    const credential = await app.auth().signInWithPopup(provider);
    await this.updateUserData(credential.user);
    this.navigateToPreviousPage();
    return credential.user.uid;
  }

  private async updateUserData(user: IUser, enteredName?: string) {
    const userRef: firebase.firestore.DocumentReference = await this.doc<IUser>(`users/${user.uid}`);

    const data: IUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || enteredName,
      photoURL: user.photoURL || null,
    };

    return userRef.set(data, { merge: true });
  }

  async sendPasswordResetEmail(email: string) {
    try {
      const app = await this.firebase();
      await app.auth().sendPasswordResetEmail(email);
      return this.snackBar.open(`Password reset instructions sent to ${email}.`, 'OK', { duration: 30000 });
    } catch (error) {
      throw this.handleError(error.message);
    }
  }

  async signOut() {
    const app = await this.firebase();
    await app.auth().signOut();
    this.snackBar.open('Signed Out', '', { duration: 2000 });
    return this.router.navigate(['/']);
  }

  private handleError(err) {
    this.snackBar.open(err, '', {
      duration: 6000,
      panelClass: 'snackbar-error'
    });
  }

  private navigateToPreviousPage() {
    if (this.redirectUrl && this.redirectUrl !== '/user/login') {
      return this.router.navigate([this.redirectUrl]);
    } else {
      return this.router.navigate(['/']);
    }
  }

  // Firestore

  lazyFirestore() {
    const app$ = from(import('firebase/app'));
    const firestore$ = from(import('firebase/firestore'));
    const rxfire$ = from(import('rxfire/firestore'));

    return combineLatest(app$, firestore$, rxfire$)
      .pipe(
        map(([firebase, firestore, rxfire]) => {
          if (firebase.apps[0]) {
            const app = firebase.apps[0];
            return { app, rxfire };
          } else {
            const app = firebase.initializeApp(environment.firebaseConfig);
            app.firestore().enablePersistence({ synchronizeTabs: true });
            // app.firestore().clearPersistence().catch(error => {
            //   console.error('Could not enable persistence:', error.code);
            // });
            return { app, rxfire };
          }
        })
      );
  }

  col$<T>(collectionName: string, qry?: IdbQuery): Observable<T[]> {
    return this.lazyFirestore()
      .pipe(
        mergeMap(({ app, rxfire }) => {
          const ref = app.firestore().collection(collectionName);
          if (qry && qry.limit && qry.orderBy && qry.where) {
            return rxfire.collectionData<T>(ref.limit(qry.limit).orderBy(qry.orderBy.value, qry.orderBy.direction ? qry.orderBy.direction : 'asc').where(qry.where.fieldPath, qry.where.opStr, qry.where.value), 'id');
          } else if (qry && qry.orderBy && qry.where && qry.where2) {
            return rxfire.collectionData<T>(ref.orderBy(qry.orderBy.value, qry.orderBy.direction ? qry.orderBy.direction : 'asc').where(qry.where.fieldPath, qry.where.opStr, qry.where.value).where(qry.where2.fieldPath, qry.where2.opStr, qry.where2.value), 'id');
          } else if (qry && qry.orderBy && qry.where) {
            return rxfire.collectionData<T>(ref.orderBy(qry.orderBy.value, qry.orderBy.direction ? qry.orderBy.direction : 'asc').where(qry.where.fieldPath, qry.where.opStr, qry.where.value), 'id');
          } else if (qry && qry.limit && qry.orderBy) {
            return rxfire.collectionData<T>(ref.limit(qry.limit).orderBy(qry.orderBy.value, qry.orderBy.direction ? qry.orderBy.direction : 'asc'), 'id');
          } else if (qry && qry.limit) {
            return rxfire.collectionData<T>(ref.limit(qry.limit), 'id');
          } else if (qry && qry.orderBy) {
            return rxfire.collectionData<T>(ref.orderBy(qry.orderBy.value, qry.orderBy.direction ? qry.orderBy.direction : 'asc'), 'id');
          } else if (qry && qry.where) {
            return rxfire.collectionData<T>(ref.where(qry.where.fieldPath, qry.where.opStr, qry.where.value), 'id');
          } else {
            return rxfire.collectionData<T>(ref, 'id');
          }
          // const query = qry ? ref.qry : ref;
          // return rxfire.collectionData(query, 'id');
        })
      );
  }

  doc$<T>(docId: string): Observable<T> {
    return this.lazyFirestore()
      .pipe(
        mergeMap(({ app, rxfire }) => {
          const ref = app.firestore().doc(docId);
          return rxfire.docData<T>(ref, 'id');
        })
      );
  }

  docNoId$<T>(docId: string): Observable<T> {
    return this.lazyFirestore()
      .pipe(
        mergeMap(({ app, rxfire }) => {
          const ref = app.firestore().doc(docId);
          return rxfire.docData<T>(ref);
        })
      );
  }

  docFromDocRef$<T>(docRef: firebase.firestore.DocumentReference): Observable<T> {
    return this.lazyFirestore()
      .pipe(
        mergeMap(({ rxfire }) => {
          return rxfire.docData<T>(docRef, 'id');
        })
      );
  }

  async firebase(): Promise<firebase.app.App> {
    const firebase = await import('firebase/app');
    if (firebase.apps[0]) {
      const app = firebase.apps[0];
      return app;
    } else {
      const app = firebase.initializeApp(environment.firebaseConfig);
      app.firestore().enablePersistence({ synchronizeTabs: true });
      // app.firestore().clearPersistence().catch(error => {
      //   console.error('Could not enable persistence:', error.code);
      // });
      return app;
    }
  }

  async col<T>(ref: string): Promise<firebase.firestore.CollectionReference> {
    const app = await this.firebase();
    return app.firestore().collection(ref);
  }

  async doc<T>(ref: string): Promise<firebase.firestore.DocumentReference> {
    const app = await this.firebase();
    return app.firestore().doc(ref);
  }

  async timestamp() {
    const firebase = await import('firebase/app');
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  async add<T>(ref: string, data: any): Promise<firebase.firestore.DocumentReference> {
    const timestamp = await this.timestamp();
    const { uid } = await this.getUser();

    const col = await this.col(ref);
    return col.add({
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: uid,
      updatedBy: uid,
    });
  }

  async set<T>(ref: string, data: any): Promise<void> {
    const timestamp = await this.timestamp();
    const { uid } = await this.getUser();
    const doc = await this.doc(ref);
    return doc.set({
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: uid,
      updatedBy: uid,
    });
  }

  async update<T>(ref: string, data: Partial<T>): Promise<void> {
    const timestamp = await this.timestamp();
    const { uid } = await this.getUser();
    const doc = await this.doc(ref);
    return doc.update({
      ...data,
      updatedAt: timestamp,
      updatedBy: uid,
    });
  }

  async upsert<T>(ref: string, data: any): Promise<void> {
    const snap = await this.docNoId$<T>(ref).pipe(take(1)).toPromise();
    return Object.keys(snap).length !== 0 ? this.update(ref, data) : this.set(ref, data);
  }

  async delete(ref: string): Promise<void> {
    const doc = await this.doc(ref);
    return doc.delete();
  }

  async docExists(ref: string): Promise<boolean> {
    try {
      const snap = await this.docNoId$(ref).pipe(take(1)).toPromise();
      return Object.keys(snap).length !== 0 ? true : false;
    } catch (err) { } // will give permissions error upon trying to check if admin
  }
}

  // convert firestore observable to promise in one time operations so they're not observables
  // check functions and get them to return a promise with the docId
  // auth to all functions
  // timestamps (research if I should not use Firestore timestamp)


// Adapted from https://angularfirebase.com/lessons/firestore-advanced-usage-angularfire/
// And https://firebase.googleblog.com/2018/09/introducing-rxfire-easy-async-firebase.html
