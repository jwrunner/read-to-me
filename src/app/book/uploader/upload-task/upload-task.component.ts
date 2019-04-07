import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';

import { IQueuedPage } from 'src/app/_types/queued-page.interface';
import { BookService } from '../../_services/book.service';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'rtm-upload-task',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.scss']
})
export class UploadTaskComponent implements OnInit {

  @Input() queuedPage: IQueuedPage;
  @Output() removeFile = new EventEmitter<any>();

  task: AngularFireUploadTask;
  percentage: Observable<number>;
  downloadURL: Observable<string>;

  uploadComplete = false;
  errorUploading: string;

  constructor(
    private storage: AngularFireStorage,
    private snackBar: MatSnackBar,
    private bookService: BookService,
    private auth: AuthService,
  ) { }

  ngOnInit() {
    this.startUpload();
  }

  private async startUpload() {
    if (this.queuedPage.file.type.split('/')[0] !== 'image') {
      this.errorUploading = 'Unsupported File Type';
      return this.removeFileFromQueue();
    }

    // Must be smaller than 20MB, http://www.unitconversion.org/data-storage/megabytes-to-bytes-conversion.html
    if (this.queuedPage.file.size > 20971520) {
      this.errorUploading = 'Images must be smaller than 20MB';
      return this.removeFileFromQueue();
    }

    const book = await this.bookService.getBook();
    // const bookTitle = book.title.replace(/[^a-z0-9+]+/gi, '_');
    const chapter = await this.bookService.getChapter();
    const path = `scans/BK${book.id}_CH${chapter.id}_PG${this.queuedPage.pageNumber}_${new Date().getTime()}`;

    const { uid } = await this.auth.getUser();
    const customMetadata = { uid: uid };

    this.task = this.storage.upload(path, this.queuedPage.file, { customMetadata });
    this.percentage = this.task.percentageChanges();

    this.task.then(snap => {
      if (snap.state === 'success') {
        if (localStorage.getItem('user-knows-to-wait')) {
          this.snackBar.open(`Page ${this.queuedPage.pageNumber} uploaded.`, '', { duration: 1000, verticalPosition: 'top' });
        } else {
          // tslint:disable-next-line:max-line-length
          this.snackBar.open(`Page ${this.queuedPage.pageNumber} uploaded. Wait a moment for the scanned page to show up or continue to scan the next page.`, 'Dismiss', { duration: 8000, verticalPosition: 'top' });
          localStorage.setItem('user-knows-to-wait', 'yes');
        }
        this.removeFileFromQueue();
        this.uploadComplete = true;
      }
    }).catch(() => {
      this.errorUploading = 'Image Upload Failed';
      this.removeFileFromQueue();
    });
  }

  private removeFileFromQueue() {
    setTimeout(() => this.removeFile.emit(null), 6000);
  }
}
