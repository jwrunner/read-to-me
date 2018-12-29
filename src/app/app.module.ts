// Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

// App
import { environment } from '../environments/environment';
export const firebaseConfig = environment.firebaseConfig;
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { MatButtonModule, MatMenuModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { CoreModule } from './core/core.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { BookCardComponent } from './home/book-card/book-card.component';
import { AddBookComponent } from './home/add-book/add-book.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        HeaderComponent,
        BookCardComponent,
        AddBookComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFirestoreModule.enablePersistence({ experimentalTabSynchronization: true }),
        CoreModule,
        FormsModule,
        MatFormFieldModule, MatInputModule,
        MatButtonModule, MatMenuModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
