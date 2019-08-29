import { Component, AfterViewInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { RxfirestoreAuthService } from '@r2m-common/services/rxfirestore-auth.service';

@Component({
  selector: 'r2m-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit {

  constructor(
    public db: RxfirestoreAuthService,
    private swUpdate: SwUpdate,
  ) { }

  ngAfterViewInit() {
    this.subscribeToUpdates();
  }

  private subscribeToUpdates() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => { window.location.reload(); });
    }
  }

}
