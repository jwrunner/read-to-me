import { Component } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'app-scan',
    templateUrl: './scan.component.html',
    styleUrls: ['./scan.component.scss']
})
export class ScanComponent {
    book: string;
    chapter = 1;
    page = 1;

    // Main task
    task: AngularFireUploadTask;

    // Progress monitoring
    percentage: Observable<number>;

    snapshot: Observable<any>;

    // Download URL
    downloadURL: Observable<string>;

    // State for dropzone CSS toggling
    isHovering: boolean;

    constructor(private storage: AngularFireStorage) { }


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
        const path = `${this.book}_ch${this.chapter}_p${this.page}`;

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
                    this.page++;
                }
            })
        );
    }
}

