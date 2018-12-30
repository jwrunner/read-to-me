import { Component, OnInit } from '@angular/core';
import { BookService } from '../_services/book.service';

@Component({
  selector: 'rtm-book-home',
  templateUrl: './book-home.component.html',
  styleUrls: ['./book-home.component.scss']
})
export class BooksHomeComponent implements OnInit {

  constructor(
    public bookService: BookService,
  ) { }

  ngOnInit() { }

}
