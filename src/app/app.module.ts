// Angular
import { NgModule, ErrorHandler, Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

// Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatMenuModule, MatFormFieldModule, MatInputModule } from '@angular/material';

// App
import { environment } from '../environments/environment';
export const firebaseConfig = environment.firebaseConfig;
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { RouterHelperService } from './_services/router-helper.service';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { BookCardComponent } from './home/book-card/book-card.component';
import { AddBookComponent } from './home/add-book/add-book.component';

import * as Sentry from '@sentry/browser';
import { PlayerComponent } from './player/player.component';

Sentry.init({
  dsn: 'https://e983452f9c97438abf3426a607b5ead5@sentry.io/1380788'
});

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() {}
  handleError(error) {
    Sentry.captureException(error.originalError || error);
    throw error;
  }
}

const providers: any[] = [
  RouterHelperService,
];
if (environment.production) {
  providers.push(
    { provide: ErrorHandler, useClass: SentryErrorHandler });
}

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        HeaderComponent,
        BookCardComponent,
        AddBookComponent,
        PlayerComponent,
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
    providers,
    bootstrap: [AppComponent]
})
export class AppModule { }
