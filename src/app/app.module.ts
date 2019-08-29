import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Injectable, ErrorHandler } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HeaderComponent } from './header/header.component';
import { FirstNamePipe } from './header/first-name.pipe';
import { MatSnackBarModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as Sentry from '@sentry/browser';
import { PlayerComponent } from './player/player.component';

Sentry.init({
  dsn: 'https://e983452f9c97438abf3426a607b5ead5@sentry.io/1380788'
});

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() { }
  handleError(error) {
    Sentry.captureException(error.originalError || error);
    throw error;
  }
}

const providers: any[] = [];
if (environment.production) {
  providers.push(
    { provide: ErrorHandler, useClass: SentryErrorHandler });
}
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PlayerComponent,
    FirstNamePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    MatSnackBarModule,
    MatProgressBarModule,
    FontAwesomeModule,
    MatButtonModule,
  ],
  providers,
  bootstrap: [AppComponent]
})
export class AppModule { }
