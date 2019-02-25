import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { IBook } from '../_types/book.interface';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'rtm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  booksObservable: Observable<IBook[]>;
  addBook = false;
  date = new Date();

  constructor(
    public auth: AuthService,
    private afs: AngularFirestore,
  ) { }

  ngOnInit() {
    this.getBooks();
  }

  private async getBooks() {
    this.booksObservable = this.auth.user.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.collection('books', ref =>
            ref.where('ownerId', '==', user.uid)
            .orderBy('title')
            ).snapshotChanges().pipe(
              map(arr => {
                return arr.map(snap => {
                  const data = snap.payload.doc.data() as IBook;
                  const id = snap.payload.doc.id;
                  return {
                    id, ...data
                  };
                });
              })
            );
        } else {
          return of(null);
        }
      })
    );
  }


}
