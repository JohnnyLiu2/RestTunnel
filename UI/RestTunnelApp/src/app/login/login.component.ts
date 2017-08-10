import { Component, OnInit } from '@angular/core';
import {httpPost, FORM_CONTENT_TYPE} from '../common/http';
import { HttpOptions, httpGet, extractJSON } from '../Common/http';
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";

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
  constructor(private http: HttpClient) {}

  ngOnInit() {
    // this.http.get('https://localhost:8443/api/accesstoken', {
    //       headers: new HttpHeaders({'Custom-Code': 'sfsafsdf'})
    //   }).subscribe(data => {
    //     // Read the result field from the JSON response.
    //     // this.results = data['results'];
    //     console.log(data);
    //     this.accessCode = data['accessKey']
    //   });
    httpGet('http://mfoglight.azurewebsites.net/api/accesstoken',
      {headers: {'Custom-Code': 'sfsafsdf', 'Content-Type': FORM_CONTENT_TYPE}}).then(extractJSON).then(o => {
        // this.login(o);
        this.accessCode = 'SjmdqbeeqkvLV/SnpzGa8v0e5Us=';//o.data['accessKey'];
        console.log(this.accessCode);

      }).catch(error => {

      });
  }

  login(result) {
    this.error = false;
    this.message = 'Checking user and password...';

    console.log("access key is "+ result);

    let data = 'username=' + encodeURIComponent(this.user) +
      '&pwd=' + encodeURIComponent(this.password);
    httpPost('http://mfoglight.azurewebsites.net/api/v1/security/login', FORM_CONTENT_TYPE, data,
    {headers: {'Access-Key': result}}).then(extractJSON).then(o => {
      // this.resume(o.token);
      // this.close();
      console.log(o);

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

  submit() {
    // httpGet('https://localhost:8443/api/accesstoken',
    //   {headers: {'Custom-Code': 'sfsafsdf'}}).then(extractJSON).then(o => {
    //     this.login(o);
    //   }).catch(error => {

    //   });
      // this.http.post('http://localhost:8085/api/v1/security/login', {
      //     headers: new HttpHeaders({'Access-Key': this.accessCode, 'Content-Type':'application/x-www-form-urlencoded'})
      // }).subscribe(data => {
      //   // Read the result field from the JSON response.
      //   // this.results = data['results'];
      //   console.log(data);
      //   // this.accessCode = data['accessKey']
      // });
      this.login(this.accessCode);
  }

}
