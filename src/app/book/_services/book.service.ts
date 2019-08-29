import { Injectable } from '@angular/core';
import { of, BehaviorSubject, combineLatest } from 'rxjs';
import { switchMap, first } from 'rxjs/operators';
import { RxfirestoreAuthService } from '@r2m-common/services/rxfirestore-auth.service';
import { IBook } from '@r2m-common/interfaces/book.interface';
import { IChapter } from '@r2m-common/interfaces/chapter.interface';
import { RouterHelperService } from '@r2m-common/services/router-helper.service';


@Injectable({
    providedIn: 'root'
})
export class BookService {

    bookId: string;
    private _book = new BehaviorSubject<IBook>({ id: '...', title: '...', pages: 0 });
    currentBook = this._book.asObservable();

    chapterId: string;
    private _chapter = new BehaviorSubject<IChapter>({ name: '...', pages: 0 });
    currentChapter = this._chapter.asObservable();

    constructor(
        private db: RxfirestoreAuthService,
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
                    return this.db.doc$<IBook>(`books/${bookId}`);
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
        combineLatest([this.routerHelper.bookId, this.routerHelper.chapterId]).pipe(
            switchMap(([bookId, chapterId]) => {
                if (chapterId) {
                    this.chapterId = chapterId;
                    return this.db.doc$<IChapter>(`books/${bookId}/chapters/${chapterId}`);
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
