import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { MatButtonModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, MatProgressBarModule } from '@angular/material';

import { BookRoutingModule } from './book-routing.module';
import { BookService } from './_services/book.service';

import { BooksHomeComponent } from './book-home/book-home.component';
import { ChaptersListComponent } from './chapters-list/chapters-list.component';
import { AddChapterComponent } from './add-chapter/add-chapter.component';
import { ChapterCardComponent } from './chapter-card/chapter-card.component';
import { ChapterHomeComponent } from './chapter-home/chapter-home.component';

import { ScanComponent } from './scan/scan.component';
import { DropZoneDirective } from './scan/drop-zone.directive';

@NgModule({
  declarations: [
    BooksHomeComponent,
    ChaptersListComponent,
    AddChapterComponent,
    ChapterCardComponent,
    ChapterHomeComponent,
    DropZoneDirective,
    ScanComponent,
  ],
  imports: [
    CommonModule,
    BookRoutingModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressBarModule,
  ],
  providers: [
    BookService,
  ]
})
export class BookModule { }
