import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { trigger, transition, animate, style } from '@angular/animations';
import { Subscription, combineLatest } from 'rxjs';

import { environment } from 'src/environments/environment';
import { PlayerService, CurrentPage } from './player.service';
import { IBook } from '@r2m-common/interfaces/book.interface';
import { IPage } from '@r2m-common/interfaces/page.interface';
import { RxfirestoreAuthService } from '@r2m-common/services/rxfirestore-auth.service';
import { faArrowUp, faArrowDown, faTimes, faPlayCircle, faAngleLeft, faPauseCircle, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { RouterHelperService } from '@r2m-common/services/router-helper.service';
import { withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'r2m-player',
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

  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faTimes = faTimes;
  faAngleLeft = faAngleLeft;
  faAngleRight = faAngleRight;
  faPlayCircle = faPlayCircle;
  faPauseCircle = faPauseCircle;

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
    private db: RxfirestoreAuthService,
    private snackBar: MatSnackBar,
    private routerHelper: RouterHelperService,
  ) { }

  ngOnInit() {
    this.subscribeToCurrentPage();
  }
  ngOnDestroy() {
    this.currentPageSub.unsubscribe();
    this.currentChapterSub.unsubscribe();
  }

  subscribeToCurrentPage() {
    this.currentPageSub = this.playerService.currentPage.pipe(
      withLatestFrom(combineLatest([this.routerHelper.bookId, this.routerHelper.chapterId]))
    )
      .subscribe(([page, [bookId, chapterId]]) => {
        this.page = page;
        if (page && page.audioPath) {
          this.play(this.page);
          if (this.currentBookId !== bookId && this.currentChapterId !== chapterId) {
            this.currentBookId = bookId;
            this.currentChapterId = chapterId;
            this.subscribeToCurrentChapter(bookId, chapterId);
          }
        } else if (this.audio && !this.audio.paused) {
          this.audio.pause();
          this.audio = null; // to reset player
        }
      });
  }

  private subscribeToCurrentChapter(bookId: string, chapterId: string) {
    this.currentChapterSub = this.db.col$<IPage>(`books/${bookId}/chapters/${chapterId}/pages`, {
      orderBy: { value: 'pageNumber' }
    }).subscribe(pages => {
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
    const url = `https://firebasestorage.googleapis.com/v0/b/${environment.firebaseConfig.storageBucket}/o/${convertedPath}?alt=media`;

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
