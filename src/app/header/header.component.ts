import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'rtm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    public auth: AuthService,
  ) { }

  ngOnInit() {
  }

  showFirstName(name: string): string {
    return name.split(' ')[0];
  }
}
