import { Component, OnInit } from '@angular/core';
// import { } from '../common/http';
import { HttpOptions, httpGet, extractJSON, extractResponseModel, httpPost, FORM_CONTENT_TYPE } from '../Common/http';
import { Router } from '@angular/router';
import { User, UserService } from '../Common/user.service';
import $ from 'jquery';
import 'jquery-easy-loading';
// import { loading } from 'jquery-easy-loading';

declare function showCommonModal(): any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // user: string;
  token: string;
  message = '\u00a0';
  accessKey: string;
  error: boolean;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {

    window.addEventListener('resize', () => {

      $('form').loading('resize');

    });
  }

  ngOnDestroy() {
    $('form').loading('destroy');
  }

  submit() {
    $('form').loading('start');

    console.log(this.accessKey);


    localStorage['authToken'] = null;
    localStorage['accessCode'] = this.accessKey;
    let data = 'authToken=' + encodeURIComponent(this.token);
    httpPost('/api/v1/security/login', FORM_CONTENT_TYPE, data)
    .then(extractJSON)
    .then(extractResponseModel)
    .then(o => {
      if (o.data) {
        this.message = 'Login pass...';
        localStorage['authToken'] = o.data['token'];
      }

      this.router.navigate(['/console/dashboard']);
      $('form').loading('stop');

    }).catch(error => {
      this.error = true;
      let response = error.response;
      let tmp = !response ? error.message :
          response.headers.get('Content-Type').indexOf('application/json') === 0 ?
              response.json().then((o: any) => o.error) :
              response.statusText;
      Promise.resolve(tmp).then(message => {
        this.message = message;
        $('form').loading('stop');
      });
    });

    // httpGet('/api/mtoken',
    //   {headers: {'Custom-Code': this.customCode, 'Content-Type': FORM_CONTENT_TYPE}})
    // .then(extractJSON)
    // .then(login)
    // .then(extractResponseModel)
    // .then(o => {
    //   // console.log(o.status);

    //   if (o.data) {
    //     // if (this.customCode) {
    //     //   localStorage['custom-code'] = this.customCode;
    //     //   console.log(localStorage['custom-code']);

    //     // }
    //     this.message = 'Login pass...';
    //     localStorage['authToken'] = o.data['token'];
    //     this.userService.userInfo = o.data['user'] as User;
    //     console.log(this.userService.userInfo);
    //     localStorage['userInfo'] = JSON.stringify(this.userService.userInfo);

    //   }

    //   // console.log(o);
    //   this.router.navigate(['/console/dashboard']);
    //   $('form').loading('stop');
    // }).catch(error => {
    //   this.error = true;
    //   let response = error.response;
    //   let tmp = !response ? error.message :
    //       response.headers.get('Content-Type').indexOf('application/json') === 0 ?
    //           response.json().then((o: any) => o.error) :
    //           response.statusText;
    //   Promise.resolve(tmp).then(message => {
    //     this.message = message;
    //     $('form').loading('stop');
    //   });
    // });
  }

}
