import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListenComponent } from './listen/listen.component';
import { ScanComponent } from './scan/scan.component';

const routes: Routes = [
  { path: '', redirectTo: 'scan', pathMatch: 'full' },
  { path: 'scan', pathMatch: 'full', component: ScanComponent },
  { path: 'listen', pathMatch: 'full', component: ListenComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
