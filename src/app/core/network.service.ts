import { Injectable } from '@angular/core';
// import { SwPush } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private _online = new BehaviorSubject<boolean>(true);
  online = this._online.asObservable();

  constructor(
    // private swPush: SwPush,
    private snackBar: MatSnackBar,
    private swUpdate: SwUpdate,
  ) {
    this.subscribeToUpdates();
    this.watchOnlineStatus();
    // this.subscribeToPushMessages();
  }

  private subscribeToUpdates() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(event => {
        const snackBarRef = this.snackBar.open('New Version Available', 'Reload', { duration: 5000 });
        snackBarRef.onAction().subscribe(() => window.location.reload());
      });
    }
  }

  private watchOnlineStatus() {
    if (navigator.onLine) {
      this._online.next(true);
    } else {
      this._online.next(false);
    }

    window.addEventListener('online', () => {
      this._online.next(true);
    });

    window.addEventListener('offline', () => {
      this._online.next(false);
    });
  }

  // subscribeToPushMessages() {
  //   // not going to work if service isn't initiated by something else
  //   this.swPush.messages.subscribe(message => {
  //     console.log('new push message', message);
  //     this.snackBar.open(`${message}`, '', { duration: 5000 });
  //   });
  // }

  // activateUpdate() {
  //     if (environment.production) {
  //         this.swUpdate.activateUpdate().then(() => {
  //             window.location.reload(true);
  //         });
  //     }
  // }
}
