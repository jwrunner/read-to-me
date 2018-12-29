import { Component, OnInit } from '@angular/core';
import { BookService } from '../_services/book.service';
import { Book } from 'src/app/_types/book.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'rtm-books-home',
  templateUrl: './books-home.component.html',
  styleUrls: ['./books-home.component.scss']
})
export class BooksHomeComponent implements OnInit {

  book: Observable<Book>;

  constructor(
    private bookService: BookService,
  ) { }

  ngOnInit() {
    this.book = this.bookService.currentBook;
  }
}
