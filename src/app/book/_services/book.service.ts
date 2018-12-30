import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { of, BehaviorSubject } from 'rxjs';
import { switchMap, first } from 'rxjs/operators';

import { RouterHelperService } from './router-helper.service';
import { Book } from 'src/app/_types/book.interface';
import { Chapter } from 'src/app/_types/chapter.interface';

@Injectable()
export class BookService {

    bookId: string;
    private _book = new BehaviorSubject<Book>({ id: '...', title: '', ownerId: null, ownerName: '', dateCreated: null, pages: 0 });
    currentBook = this._book.asObservable();

    chapterId: string;
    private _chapter = new BehaviorSubject<Chapter>({ id: '', ownerId: null, ownerName: null, dateCreated: null, pages: 0 });
    currentChapter = this._chapter.asObservable();

    constructor(
        private afs: AngularFirestore,
        private routerHelper: RouterHelperService,
    ) {
        this.watchBookId();
        this.watchChapterId();
    }

    private watchBookId() {
        this.routerHelper.bookId.pipe(
            switchMap(bookId => {
                if (bookId) {
                    this.bookId = bookId;
                    return this.afs.doc<Book>(`books/${bookId}`).valueChanges();
                } else {
                    return of(null);
                }
            })
        ).subscribe(book => {
            if (book) {
                book.id = this.bookId;
                this._book.next(book);
            }
        });
    }

    private watchChapterId() {
        this.routerHelper.chapterId.pipe(
            switchMap(chapterId => {
                if (chapterId) {
                    this.chapterId = chapterId;
                    return this.afs.doc<Chapter>(`books/${this.bookId}/chapters/${chapterId}`).valueChanges();
                } else {
                    return of(null);
                }
            })
        ).subscribe(chapter => {
            if (chapter) {
                this._chapter.next(chapter);
            }
        });
    }

    getBook(): Promise<Book> {
        return this.currentBook.pipe(first()).toPromise();
    }

    getChapter(): Promise<Chapter> {
        return this.currentChapter.pipe(first()).toPromise();
    }

}
