import { Component, OnInit } from '@angular/core';
import { firestore } from 'firebase/app';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Book } from 'src/app/_types/book.interface';

@Component({
  selector: 'rtm-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss']
})
export class AddBookComponent implements OnInit {

  bookTitle: string;
  addingBook = false;

  constructor(
    private router: Router,
    public auth: AuthService,
    private afs: AngularFirestore,
  ) { }

  ngOnInit() {
  }

  async addBook() {
    if (this.bookTitle) {
      this.addingBook = true;

      const capitalizedBookTitle = this.bookTitle.replace(/^\w/, c => c.toUpperCase());
      const { uid, displayName } = await this.auth.getUser();
      const bookData: Book = {
        title: capitalizedBookTitle,
        ownerId: uid,
        ownerName: displayName || null,
        dateCreated: firestore.FieldValue.serverTimestamp(),
        pages: 0,
      };

      const docRef = await this.afs.collection('books').add(bookData);
      this.router.navigate([`/book/${docRef.id}`]);
    }
  }

}
