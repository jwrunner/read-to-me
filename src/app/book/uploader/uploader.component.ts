import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { PageNumberDialogComponent } from './page-number-dialog/page-number-dialog.component';
import { IQueuedPage } from '@r2m-common/interfaces/queued-page.interface';
import { RouterHelperService } from '@r2m-common/services/router-helper.service';
import { faPlus, faChevronUp, faChevronDown, faEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'r2m-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit {

  faPlus = faPlus;
  faChevronUp = faChevronUp;
  faChevronDown = faChevronDown;
  faEdit = faEdit;

  pageNumber = 1;
  isHovering: boolean;

  files: File[] = [];
  queuedPages: IQueuedPage[] = [];

  constructor(
    private dialog: MatDialog,
    private routerHelperService: RouterHelperService,
  ) { }

  ngOnInit() {
    this.getPageNumber();
  }

  private async getPageNumber() {
    const bookId = await this.routerHelperService.getBookId();
    if (localStorage.getItem(`${bookId}-currentPage`)) {
      this.pageNumber = +localStorage.getItem(`${bookId}-currentPage`);
    }
  }

  private async setPageNumber() {
    const bookId = await this.routerHelperService.getBookId();
    localStorage.setItem(`${bookId}-currentPage`, this.pageNumber.toString());
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.queuedPages.push({ pageNumber: this.pageNumber, file: files.item(i) });
      this.increasePageNumber();
    }
  }

  increasePageNumber() {
    this.pageNumber++;
    this.setPageNumber();
  }

  decreasePageNumber() {
    this.pageNumber--;
    this.setPageNumber();
  }

  writeInPageNumber() {
    const dialogRef = this.dialog.open(PageNumberDialogComponent);

    dialogRef.afterClosed().subscribe(returnedNumber => {
      if (returnedNumber) {
        this.pageNumber = returnedNumber;
        this.setPageNumber();
      }
    });
  }

  removeFileFromQueue(i: number) {
    this.queuedPages.splice(i, 1);
  }
}

// TODO convert this to look at latest page uploaded to chapter
    // private async getBookmark() {
    //     const savedBookmark = await this.afs.doc<Bookmark>('settings/bookmark').valueChanges().pipe(first()).toPromise();
    //     console.log(savedBookmark);
    //     return this.bookmark = savedBookmark;
    // }

    // public setBookmark() {
    //     return this.afs.doc<Bookmark>('settings/bookmark').set(this.bookmark);
    // }

    // public clearBookmark() {
    //     this.bookmark = {
    //         book: '',
    //         chapter: 1,
    //         page: 1,
    //     };
    //     return this.afs.doc<Bookmark>('settings/bookmark').set(this.bookmark);
    // }