import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { AddBookComponent } from './add-book/add-book.component';
import { MatListModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
    imports: [
        CommonModule,
        HomeRoutingModule,
        MatListModule,
        MatFormFieldModule, MatInputModule, MatButtonModule,
        MatSnackBarModule,
        FormsModule,
        FontAwesomeModule,
    ],
    declarations: [
        HomeComponent,
        AddBookComponent,
    ],
})
export class HomeModule { }
