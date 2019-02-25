import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { of, BehaviorSubject } from 'rxjs';
import { switchMap, first } from 'rxjs/operators';

import { RouterHelperService } from '../../_services/router-helper.service';
import { IBook } from 'src/app/_types/book.interface';
import { IChapter } from 'src/app/_types/chapter.interface';

@Injectable()
export class BookService {

    bookId: string;
    private _book = new BehaviorSubject<IBook>({ id: '...', title: '', ownerId: null, ownerName: '', dateCreated: null, pages: 0 });
    currentBook = this._book.asObservable();

    chapterId: string;
    // tslint:disable-next-line:max-line-length
    private _chapter = new BehaviorSubject<IChapter>({ name: null, ownerId: null, ownerName: null, bookId: null, dateCreated: null, pages: 0 });
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
                    return this.afs.doc<IBook>(`books/${bookId}`).valueChanges();
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
                    return this.afs.doc<IChapter>(`chapters/${chapterId}`).valueChanges();
                } else {
                    return of(null);
                }
            })
        ).subscribe(chapter => {
            if (chapter) {
                chapter.id = this.chapterId;
                this._chapter.next(chapter);
            }
        });
    }

    getBook(): Promise<IBook> {
        return this.currentBook.pipe(first()).toPromise();
    }

    getChapter(): Promise<IChapter> {
        return this.currentChapter.pipe(first()).toPromise();
    }

}
