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

const routes: Routes = [

  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
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
