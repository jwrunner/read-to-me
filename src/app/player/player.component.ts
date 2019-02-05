import { Component, OnInit } from '@angular/core';
import { PlayerService, CurrentPage } from './player.service';
import { Subscription } from 'rxjs';
import { Book } from '../_types/book.interface';

@Component({
  selector: 'rtm-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  playing = false;
  page: CurrentPage;
  book: Book;

  currentPageSub: Subscription;

  constructor(
    public playerService: PlayerService,
  ) { }

  ngOnInit() {
    this.subscribeToCurrentPage();
  }

  subscribeToCurrentPage() {
    this.playerService.currentPage.subscribe(page => {
      this.page = page;
      if (page) {
        this.play(this.page);
      }
    });
  }

  async play(page: CurrentPage) {
    const audio = new Audio(page.audioPath);
    audio.play();
    this.playing = true;
  }
}
