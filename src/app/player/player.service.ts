import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import assign from 'lodash/assign';
import { IPage } from '@r2m-common/interfaces/page.interface';

export class CurrentPage {
  id?: string;
  bookTitle: string;
  chapterName: string;
  pageNumber: number;
  dateCreated: number;
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

  setPage(page: IPage, bookTitle: string, chapterName: string) {
    this.clearPage();
    const current = { bookTitle, chapterName, ...page };
    this._currentPage.next(current);
  }

  clearPage() {
    this._currentPage.next(null);
  }
}
