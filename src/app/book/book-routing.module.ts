import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BooksHomeComponent } from './book-home/book-home.component';
import { ChapterHomeComponent } from './chapter-home/chapter-home.component';
import { ChaptersListComponent } from './chapters-list/chapters-list.component';

const routes: Routes = [
  {
    path: ':bookId',
    component: BooksHomeComponent,
    children: [
      {
        path: '',
        component: ChaptersListComponent,
      },
      {
        path: ':chapterId',
        component: ChapterHomeComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookRoutingModule { }
