import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { FooterComponent } from './footer/footer.component';
import { CanActivateAuthGuard } from './Common/CanActivateAuthGuard';
import { ConsoleComponent } from './console/console.component';


const routes: Routes = [

  {
    path: '',
    redirectTo: '/console',
    pathMatch: 'full',
    canActivate: [CanActivateAuthGuard]
  },
  {
    path: 'console',
    component: ConsoleComponent,
    // canActivate: [CanActivateAuthGuard],
    children: [
      {
        path: '',
        children: [
          { path: '', redirectTo: '/console/dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: DashboardComponent },
          // { path: 'heroes', component: ManageHeroesComponent },
          // { path: '', component: AdminDashboardComponent }
        ],
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  // {
  //   path: 'detail/:id',
  //   component: HeroDetailComponent
  // },
  // {
  //   path: 'hero/:id',
  //   component: HeroComponent
  // },
  // {
  //   path: 'about',
  //   component: AboutComponent
  // },
  // {
  //   path: 'info',
  //   component: InfoComponent
  // }

];

const components: any[] = [
  AppComponent,
  LoginComponent,
  DashboardComponent,
  NavbarComponent,
  MainMenuComponent,
  FooterComponent,
  ConsoleComponent,
];

@NgModule({
  declarations: components,
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
