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

const appRoutes: Routes = [
  // {
  //   path: 'compose',
  //   component: ComposeMessageComponent,
  //   outlet: 'popup'
  // },
   {
    path: '',
    redirectTo: '/console/dashboard',
    pathMatch: 'full',
    // canActivate: [CanActivateAuthGuard]
  },
  {
    // path: 'console',
    // loadChildren: 'app/admin/admin.module#AdminModule',
    // canLoad: [AuthGuard]
    // {
    path: 'console',
    component: ConsoleComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        children: [
          { path: '', redirectTo: '/console/dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
          // { path: 'heroes', component: ManageHeroesComponent },
          // { path: '', component: AdminDashboardComponent }
        ],
      }
    ]
  // },
  },
  // {
  //   path: 'crisis-center',
  //   loadChildren: 'app/crisis-center/crisis-center.module#CrisisCenterModule'
  // },
  // { path: '',   redirectTo: '/heroes', pathMatch: 'full' },
  // { path: '**', component: PageNotFoundComponent }
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
