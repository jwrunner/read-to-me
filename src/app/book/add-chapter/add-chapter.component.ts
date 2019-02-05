import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { AngularFirestore, Action, DocumentSnapshotDoesNotExist, DocumentSnapshotExists } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { Chapter } from 'src/app/_types/chapter.interface';
import { take } from 'rxjs/operators';
import { BookService } from '../_services/book.service';
import { RouterHelperService } from '../../_services/router-helper.service';

@Component({
  selector: 'rtm-add-chapter',
  templateUrl: './add-chapter.component.html',
  styleUrls: ['./add-chapter.component.scss']
})
export class AddChapterComponent implements OnInit {

  chapterId: string;
  chapterTitle: string;
  addingChapter = false;

  constructor(
    private router: Router,
    private auth: AuthService,
    private afs: AngularFirestore,
    private bookService: BookService,
    private routerHelper: RouterHelperService,
  ) { }

  ngOnInit() {
  }

  async addChapter() {
    if (this.chapterId) {
      this.addingChapter = true;

      const { uid, displayName } = await this.auth.getUser();
      const chapterData: Chapter = {
        id: this.chapterId,
        title: this.chapterTitle || null,
        ownerId: uid,
        ownerName: displayName || null,
        dateCreated: firestore.FieldValue.serverTimestamp(),
        pages: 0,
      };

      const bookId = await this.routerHelper.getBookId();
      await this.addIfNew(`books/${bookId}/chapters/${this.chapterId}`, chapterData);
      this.router.navigate([`/book/${bookId}/${this.chapterId}`]);
    }
  }

  private addIfNew<T>(ref: string, data: Chapter): Promise<void> {
    const doc = this.afs.doc(ref).snapshotChanges()
      .pipe(take(1))
      .toPromise();

    return doc.then((snap: Action<DocumentSnapshotDoesNotExist | DocumentSnapshotExists<T>>) => {
      return snap.payload.exists ? this.duplicate() : this.afs.doc(ref).set(data);
    });
  }

  private duplicate() {
    console.log('this chapter is already created');
  }
}
