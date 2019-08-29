import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RxfirestoreAuthService } from '@r2m-common/services/rxfirestore-auth.service';
import { RouterHelperService } from '@r2m-common/services/router-helper.service';
import { IChapter } from '@r2m-common/interfaces/chapter.interface';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'r2m-add-chapter',
  templateUrl: './add-chapter.component.html',
  styleUrls: ['./add-chapter.component.scss']
})
export class AddChapterComponent implements OnInit {

  chapterName: string;
  addingChapter = false;

  constructor(
    private router: Router,
    private db: RxfirestoreAuthService,
    private routerHelper: RouterHelperService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
  }

  async addChapter() {
    if (this.chapterName) {
      this.addingChapter = true;

      const bookId = await this.routerHelper.getBookId();

      const chapterData: IChapter = {
        name: this.chapterName.trim(),
        pages: 0,
      };

      const chapterId = this.chapterName
        .substr(0, 25)
        .trim()
        .replace(/\s+/g, '-')
        .toLowerCase();

      if (await this.db.docExists(`books/${bookId}/chapters/${chapterId}`)) {
        this.snackBar.open(`A chapter already exists with that name. Please choose another chapter`, '', {
          duration: 6000,
          panelClass: 'snackbar-error'
        });
        this.addingChapter = false;
      } else {
        await this.db.set<IChapter>(`books/${bookId}/chapters/${chapterId}`, chapterData);
        this.router.navigate([`/${bookId}/${chapterId}`]);
      }

    }
  }
}
