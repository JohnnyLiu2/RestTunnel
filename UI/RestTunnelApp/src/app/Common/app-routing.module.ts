// tslint:disable-next-line:import-spacing
import { NgModule }     from '@angular/core';
import {
  RouterModule, Routes,
} from '@angular/router';

// import { ComposeMessageComponent } from './compose-message.component';
// import { PageNotFoundComponent }   from './not-found.component';

// import { CanDeactivateGuard }      from './can-deactivate-guard.service';
import { AuthGuard } from './auth-guard.service';
import { ConsoleComponent } from '../console/console.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { QrAuthComponent } from '../qr-auth/qr-auth.component';

const appRoutes: Routes = [
   {
    path: '',
    redirectTo: '/console/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'qr-auth',
    component: QrAuthComponent,
  },
  {
    path: 'console',
    component: ConsoleComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        children: [
          { path: '', redirectTo: '/console/dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: DashboardComponent },
        ],
      }
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
    )
  ],
  exports: [
    RouterModule
  ],
  providers: [
    // CanDeactivateGu
    AuthGuard
 ]
})
export class AppRoutingModule {}
