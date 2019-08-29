import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

import { IBook } from '@r2m-common/interfaces/book.interface';
import { RxfirestoreAuthService } from '@r2m-common/services/rxfirestore-auth.service';
import { faBook, faEllipsisV, faPlus } from '@fortawesome/free-solid-svg-icons';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'r2m-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  faBook = faBook;
  faEllipsisV = faEllipsisV;
  faPlus = faPlus;

  books$: Observable<IBook[]>;
  addBook = false;
  date = new Date();

  constructor(
    public db: RxfirestoreAuthService,
  ) { }

  ngOnInit() {
    this.getBooks();
  }

  private async getBooks() {
    this.books$ = this.db.user.pipe(
      switchMap(user => {
        if (user) {
          return this.db.col$('books', { where: { fieldPath: 'createdBy', opStr: '==', value: user.uid }, orderBy: { value: 'title' } });
        } else { return of(null); }
      })
    );
  }
}
