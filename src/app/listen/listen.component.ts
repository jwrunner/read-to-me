import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Subscription } from 'rxjs';

export interface Page {
  filePath: string;
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
) {}

  ngOnInit() {
    this.pages$ = this.afs.collection('pages', ref => ref.orderBy('filePath')).valueChanges();
  }
}
