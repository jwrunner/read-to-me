// import { Component, OnInit } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/firestore';
// import { AngularFireStorage } from '@angular/fire/storage';
// import { map } from 'rxjs/operators';

// export interface Page {
//     pageName: string;
//     text: string;
//     audioPath: string;
//     id: string;
// }

// @Component({
//     selector: 'rtm-listen',
//     templateUrl: './listen.component.html',
//     styleUrls: ['./listen.component.scss']
// })
// export class ListenComponent implements OnInit {

//     pages$;

//     step = -1;

//     constructor(
//         private afs: AngularFirestore,
//         private storage: AngularFireStorage,
//     ) { }

//     ngOnInit() {
//         this.getPages();
//     }

//     private getPages() {
//         this.pages$ = this.afs.collection<Page>('pages', ref => ref.orderBy('pageName')).snapshotChanges()
//             .pipe(
//                 map(arr => {
//                     return arr.map(snap => {
//                         const data = snap.payload.doc.data() as Page;
//                         const id = snap.payload.doc.id;
//                         return {
//                             id, ...data
//                         };
//                     });
//                 })
//             );
//     }

//     public setStep(index: number) {
//         this.step = index;
//     }

//     public nextStep() {
//         this.step++;
//     }

//     public prevStep() {
//         this.step--;
//     }

//     public audioEnded(i) {
//         this.step = i + 1;
//     }

//     public delete(id, pageName) {
//         // Delete the audio from FireStorage
//         // console.log('deleting', pageName);
//         const ref = this.storage.ref(pageName);
//         ref.delete();

//         // Remove the Firestore reference
//         this.afs.doc<Page>(`pages/${id}`).delete()
//             .then(() => {
//                 console.log('Page deleted');
//             });
//     }
// }
