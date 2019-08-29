import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RxfirestoreAuthService } from '@r2m-common/services/rxfirestore-auth.service';
import { IQueuedPage } from '@r2m-common/interfaces/queued-page.interface';
import { RouterHelperService } from '@r2m-common/services/router-helper.service';

@Component({
  selector: 'r2m-upload-task',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.scss']
})
export class UploadTaskComponent implements OnInit {

  @Input() queuedPage: IQueuedPage;
  @Output() removeFile = new EventEmitter<any>();

  percentage: Observable<number>;

  uploadComplete = false;
  errorUploading: string;

  constructor(
    private snackBar: MatSnackBar,
    private routerHelper: RouterHelperService,
    private db: RxfirestoreAuthService,
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

    const bookId = await this.routerHelper.getBookId();
    const chapterId = await this.routerHelper.getChapterId();
    const storagePath = `scans/${bookId}/${chapterId}/${this.queuedPage.pageNumber}_${new Date().getTime()}`;

    const { displayName, uid } = await this.db.getUser();
    const customMetadata = { uploadedBy: displayName, uid };

    const firebase = await import('firebase/app');
    const storage = await import('firebase/storage');
    const rxStorage = await import('rxfire/storage');

    const task = firebase.storage().ref(storagePath).put(this.queuedPage.file, { customMetadata });
    task.then(snap => {
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


    this.percentage = rxStorage.percentage(task).pipe(
      map(action => {
        return action.progress;
      })
    );
  }

  private removeFileFromQueue() {
    setTimeout(() => this.removeFile.emit(null), 6000);
  }
}
