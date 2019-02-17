import { Component, OnInit, Inject } from '@angular/core';
import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

import { AuthService } from 'src/app/core/auth.service';
import { BookService } from '../_services/book.service';

@Component({
    selector: 'rtm-scan',
    templateUrl: './scan.component.html',
    styleUrls: ['./scan.component.scss']
})
export class ScanComponent implements OnInit {
    pageNumber = 1;

    isHovering: boolean;
    isUploading = false;

    task: AngularFireUploadTask;
    percentage: Observable<number>;
    downloadURL: Observable<string>;


    constructor(
        private storage: AngularFireStorage,
        private snackBar: MatSnackBar,
        private bookService: BookService,
        private auth: AuthService,
        private dialog: MatDialog,
    ) { }

    ngOnInit() {
        // TODO: get last page scanned in this book (save as value on book doc)
        // this.getBookmark();
    }

    toggleHover(event: boolean) {
        this.isHovering = event;
    }

    async startUpload(event: FileList) {
        if (this.isUploading) {
            return this.snackBar.open('Please wait for current image to finish uploading.', '', { duration: 3000 });
        }

        const file = event.item(0);

        if (file.type.split('/')[0] !== 'image') {
            return this.snackBar.open('Unsupported File Type', 'Dismiss', { duration: 6000, panelClass: 'snackbar-error' });
        }

        // Must be smaller than 20MB, http://www.unitconversion.org/data-storage/megabytes-to-bytes-conversion.html
        if (file.size > 20971520) {
            return this.snackBar.open('Images must be smaller than 20MB', 'Dismiss', { duration: 6000, panelClass: 'snackbar-error' });
        }

        this.isUploading = true;

        const book = await this.bookService.getBook();
        // const bookTitle = book.title.replace(/[^a-z0-9+]+/gi, '_');
        const chapter = await this.bookService.getChapter();
        const path = `scans/BK${book.id}_CH${chapter.id}_PG${this.pageNumber}_${new Date().getTime()}`;

        const { uid } = await this.auth.getUser();
        const customMetadata = { uid: uid };

        this.task = this.storage.upload(path, file, { customMetadata });
        this.percentage = this.task.percentageChanges();

        this.task.then(snap => {
            if (snap.state === 'success') {
                if (localStorage.getItem('user-knows-to-wait')) {
                    this.snackBar.open(`Page ${this.pageNumber} uploaded.`, '', { duration: 1000, verticalPosition: 'top' });
                } else {
                    // tslint:disable-next-line:max-line-length
                    this.snackBar.open(`Page ${this.pageNumber} uploaded. Wait a moment for the scanned page to show up or continue to scan the next page.`, 'Dismiss', { duration: 8000, verticalPosition: 'top' });
                    localStorage.setItem('user-knows-to-wait', 'yes');
                }
                this.pageNumber++;
                this.isUploading = false;
            }
        }).catch(() => {
            this.snackBar.open('Image Upload Failed', 'Dismiss', { duration: 10000, panelClass: 'snackbar-error' });
            this.isUploading = false;
        });
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

    increasePageNumber() {
        this.pageNumber++;
    }

    decreasePageNumber() {
        this.pageNumber--;
    }

    writeInPageNumber() {
        const dialogRef = this.dialog.open(PageNumberDialogComponent, {
            data: { pageNumber: this.pageNumber }
        });

        dialogRef.afterClosed().subscribe(returnedNumber => {
            if (returnedNumber) {
                this.pageNumber = returnedNumber;
            }
        });
    }
}

@Component({
    selector: 'rtm-page-number-dialog',
    template: `
        <div mat-dialog-content>
            <p>Set page number:</p>
            <mat-form-field>
                <input matInput [(ngModel)]="data.pageNumber" type="number" cdkFocusInitial>
            </mat-form-field>
        </div>
        <div mat-dialog-actions>
        <button mat-button (click)="onNoClick()">Cancel</button>
        <button mat-button [mat-dialog-close]="data.pageNumber" [disabled]="!data.pageNumber">Set</button>
        </div>`,
})
export class PageNumberDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<PageNumberDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
