import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'rtm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  showingHome = true;

  constructor(
    public auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects === '/') {
          this.showingHome = true;
        } else {
          this.showingHome = false;
        }
      }
    });
  }

  showFirstName(name: string): string {
    return name.split(' ')[0];
  }
}
