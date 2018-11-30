import { Component, AfterViewInit } from '@angular/core';
import { SwUpdate, SwPush } from '@angular/service-worker';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  constructor(
    private swUpdate: SwUpdate,
    private swPush: SwPush,
  ) { }

  ngAfterViewInit() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(event => {
        console.log('current version is', event.current);
        console.log('available version is', event.available);
        if (confirm('Load new version?')) {
          window.location.reload();
        }
      });
    }

    this.swPush.messages.subscribe(message => {
      console.log('Push message received', message);
    });
  }

  activateUpdate() {
    if (environment.production) {
      this.swUpdate.activateUpdate().then(() => {
        window.location.reload(true);
      });
    }
  }
}
