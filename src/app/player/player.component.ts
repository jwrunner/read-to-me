import { Component, OnInit } from '@angular/core';
import { PlayerService, CurrentPage } from './player.service';
import { Subscription } from 'rxjs';
import { Book } from '../_types/book.interface';
import { environment } from 'src/environments/environment';
import { trigger, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'rtm-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  animations: [
    trigger('fadeUpDownAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translate(0,75%)' }),
        animate('.2s ease-in', style({ opacity: 1, transform: 'translate(0, 0)' }))
      ]),
      transition(':leave', [
        animate('.2s ease-out', style({ opacity: 0, transform: 'translate(0,75%)' }))
      ])
    ])
  ]
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
    const convertedPath = page.audioPath.replace(/\//g, '%2F');
    // tslint:disable-next-line:max-line-length
    const url = `https://firebasestorage.googleapis.com/v0/b/${environment.firebaseConfig.storageBucket}/o/${convertedPath}?alt=media&token=${page.mt}`;
    const audio = new Audio(url);
    audio.play();
    this.playing = true;
  }
}
