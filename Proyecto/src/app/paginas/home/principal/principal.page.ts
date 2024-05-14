import { Component, OnInit, inject } from '@angular/core';
import { User } from 'firebase/auth';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AnadirActualizarProductosComponent } from 'src/app/shared/components/anadir-actualizar-productos/anadir-actualizar-productos.component';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
  }

  //Cerrar Sesion

  signOut(){
    this.firebaseSvc.signOut();
  }

  // Añadir o actualizar un producto

  addUpdateProduct(){
    this.utilsSvc.presentModal({
      component: AnadirActualizarProductosComponent,
      cssClass:'anadir-actualizar-modal'
    })
  }

  // Obtener productos

  user(): User{ //Funcion que siempre está retornando los datos del usuario
    return this.utilsSvc.getFromLocal('user');
  }

  getProducts(){
    let path = `users/${this.user().uid}/productos`;

    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        console.log(res);
        sub.unsubscribe();
      }
    })
  }

  ionViewWillEnter() {
    this.getProducts();
  }

}
