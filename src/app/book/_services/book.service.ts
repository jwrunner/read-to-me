import { Injectable } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { filter, mapTo, map, switchMap, first } from 'rxjs/operators';
import { assign } from 'lodash';

import { Book } from 'src/app/_types/book.interface';

@Injectable()
export class BookService {
    blah = 'deleteThis';

    bookId: string;
    private _book = new BehaviorSubject<Book>({ id: '...', title: '', ownerId: null, ownerName: '', dateCreated: null, pages: 0 });
    currentBook = this._book.asObservable();

    constructor(
        private rootRouter: Router,
        private activatedRoute: ActivatedRoute,
        private afs: AngularFirestore,
    ) {
        this.watchBookId();
    }

    private watchBookId() {
        this.rootRouter.events.pipe(
            filter(event => event instanceof NavigationEnd),
            mapTo(this.activatedRoute),
            map(route => {
                console.log('route event caught');
                const allParams = {};
                while (route.firstChild) {
                    route = route.firstChild;
                    assign(allParams, route.snapshot.params);
                }
                return allParams['bookId'];
                // return allParams;
            })
        ).pipe(
            switchMap(bookId => {
                if (bookId) {
                    this.bookId = bookId;
                    console.log(`swithmapped to bookId: ${bookId}`);
                    return this.afs.doc<Book>(`books/${bookId}`).valueChanges();
                } else {
                    return of(null);
                }
            })
        ).subscribe(book => {
            if (book) {
                book.id = this.bookId;
            }
            console.table(book);
            this._book.next(book);
            // const bookId = allParams['bookId'];
            // const chapter = allParams['chapter'];
        });
    }

    // getBook(): Promise<Book> {
    //     return this.book.pipe(first()).toPromise();
    // }
}
