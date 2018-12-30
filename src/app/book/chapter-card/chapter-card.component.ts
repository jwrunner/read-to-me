import { Component, OnInit, Input } from '@angular/core';
import { Chapter } from 'src/app/_types/chapter.interface';

@Component({
  selector: 'rtm-chapter-card',
  templateUrl: './chapter-card.component.html',
  styleUrls: ['./chapter-card.component.scss']
})
export class ChapterCardComponent implements OnInit {

  @Input() chapter: Chapter;

  constructor() { }

  ngOnInit() {
  }

}
