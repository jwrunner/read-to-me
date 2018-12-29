import { Component, OnInit, Input } from '@angular/core';
import { Book } from 'src/app/_types/book.interface';

@Component({
  selector: 'rtm-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss']
})
export class BookCardComponent implements OnInit {

  @Input() book: Book;

  constructor() { }

  ngOnInit() {
  }

}
