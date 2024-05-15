import { Component, OnInit, inject } from '@angular/core';
import { User } from 'firebase/auth';
import { Producto } from 'src/app/models/producto.model';
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
  
  productos: Producto [] = [];
  ngOnInit() {
  }

  //Cerrar Sesion

  signOut(){
    this.firebaseSvc.signOut();
  }

  // Añadir o actualizar un producto

  addUpdateProduct(product?: Producto){
    this.utilsSvc.presentModal({
      component: AnadirActualizarProductosComponent,
      cssClass:'anadir-actualizar-modal',
      componentProps: {product}
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
        this.productos = res;
        sub.unsubscribe(); //Para mantener un control de cuantas veces se aceptan peticiones hay que dessuscribirse cada vez que se obtenga la respuesta
      }
    })
  }

  ionViewWillEnter() { //Sirve para ejecutar una funcion cada vez que el usuario entra a la página
    this.getProducts();
  }

}
