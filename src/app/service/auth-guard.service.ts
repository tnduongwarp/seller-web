//auth-guard.service.ts- TypeScript file which facilitates authentication using route guards in client application             ///
//Angular route guards are interfaces which can tell the router whether or not it should allow navigation to a requested route  //
//Used to protect access to client side routes                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//importing required modules and services
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';



//exporting the auth-guard Service
@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('accessToken') || state.url === '/' || state.url.startsWith('/login') || state.url.startsWith('/register')) {
        return true;
    } else {
      return (this.router.navigate(['/login']), false)
    }


  }
}
