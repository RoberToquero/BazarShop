import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

 firebaseSvc = inject(FirebaseService);
 utilsSvc = inject(UtilsService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree{
      let user = localStorage.getItem('user');
      return new Promise((resolve) => {
        this.firebaseSvc.getAuth().onAuthStateChanged((auth)=>{
          if(auth){
            if(user)
            resolve(true);
          }
          else{
            this.utilsSvc.routerLink('/login');
            resolve(false);
          }
        })
      });

    }
  
}
