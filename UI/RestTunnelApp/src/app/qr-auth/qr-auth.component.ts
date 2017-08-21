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
    this.activatedRoute.params.subscribe((params: Params) => {
        let accessKey = params['access-key'];
        let authToken = params['auth-token'];
        if (accessKey != null && authToken != null) {
          localStorage['accessCode'] = accessKey;
          localStorage['authToken'] = authToken;
          console.log(accessKey);
          console.log(authToken);
          this.router.navigate(['/console/dashboard']);
        }else {
          this.router.navigate(['/login']);
        }

      });
  }

}
