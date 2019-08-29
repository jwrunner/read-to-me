import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RxfirestoreAuthService } from '@r2m-common/services/rxfirestore-auth.service';
import { IBook } from '@r2m-common/interfaces/book.interface';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'r2m-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss']
})
export class AddBookComponent implements OnInit {

  bookTitle: string;
  addingBook = false;

  constructor(
    private router: Router,
    private db: RxfirestoreAuthService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
  }

  async addBook() {
    if (this.bookTitle) {
      this.addingBook = true;

      const capitalizedBookTitle = this.bookTitle.replace(/^\w/, c => c.toUpperCase()).trim();
      const bookData: IBook = {
        title: capitalizedBookTitle,
        pages: 0,
      };

      const bookId = this.bookTitle
        .substr(0, 25)
        .trim()
        .replace(/\s+/g, '-')
        .toLowerCase();

      if (await this.db.docExists(`books/${bookId}`)) {
        this.snackBar.open(`A book already exists with that name. Please choose another name`, '', {
          duration: 6000,
          panelClass: 'snackbar-error'
        });
        this.addingBook = false;
      } else {
        await this.db.set<IBook>(`books/${bookId}`, bookData);
        this.router.navigate([`/${bookId}`]);
      }
    }
  }
}
