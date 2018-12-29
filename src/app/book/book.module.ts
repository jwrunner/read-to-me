import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookRoutingModule } from './book-routing.module';
import { BooksHomeComponent } from './book-home/book-home.component';
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
    BookRoutingModule,
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
export class BookModule { }
