// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
// import { RxfirestoreAuthService } from '@r2m-common/services/rxfirestore-auth.service';

// import { MatSnackBar } from '@angular/material/snack-bar';

// @Injectable({
//     providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {
//     constructor(
//         private db: RxfirestoreAuthService,
//         private router: Router,
//         private snackBar: MatSnackBar
//     ) { }

//     async canActivate(
//         next: ActivatedRouteSnapshot,
//         state: RouterStateSnapshot): Promise<boolean> {

//         const user = await this.db.getUser();
//         if (!user) {
//             this.setRedirectUrl(state.url);
//             this.router.navigate(['/user/login']);
//             this.snackBar.open('Please login first', '', { duration: 3000 });
//         }
//         return !!user;
//     }

//     private setRedirectUrl(url) {
//         this.db.redirectUrl = url;
//     }
// }
