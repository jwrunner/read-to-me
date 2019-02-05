import { Injectable } from '@angular/core';
import { IPage } from '../_types/page.interface';

import assign from 'lodash/assign';
import { BehaviorSubject } from 'rxjs';

export class CurrentPage {
  bookId: string;
  bookTitle: string;
  chapterId: string;
  id: string;
  date: Date;
  text: string;
  audioPath: string;

  constructor(pageData: any) {
    assign(this, pageData);
  }
}

// pass in the next pages and previous pages from this chapter as well as next chapter and previous chapter.

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private _currentPage: BehaviorSubject<CurrentPage> = new BehaviorSubject<CurrentPage>(new CurrentPage(null));
  currentPage = this._currentPage.asObservable();

  constructor() { }

  setPage(page: IPage, bookTitle: string) {
    const current = { bookTitle, ...page };
    this._currentPage.next(current);
  }

  clearPage() {
    this._currentPage.next(null);
  }
}
