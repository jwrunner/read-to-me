import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

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
) {}

  ngOnInit() {
    this.pages$ = this.afs.collection<Page>('pages', ref => ref.orderBy('pageName')).valueChanges();
  }
}
