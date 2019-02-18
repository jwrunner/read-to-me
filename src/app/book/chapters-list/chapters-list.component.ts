import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IChapter } from 'src/app/_types/chapter.interface';
import { RouterHelperService } from '../../_services/router-helper.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap, map } from 'rxjs/operators';
import { BookService } from '../_services/book.service';

@Component({
  selector: 'rtm-chapters-list',
  templateUrl: './chapters-list.component.html',
  styleUrls: ['./chapters-list.component.scss']
})
export class ChaptersListComponent implements OnInit {

  chaptersObservable: Observable<IChapter[]>;
  addChapter = false;

  constructor(
    private routerHelper: RouterHelperService,
    private afs: AngularFirestore,
    public bookService: BookService,
  ) { }

  ngOnInit() {
    this.getChapters();
  }

  private getChapters() {
    this.chaptersObservable = this.routerHelper.bookId.pipe(
      switchMap(bookId => {
        if (bookId) {
          return this.afs.collection<IChapter>('chapters', ref => ref.where('bookId', '==', bookId).orderBy('dateCreated'))
            .snapshotChanges().pipe(
              map(arr => {
                return arr.map(snap => {
                  const data = snap.payload.doc.data() as IChapter;
                  const id = snap.payload.doc.id;
                  return {
                    id, ...data
                  };
                });
              })
            );
        } else {
          return of(null);
        }
      })
    );
  }
}
