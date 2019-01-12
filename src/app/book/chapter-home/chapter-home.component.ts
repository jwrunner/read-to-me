import { Component, OnInit } from '@angular/core';
import { BookService } from '../_services/book.service';

@Component({
  selector: 'rtm-chapter-home',
  templateUrl: './chapter-home.component.html',
  styleUrls: ['./chapter-home.component.scss']
})
export class ChapterHomeComponent implements OnInit {

  constructor(
    public bookService: BookService,
  ) { }

  ngOnInit() {
  }

  play(pageId) {
    console.log('hit play on ', pageId);
  }

  prefixIfNumber(chapterId) {
    if (isNaN(chapterId)) {
      return chapterId;
    } else {
      return `Chapter ${chapterId}`;
    }
  }
}
