import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

   usuario = {} as User;

  paginas = [
    {titulo: 'Home', url: '/home/principal', icon:'home-outline'},
    {titulo: 'Perfil', url: '/home/perfil', icon:'person-outline'}
  ]

  router= inject(Router);
  currentPath: string = '';

  ngOnInit() {
    this.router.events.subscribe((event: any) =>{
      if(event?.url) this.currentPath = event.url;
    })
  }

  user(): User{
    return this.utilsSvc.getFromLocal('user');
  }

    //Cerrar Sesion

    signOut(){
      this.firebaseSvc.signOut();
    }

}
