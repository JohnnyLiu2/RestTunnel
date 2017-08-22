import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../Common/user.service';
import { Router } from '@angular/router';
import { httpGet, extractJSON, extractResponseModel } from '../Common/http';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userInfo: User;

  constructor(private userService: UserService, private router: Router) {}

  getCurrentUserInfo(userInfoCallback: (userInfo: User) => void) {
    httpGet('/api/v1/user/current').then(extractJSON).then(extractResponseModel).then(o => {
      let userInfo = o.data as User;
      if (userInfoCallback) {
        userInfoCallback(userInfo);
      }
    });
  }

  ngOnInit() {
    // const info = localStorage['userInfo'];
    // if (info) {
    //   this.userInfo = JSON.parse(info) as User;
    //   console.log(this.userInfo);
    // }else {
      this.getCurrentUserInfo(o => {
        this.userInfo = o;
      });
    // }
  }



  logout() {
    localStorage['userInfo'] = null;
    localStorage['authToken'] = null;
    localStorage['accessCode'] = null;
    this.userService.userInfo = null;
    const navigateToLogin = () => { this.router.navigate(['/login']); };
    httpGet('/api/v1/security/logout').then(extractJSON).then(o => {
      navigateToLogin();
    }).catch(error => {
      navigateToLogin();
    });


  }

}
