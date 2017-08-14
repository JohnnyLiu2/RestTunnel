import { Component, OnInit } from '@angular/core';
import { httpPost, FORM_CONTENT_TYPE } from '../common/http';
import { HttpOptions, httpGet, extractJSON } from '../Common/http';
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';
import { User, UserService } from '../Common/user.service';
declare function showCommonModal(): any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: string;
	password: string;
	// tslint:disable-next-line:indent
	message: string = '\u00a0';
	error: boolean;
	resume: Function;
  accessCode: string;

  setData(resume: Function) {
		this.resume = resume;
	}

  constructor(private http: HttpClient, private router: Router, private userService: UserService) {}

  ngOnInit() {


  }

  login(accessCode) {
    this.error = false;
    this.message = 'Checking user and password...';

    console.log("access key is "+ accessCode);
    localStorage['accessCode'] = accessCode;
    let data = 'username=' + encodeURIComponent(this.user) +
      '&pwd=' + encodeURIComponent(this.password);



    httpPost('/api/v1/security/login', FORM_CONTENT_TYPE, data,
    /* {headers: {'Access-Key': accessCode}}*/).then(extractJSON).then(o => {
      // this.router.navigate(['/console/dashboard']);
      // this.resume(o.data['access-token']);
      if (o.data['token']) {
        localStorage['authToken'] = o.data['token'];
        this.userService.userInfo = o.data['user'] as User;
        console.log(this.userService.userInfo);
        localStorage['userInfo'] = JSON.stringify(this.userService.userInfo);

      }


      // window.location.href = '/console';

      console.log(o);
      this.router.navigate(['/console/dashboard']);

    }).catch(error => {
      this.error = true;
      let response = error.response;
      let tmp = !response ? error.message :
          response.headers.get('Content-Type').indexOf('application/json') === 0 ?
              response.json().then((o: any) => o.error) :
              response.statusText;
      Promise.resolve(tmp).then(message => this.message = message);
    });
  }

  submit(e) {

    httpGet('/api/mtoken',
      {headers: {'Custom-Code': 'Quest', 'Content-Type': FORM_CONTENT_TYPE}}).then(extractJSON).then(o => {

        this.accessCode = o.data['mtoken'];
        console.log(this.accessCode);
        this.login(this.accessCode);

      }).catch(error => {

      });
    // showCommonModal();

  }

}
