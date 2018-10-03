import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
// import { AngularFireStorage } from 'angularfire2/storage';
// import { first } from 'rxjs/operators';

export interface Page {
    pageName: string;
    text: string;
    audioPath?: string;
}

@Component({
    selector: 'app-listen',
    templateUrl: './listen.component.html',
    styleUrls: ['./listen.component.scss']
})
export class ListenComponent implements OnInit {

    pages$;

    constructor(
        private afs: AngularFirestore,
        // private storage: AngularFireStorage,
    ) { }

    ngOnInit() {
        this.pages$ = this.afs.collection<Page>('pages', ref => ref.orderBy('pageName')).valueChanges();
    }

    // public getUrl(pageName) {
    //     const path = `${pageName}`;
    //     const ref = this.storage.ref(path);
    //     return ref.getDownloadURL().pipe(first()).subscribe(
    //         url => {
    //             console.log(pageName, ' url: ', url);
    //             return url;
    //         }
    //     );
    // }
}
