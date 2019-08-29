// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule, MatFormFieldModule, MatInputModule,
  MatSnackBarModule, MatProgressBarModule, MatListModule, MatMenuModule, MatDialogModule
} from '@angular/material';

// App Misc
import { BookRoutingModule } from './book-routing.module';
import { ClickStopPropagationDirective } from '@r2m-common/directives/clickStopPropagation.directive';
import { DropZoneDirective } from '@r2m-common/directives/drop-zone.directive';
import { PrefixChapterNumberPipe } from '@r2m-common/pipes/prefix-chapter-number.pipe';

// Components
import { BooksHomeComponent } from './book-home/book-home.component';
import { ChaptersListComponent } from './chapters-list/chapters-list.component';
import { AddChapterComponent } from './add-chapter/add-chapter.component';
import { ChapterHomeComponent } from './chapter-home/chapter-home.component';
import { UploaderComponent } from './uploader/uploader.component';
import { UploadTaskComponent } from './uploader/upload-task/upload-task.component';
import { PageNumberDialogComponent } from './uploader/page-number-dialog/page-number-dialog.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


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
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatListModule,
    MatMenuModule,
    MatDialogModule,
    FontAwesomeModule,
  ],
  entryComponents: [
    PageNumberDialogComponent,
  ],
})
export class BookModule { }
