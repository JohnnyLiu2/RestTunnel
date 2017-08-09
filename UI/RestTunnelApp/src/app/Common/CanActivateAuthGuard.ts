import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class CanActivateAuthGuard implements CanActivate {

  // constructor(private router: Router) {
  //   // if (this.authService.isLoggedIn()) {
  //       // return true;
  //   // }
  //   //Redirect the user before denying them access to this route
  //   this.router.navigate(['/login']);
  //   return false;
  // }
  canActivate() {
    return true;
  }
}
