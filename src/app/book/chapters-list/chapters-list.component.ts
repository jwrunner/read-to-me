import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { BookService } from '../_services/book.service';
import { RxfirestoreAuthService } from '@r2m-common/services/rxfirestore-auth.service';
import { RouterHelperService } from '@r2m-common/services/router-helper.service';
import { IChapter } from '@r2m-common/interfaces/chapter.interface';
import { faArrowLeft, faBookOpen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'r2m-chapters-list',
  templateUrl: './chapters-list.component.html',
  styleUrls: ['./chapters-list.component.scss']
})
export class ChaptersListComponent implements OnInit {

  faArrowLeft = faArrowLeft;
  faBookOpen = faBookOpen;
  
  chapters$: Observable<IChapter[]>;
  addChapter = false;

  constructor(
    private routerHelper: RouterHelperService,
    private db: RxfirestoreAuthService,
    public bookService: BookService,
  ) { }

  ngOnInit() {
    this.getChapters();
  }

  private getChapters() {
    this.chapters$ = this.routerHelper.bookId.pipe(
      switchMap(bookId => {
        if (bookId) {
          return this.db.col$<IChapter>(`books/${bookId}/chapters`, { orderBy: { value: 'createdAt'}});
        } else {
          return of(null);
        }
      })
    );
  }
}
