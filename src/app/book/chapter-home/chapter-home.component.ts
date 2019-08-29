import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BookService } from '../_services/book.service';
import { PlayerService } from 'src/app/player/player.service';
import { RxfirestoreAuthService } from '@r2m-common/services/rxfirestore-auth.service';
import { IPage } from '@r2m-common/interfaces/page.interface';
import { RouterHelperService } from '@r2m-common/services/router-helper.service';
import { faArrowLeft, faPlay } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'r2m-chapter-home',
  templateUrl: './chapter-home.component.html',
  styleUrls: ['./chapter-home.component.scss']
})
export class ChapterHomeComponent implements OnInit {

  faArrowLeft = faArrowLeft;
  faPlay = faPlay;

  pages: IPage[];
  pages$: Observable<IPage[]>;

  constructor(
    public bookService: BookService,
    private routerHelper: RouterHelperService,
    private db: RxfirestoreAuthService,
    public playerService: PlayerService,
  ) { }

  ngOnInit() {
    this.getPages();
  }

  async setPage(page: IPage) {
    const { title } = await this.bookService.getBook();
    const { name } = await this.bookService.getChapter();
    this.playerService.setPage(page, title, name);
  }

  private async getPages() {
    const bookId = await this.routerHelper.getBookId();
    const chapterId = await this.routerHelper.getChapterId();
    this.pages$ = this.db.col$<IPage>(`books/${bookId}/chapters/${chapterId}/pages`, {
      orderBy: { value: 'pageNumber' }
    });
  }

  async deletePage(pageId: any) {
    // TODO
    console.log('need to delete', pageId);
  }
}
