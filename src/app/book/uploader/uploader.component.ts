import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { PageNumberDialogComponent } from './page-number-dialog/page-number-dialog.component';
import { IQueuedPage } from 'src/app/_types/queued-page.interface';

@Component({
  selector: 'rtm-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit {
  pageNumber = 1;
  isHovering: boolean;

  files: File[] = [];
  queuedPages: IQueuedPage[] = [];

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    // TODO: get last page scanned in this book (save as value on book doc)
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
  }

  decreasePageNumber() {
    this.pageNumber--;
  }

  writeInPageNumber() {
    const dialogRef = this.dialog.open(PageNumberDialogComponent);

    dialogRef.afterClosed().subscribe(returnedNumber => {
      if (returnedNumber) {
        this.pageNumber = returnedNumber;
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