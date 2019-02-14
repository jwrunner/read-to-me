import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlayerService, CurrentPage } from './player.service';
import { Subscription } from 'rxjs';
import { Book } from '../_types/book.interface';
import { environment } from 'src/environments/environment';
import { trigger, transition, animate, style } from '@angular/animations';
import { AngularFirestore } from '@angular/fire/firestore';
import { IPage } from '../_types/page.interface';

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
export class PlayerComponent implements OnInit, OnDestroy {

  playing = false;
  page: CurrentPage;
  book: Book;
  audio: any;
  progress: number;
  showText: boolean;
  chapterPages: IPage[];

  currentPageIndex: number;
  firstPage: boolean;
  lastPage: boolean;

  currentBookId: any;
  currentChapterId: any;

  currentPageSub: Subscription;
  currentChapterSub: Subscription;

  constructor(
    public playerService: PlayerService,
    private afs: AngularFirestore,
  ) { }

  ngOnInit() {
    this.subscribeToCurrentPage();

  }

  ngOnDestroy() {
    this.currentPageSub.unsubscribe();
    this.currentChapterSub.unsubscribe();
  }

  subscribeToCurrentPage() {
    this.currentPageSub = this.playerService.currentPage.subscribe(page => {
      this.page = page;
      if (page && page.audioPath) {
        this.play(this.page);
        if (this.currentBookId !== this.page.bookId && this.currentChapterId !== this.page.chapterId) {
          this.currentBookId = this.page.bookId;
          this.currentChapterId = this.page.chapterId;
          this.subscribeToCurrentChapter(page.bookId, page.chapterId);
        }
      }
    });
  }

  private subscribeToCurrentChapter(bookId, chapterId) {
    this.currentChapterSub = this.afs.collection<IPage>(`books/${bookId}/chapters/${chapterId}/pages`, ref => ref.orderBy('id'))
      .valueChanges().subscribe(pages => {
        this.chapterPages = pages;
        this.checkForSurroundingPages();
      });
  }

  private checkForSurroundingPages() {
    console.log(this.currentPageIndex);
    this.currentPageIndex = this.chapterPages.findIndex(p => p.id === this.page.id);
    console.log('pageIndex set to: ', this.currentPageIndex);
    if (this.currentPageIndex >= this.chapterPages.length - 1) {
      this.lastPage = true;
    } else { this.lastPage = false; }

    if (this.currentPageIndex === 0) {
      this.firstPage = true;
    } else { this.firstPage = false; }
  }

  async play(page: CurrentPage) {
    if (this.chapterPages) {
      this.checkForSurroundingPages();
    }

    const convertedPath = page.audioPath.replace(/\//g, '%2F');
    // tslint:disable-next-line:max-line-length
    const url = `https://firebasestorage.googleapis.com/v0/b/${environment.firebaseConfig.storageBucket}/o/${convertedPath}?alt=media&token=${page.mt}`;

    // if (typeof (this.audio) === 'object') {
    //   this.audio.setAttribute('src', url);
    //   this.audio.load();
    // } else {
    //   this.audio = new Audio(url);
    // }
    this.audio = new Audio(url);
    this.audio.play();
    this.playing = true;
    this.audio.addEventListener('timeupdate', () => {
      this.progress = (this.audio.currentTime / this.audio.duration) * 100;
      // console.log(this.progress, this.audio.currentTime, this.audio.duration);
    }, false);
    this.audio.addEventListener('ended', () => {
      this.audio = null;
      this.nextPage();
      this.playing = false;
    }, false);
  }

  pause() {
    this.audio.pause();
    this.playing = false;
  }

  unPause() {
    this.audio.play();
    this.playing = true;
  }

  rewind30() {
    this.audio.currentTime -= 30;
  }

  fastForward30() {
    this.audio.currentTime += 30;
  }

  prevPage() {
    if (!this.firstPage) {
      const previousPage = this.chapterPages[this.currentPageIndex - 1];
      this.playerService.setPage(previousPage, this.page.bookTitle);
    }
  }

  nextPage() {
    // TODO, see why this gets fired too many
    console.log('lastPage:', this.lastPage);
    if (!this.lastPage) {
      const nextPage = this.chapterPages[this.currentPageIndex + 1];
      this.playerService.setPage(nextPage, this.page.bookTitle);
    } else {
      console.log('Chapter finished.');
    }
  }
}
