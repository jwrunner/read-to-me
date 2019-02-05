import { Component, OnInit } from '@angular/core';
import { BookService } from '../_services/book.service';
import { Observable } from 'rxjs';
import { IPage } from 'src/app/_types/page.interface';
import { AngularFirestore } from '@angular/fire/firestore';
import { RouterHelperService } from '../../_services/router-helper.service';
import { PlayerService } from 'src/app/player/player.service';

@Component({
  selector: 'rtm-chapter-home',
  templateUrl: './chapter-home.component.html',
  styleUrls: ['./chapter-home.component.scss']
})
export class ChapterHomeComponent implements OnInit {

  pages$: Observable<IPage[]>;

  constructor(
    public bookService: BookService,
    private routerHelper: RouterHelperService,
    private afs: AngularFirestore,
    public playerService: PlayerService,
  ) { }

  ngOnInit() {
    this.getPages();
  }

  async setPage(page: IPage) {
    const { title } = await this.bookService.getBook();
    this.playerService.setPage(page, title);
  }

  private async getPages() {
    const bookId = await this.routerHelper.getBookId();
    const chapterId = await this.routerHelper.getChapterId();
    this.pages$ = this.afs.collection<IPage>(`books/${bookId}/chapters/${chapterId}/pages`, ref => ref.orderBy('id')).valueChanges();
  }

  prefixIfNumber(chapterId) {
    if (isNaN(chapterId)) {
      return chapterId;
    } else {
      return `Chapter ${chapterId}`;
    }
  }
}
