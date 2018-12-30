import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookRoutingModule } from './book-routing.module';
import { BooksHomeComponent } from './book-home/book-home.component';
import { BookService } from './_services/book.service';
import { ChaptersListComponent } from './chapters-list/chapters-list.component';
import { MatButtonModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { AddChapterComponent } from './add-chapter/add-chapter.component';
import { ChapterCardComponent } from './chapter-card/chapter-card.component';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { ChapterHomeComponent } from './chapter-home/chapter-home.component';
import { RouterHelperService } from './_services/router-helper.service';

@NgModule({
  declarations: [
    BooksHomeComponent,
    ChaptersListComponent,
    AddChapterComponent,
    ChapterCardComponent,
    ChapterHomeComponent,
    // DropZoneDirective,
    // ListenComponent,
    // ScanComponent,
  ],
  imports: [
    CommonModule,
    BookRoutingModule,
    // AngularFireStorageModule,
    AngularFirestoreModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    // MatExpansionModule,
  ],
  providers: [
    BookService,
    RouterHelperService,
  ]
})
export class BookModule { }
