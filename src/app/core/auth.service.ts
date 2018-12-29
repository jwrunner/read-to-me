import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap, first, startWith, tap } from 'rxjs/operators';

import { User } from '../_types/user.interface';
import { MatSnackBar } from '@angular/material';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    user: Observable<User>;

    constructor(
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private router: Router,
        private snackBar: MatSnackBar,
    ) {
        this.user = this.afAuth.authState
            .pipe(
                switchMap(user => {
                    if (user) {
                        return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
                    } else {
                        return of(null);
                    }
                }),
                // set/read the user data to local storage to eliminate observable 'flicker' on load
                tap(user => localStorage.setItem('user', JSON.stringify(user))),
                startWith(JSON.parse(localStorage.getItem('user'))),
                // These lines are buggy and don't update upon a user logging in or out.
            );
    }

    getUser(): Promise<User> {
        return this.user.pipe(first()).toPromise();
    }

    // isLoggedIn(): Promise<any> {
    //     return this.afAuth.authState.pipe(first()).toPromise();
    // }


    // emailSignUp(email: string, password: string, enteredName: string) {
    //     return this.afAuth.auth
    //         .createUserWithEmailAndPassword(email, password)
    //         .then(credential => {
    //             return this.updateUserFirestoreData(credential.user, enteredName);
    //         })
    //         .then(() => {
    //             this.snackBar.open(`Account successfully created for ${enteredName}, using ${email}`, '', {
    //                 duration: 6000,
    //             });
    //             this.router.navigate(['/h/']);
    //         })
    //         .catch(error => this.handleError(error.message));
    // }

    // emailLogin(email: string, password: string) {
    //     return this.afAuth.auth
    //         .signInWithEmailAndPassword(email, password)
    //         .then(() => {
    //             this.router.navigate(['/h/']);
    //         })
    //         .catch(error => this.handleError(error.message));
    // }

    googleLogin() {
        const provider = new auth.GoogleAuthProvider();
        return this.oAuthLogin(provider);
    }

    // TODO
    // public facebookLogin() {
    //     const provider = new auth.FacebookAuthProvider();
    //     return this.oAuthLogin(provider);
    // }

    private async oAuthLogin(provider) {
        const credential = await this.afAuth.auth.signInWithPopup(provider);
        await this.updateUserFirestoreData(credential.user);
        return this.router.navigate(['/']);
    }

    private updateUserFirestoreData(user, enteredName?: string) {
        const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

        const data: User = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || enteredName,
            photoURL: user.photoURL || null,
        };

        return userRef.set(data, { merge: true });
    }

    // sendPasswordResetEmail(email: string) {
    //     const fbAuth = auth();
    //     fbAuth
    //         .sendPasswordResetEmail(email)
    //         .then(() => {
    //             return this.snackBar.open(`Password reset instructions sent to ${email}.`, '', { duration: 10000 })
    //         })
    //         .catch(error => {
    //             throw this.handleError(error.message);
    //         });
    // }

    async signOut() {
        await this.afAuth.auth.signOut();
        this.snackBar.open('Signed Out', '', { duration: 2000 });
        return this.router.navigate(['/']);
    }

    // private handleError(err) {
    //     this.snackBar.open(err, '', {
    //         duration: 6000,
    //         panelClass: 'snackbar-error'
    //     });
    // }
}
