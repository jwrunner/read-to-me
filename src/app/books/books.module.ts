import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BooksRoutingModule } from './books-routing.module';
import { BooksHomeComponent } from './books-home/books-home.component';
import { BookService } from './_services/book.service';
// import { ScanComponent } from './scan/scan.component';

@NgModule({
  declarations: [
    BooksHomeComponent,
    // DropZoneDirective,
    // ListenComponent,
    // ScanComponent,
  ],
  imports: [
    CommonModule,
    BooksRoutingModule,
    // AngularFireStorageModule,
    // AngularFirestoreModule,
    // FormsModule,
    // MatToolbarModule,
    // MatButtonModule,
    // MatFormFieldModule,
    // MatInputModule,
    // MatExpansionModule,

  ],
  providers: [
    BookService,
  ]
})
export class BooksModule { }
