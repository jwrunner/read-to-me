import { Component, OnInit } from '@angular/core';
import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { tap, first } from 'rxjs/operators';

export interface Bookmark {
    book: string;
    chapter: number;
    page: number;
}

@Component({
    selector: 'rtm-scan',
    templateUrl: './scan.component.html',
    styleUrls: ['./scan.component.scss']
})
export class ScanComponent implements OnInit {
    bookmark: Bookmark = {
        book: '',
        chapter: 1,
        page: 1,
    };

    // Main task
    task: AngularFireUploadTask;

    // Progress monitoring
    percentage: Observable<number>;

    snapshot: Observable<any>;

    // Download URL
    downloadURL: Observable<string>;

    // State for dropzone CSS toggling
    isHovering: boolean;

    constructor(
        private afs: AngularFirestore,
        private storage: AngularFireStorage,
    ) { }

    ngOnInit() {
        this.getBookmark();
    }

    toggleHover(event: boolean) {
        this.isHovering = event;
    }


    startUpload(event: FileList) {
        const file = event.item(0);

        // Client-side validation for images
        if (file.type.split('/')[0] !== 'image') {
            console.error('unsupported file type :( ');
            return;
        }

        // The storage path
        const path = `${this.bookmark.book}_ch${this.bookmark.chapter}_p${this.bookmark.page}`;

        // Totally optional metadata
        const customMetadata = { Date: `scans/${new Date().getTime()}` };

        // The main task
        this.task = this.storage.upload(path, file, { customMetadata });

        // Progress monitoring
        this.percentage = this.task.percentageChanges();
        this.snapshot = this.task.snapshotChanges().pipe(
            tap(snap => {
                console.log(snap);
                if (snap.bytesTransferred === snap.totalBytes) {
                    this.bookmark.page++;
                    this.setBookmark();
                }
            })
        );
    }

    private async getBookmark() {
        const savedBookmark = await this.afs.doc<Bookmark>('settings/bookmark').valueChanges().pipe(first()).toPromise();
        console.log(savedBookmark);
        return this.bookmark = savedBookmark;
    }

    public setBookmark() {
        return this.afs.doc<Bookmark>('settings/bookmark').set(this.bookmark);
    }

    public clearBookmark() {
        this.bookmark = {
            book: '',
            chapter: 1,
            page: 1,
        };
        return this.afs.doc<Bookmark>('settings/bookmark').set(this.bookmark);
    }
}

