import { Component, OnInit } from '@angular/core';
import { RxfirestoreAuthService } from '@r2m-common/services/rxfirestore-auth.service';

@Component({
  selector: 'r2m-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss']
})
export class UserAccountComponent implements OnInit {

  constructor(
    public db: RxfirestoreAuthService,
  ) { }

  ngOnInit() {
  }

}
