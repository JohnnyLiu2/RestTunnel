import { Component, OnInit } from '@angular/core';
import { httpPost, FORM_CONTENT_TYPE } from '../common/http';
import { HttpOptions, httpGet, extractJSON } from '../Common/http';
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

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
  }



  submit() {
    let login = (result): Promise<any>  => {

      this.accessCode = result.data['mtoken'];
      console.log(this.accessCode);
      // this.login(this.accessCode);
      this.error = false;
      this.message = 'Checking user and password...';

      console.log("access key is "+ this.accessCode);
      localStorage['accessCode'] = this.accessCode;
      let data = 'username=' + encodeURIComponent(this.user) +
        '&pwd=' + encodeURIComponent(this.password);

      return httpPost('/api/v1/security/login', FORM_CONTENT_TYPE, data).then(extractJSON);
    }

    httpGet('/api/mtoken',
      {headers: {'Custom-Code': 'Quest', 'Content-Type': FORM_CONTENT_TYPE}}).then(extractJSON).then(login).then(o => {
      if (o.data['token']) {
        localStorage['authToken'] = o.data['token'];
        this.userService.userInfo = o.data['user'] as User;
        console.log(this.userService.userInfo);
        localStorage['userInfo'] = JSON.stringify(this.userService.userInfo);

      }

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

}
