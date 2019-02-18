import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/core/auth.service';
import { IChapter } from 'src/app/_types/chapter.interface';
import { RouterHelperService } from '../../_services/router-helper.service';

@Component({
  selector: 'rtm-add-chapter',
  templateUrl: './add-chapter.component.html',
  styleUrls: ['./add-chapter.component.scss']
})
export class AddChapterComponent implements OnInit {

  chapterName: string;
  addingChapter = false;

  constructor(
    private router: Router,
    private auth: AuthService,
    private afs: AngularFirestore,
    private routerHelper: RouterHelperService,
  ) { }

  ngOnInit() {
  }

  async addChapter() {
    if (this.chapterName) {
      this.addingChapter = true;

      const { uid, displayName } = await this.auth.getUser();
      const bookId = await this.routerHelper.getBookId();

      const chapterData: IChapter = {
        name: this.chapterName,
        ownerId: uid,
        ownerName: displayName || null,
        bookId: bookId,
        dateCreated: Date.now(),
        pages: 0,
      };

      const docRef = await this.afs.collection('chapters').add(chapterData);
      this.router.navigate([`/book/${bookId}/${docRef.id}`]);
    }
  }
}
