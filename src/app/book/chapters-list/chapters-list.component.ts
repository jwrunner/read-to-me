import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Chapter } from 'src/app/_types/chapter.interface';
import { RouterHelperService } from '../_services/router-helper.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'rtm-chapters-list',
  templateUrl: './chapters-list.component.html',
  styleUrls: ['./chapters-list.component.scss']
})
export class ChaptersListComponent implements OnInit {

  chaptersObservable: Observable<Chapter[]>;
  addChapter = false;

  constructor(
    private routerHelper: RouterHelperService,
    private afs: AngularFirestore,
  ) { }

  ngOnInit() {
    this.getChapters();
  }

  private async getChapters() {
    this.chaptersObservable = this.routerHelper.bookId.pipe(
      switchMap(bookId => {
        if (bookId) {
          return this.afs.collection<Chapter>(`books/${bookId}/chapters`, ref => ref.orderBy('dateCreated'))
          .valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }
}
