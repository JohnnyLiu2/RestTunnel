import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../Common/user.service';
import { Router } from '@angular/router';
import { httpGet, extractJSON } from '../Common/http';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userInfo: User;

  constructor(private userService: UserService, private router: Router) {
    this.userInfo = JSON.parse(localStorage['userInfo']) as User;
    console.log(this.userInfo);

  }

  ngOnInit() {

  }

  logout() {
    httpGet('/api/v1/security/logout').then(extractJSON).then(o => {
      this.router.navigate(['/login']);
    }).catch(error => {
      this.router.navigate(['/login']);
    });
    localStorage['userInfo'] = null;
      localStorage['authToken'] = null;
      localStorage['accessCode'] = null;
      this.userService.userInfo = null;

  }

}
