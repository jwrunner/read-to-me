import { Component, OnInit } from '@angular/core';
import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
// import { AngularFirestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { BookService } from '../_services/book.service';
import { AuthService } from 'src/app/core/auth.service';

@Component({
    selector: 'rtm-scan',
    templateUrl: './scan.component.html',
    styleUrls: ['./scan.component.scss']
})
export class ScanComponent implements OnInit {
    page = 1;

    isHovering: boolean;
    isUploading = false;

    task: AngularFireUploadTask;
    percentage: Observable<number>;
    downloadURL: Observable<string>;


    constructor(
        // private afs: AngularFirestore,
        private storage: AngularFireStorage,
        private snackBar: MatSnackBar,
        private bookService: BookService,
        private auth: AuthService,
    ) { }

    ngOnInit() {
        // this.getBookmark();
        // TODO: get last page scanned in this book (save as value on book doc)
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
        const chapter = await this.bookService.getChapter();
        const path = `scans/BK_${book.id}_CH_${chapter.id}_PG_${this.page}_${new Date().getTime()}`;

        const { uid } = await this.auth.getUser();
        const customMetadata = { uid: uid };

        this.task = this.storage.upload(path, file, { customMetadata });
        this.percentage = this.task.percentageChanges();

        this.task.then(snap => {
            if (snap.state === 'success') {
                // tslint:disable-next-line:max-line-length
                this.snackBar.open(`Page ${this.page} uploaded. Wait a moment for the scanned page to show up or continue to scan the next page.`, 'Dismiss', { duration: 8000 });
                this.page++;
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
}

