import { Params, ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-qr-auth',
  templateUrl: './qr-auth.component.html',
  styleUrls: ['./qr-auth.component.css']
})
export class QrAuthComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
        let accessKey = params['key'];
        let authToken = params['token'];
        // console.log("store", params);
        // console.info(params);
        console.log(accessKey);
        console.log(authToken);
        if (accessKey != null && authToken != null) {

          localStorage['accessCode'] = decodeURIComponent(accessKey);
          localStorage['authToken'] = decodeURIComponent(authToken);
          console.info(localStorage['accessCode']);
          console.info(localStorage['authToken']);
          this.router.navigate(['/console/dashboard']);
        }else {
          this.router.navigate(['/login']);
          // console.info(localStorage['accessCode']);
        }

      });
  }

}
