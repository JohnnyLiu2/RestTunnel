import { DatePipe } from '@angular/common';
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
import { AppRoutingModule } from './Common/app-routing.module';
import { ConsoleComponent } from './console/console.component';
import { LoginRoutingModule } from './Common/login-routing.module';
import { FormsModule }        from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BoxChartComponent } from './dashboard/widgets/box-chart/box-chart.component';
import { UserService } from './Common/user.service';
import { DashboardQueryService } from './data.service.ts/dashboard-query.service';


const components: any[] = [
  AppComponent,
  LoginComponent,
  DashboardComponent,
  NavbarComponent,
  MainMenuComponent,
  FooterComponent,
  ConsoleComponent,
  BoxChartComponent,
];

@NgModule({
  declarations: components,
  imports: [
    BrowserModule,
    AppRoutingModule,
    LoginRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [UserService, DatePipe, DashboardQueryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
