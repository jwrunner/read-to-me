import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';

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
    private storage: AngularFireStorage,
) {}

  ngOnInit() {
    this.pages$ = this.afs.collection<Page>('pages', ref => ref.orderBy('pageName')).valueChanges();
  }

  public getUrl(audioPath) {
    const ref = this.storage.ref(audioPath);
    ref.getDownloadURL().toPromise().then(url => {
      return url;
    })
    .catch(err => {
      console.log(err);
    });
  }
}
