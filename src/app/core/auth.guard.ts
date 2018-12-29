import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private auth: AuthService,
        private router: Router,
        private snackBar: MatSnackBar
    ) { }

    async canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Promise<boolean> {

        const user = await this.auth.getUser();
        if (!user) {
            this.router.navigate(['/user/login']);
            this.snackBar.open('Please Login', '', { duration: 3000 });
        }
        return !!user;
    }
}
