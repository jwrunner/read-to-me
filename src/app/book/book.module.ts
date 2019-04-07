// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import {
  MatButtonModule, MatFormFieldModule, MatInputModule,
  MatSnackBarModule, MatProgressBarModule, MatListModule, MatMenuModule, MatDialogModule
} from '@angular/material';

// App Misc
import { BookRoutingModule } from './book-routing.module';
import { BookService } from './_services/book.service';
import { PrefixChapterNumberPipe } from '../_pipes/prefix-chapter-number.pipe';
import { ClickStopPropagationDirective } from '../_directives/clickStopPropagation.directive';
import { DropZoneDirective } from '../_directives/drop-zone.directive';

// Components
import { BooksHomeComponent } from './book-home/book-home.component';
import { ChaptersListComponent } from './chapters-list/chapters-list.component';
import { AddChapterComponent } from './add-chapter/add-chapter.component';
import { ChapterHomeComponent } from './chapter-home/chapter-home.component';
import { UploaderComponent } from './uploader/uploader.component';
import { UploadTaskComponent } from './uploader/upload-task/upload-task.component';
import { PageNumberDialogComponent } from './uploader/page-number-dialog/page-number-dialog.component';


@NgModule({
  declarations: [
    BooksHomeComponent,
    ChaptersListComponent,
    AddChapterComponent,
    ChapterHomeComponent,
    DropZoneDirective,
    PrefixChapterNumberPipe,
    ClickStopPropagationDirective,
    PageNumberDialogComponent,
    UploaderComponent,
    UploadTaskComponent,
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
    MatListModule,
    MatMenuModule,
    MatDialogModule,
  ],
  entryComponents: [
    PageNumberDialogComponent,
  ],
  providers: [
    BookService,
  ]
})
export class BookModule { }
