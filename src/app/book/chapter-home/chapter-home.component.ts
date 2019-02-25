import { Component, OnInit } from '@angular/core';
import { BookService } from '../_services/book.service';
import { Subscription } from 'rxjs';
import { IPage } from 'src/app/_types/page.interface';
import { AngularFirestore } from '@angular/fire/firestore';
import { RouterHelperService } from '../../_services/router-helper.service';
import { PlayerService } from 'src/app/player/player.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'rtm-chapter-home',
  templateUrl: './chapter-home.component.html',
  styleUrls: ['./chapter-home.component.scss']
})
export class ChapterHomeComponent implements OnInit {

  pages: IPage[];
  pagesSubscription: Subscription;

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
    const { name } = await this.bookService.getChapter();
    this.playerService.setPage(page, title, name);
  }

  private async getPages() {
    const bookId = await this.routerHelper.getBookId();
    const chapterId = await this.routerHelper.getChapterId();
    // tslint:disable-next-line:max-line-length
    this.pagesSubscription = this.afs.collection<IPage>('pages', ref =>
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
        this.pages = pages;
      });
  }

  async deletePage(pageId: any) {
    // TODO
    console.log('need to delete', pageId);
  }
}
