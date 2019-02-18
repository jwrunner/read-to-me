import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material';
import { trigger, transition, animate, style } from '@angular/animations';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { PlayerService, CurrentPage } from './player.service';
import { IBook } from '../_types/book.interface';
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
  book: IBook;
  audio: any;
  progress: number;
  minimal: boolean;
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
    private snackBar: MatSnackBar,
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
      } else if (this.audio && !this.audio.paused) {
        this.audio.pause();
        this.audio = null; // to reset player
      }
    });
  }

  private subscribeToCurrentChapter(bookId: string, chapterId: string) {
    this.currentChapterSub = this.afs.collection<IPage>('pages', ref =>
      ref.where('bookId', '==', bookId)
        .where('chapterId', '==', chapterId)
        .orderBy('pageNumber'))
      .snapshotChanges().pipe(
        map(arr => {
          return arr.map(snap => {
            const data = snap.payload.doc.data() as IPage;
            const id = snap.payload.doc.id;
            return {
              id, ...data
            };
          });
        })
      ).subscribe(pages => {
        this.chapterPages = pages;
        this.checkForSurroundingPages();
      });
  }

  private checkForSurroundingPages() {
    this.currentPageIndex = this.chapterPages.findIndex(p => p.id === this.page.id);
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

    this.audio = new Audio(url);
    this.audio.play();
    this.playing = true;
    this.audio.addEventListener('timeupdate', () => {
      if (this.audio) {
        this.progress = (this.audio.currentTime / this.audio.duration) * 100;
      }
    }, false);
    this.audio.addEventListener('ended', () => {
      this.audio = null;
      this.playing = false;
      this.nextPage();
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
      this.playerService.setPage(previousPage, this.page.bookTitle, this.page.chapterName);
    }
  }

  nextPage() {
    if (!this.lastPage) {
      const nextPage = this.chapterPages[this.currentPageIndex + 1];
      this.playerService.setPage(nextPage, this.page.bookTitle, this.page.chapterName);
    } else {
      this.snackBar.open('Chapter Finished.', '', { duration: 3000 });
      this.playerService.clearPage();
      // TODO: go to next chapter.
      // TODO: mark chapter as read.
    }
  }
}
