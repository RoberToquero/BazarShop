import { Component, OnInit, inject } from '@angular/core';
import { User } from 'firebase/auth';
import { Producto } from 'src/app/models/producto.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AnadirActualizarProductosComponent } from 'src/app/shared/components/anadir-actualizar-productos/anadir-actualizar-productos.component';
import { orderBy, where } from 'firebase/firestore';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  
  productos: Producto [] = [];
  loading: boolean= false;
  ngOnInit() {
    
  }



  //Para refrescar la página al deslizar hacia abajo

  doRefresh(event) {
    setTimeout(() => {
      this.getProducts()
      event.target.complete();
    }, 2000);
  }

  //Obtener Ganancias. Multiplicar unidades por precio y sumarlos todos

  obtenerGanancias(){
    return this.productos.reduce((index, producto) => index + producto.precio * producto.unidades, 0);
  }


  // Añadir o actualizar un producto

  async addUpdateProduct(product?: Producto){
    let success = await this.utilsSvc.presentModal({
      component: AnadirActualizarProductosComponent,
      cssClass:'anadir-actualizar-modal',
      componentProps: {product}
    })
    if(success) this.getProducts();
  }

  //
  async confirmDeleteProduct(product:Producto) {
   this.utilsSvc.presentAlert({
      header: 'Eliminar Producto',
      message: '¿Deseas eliminar este producto?',
      mode:'ios',
      buttons: [
        {
          text:'Cancelar',
        },{
          text:'Si, eliminar',
          handler:() =>{
            this.deleteProduct(product);
          }
        }
      ]
    });
  

  }

  //Borrar un documento

  async deleteProduct(producto: Producto){

    let path = `users/${this.user().uid}/productos/${producto.id}`

    const loading=await this.utilsSvc.loading();

    await loading.present(); //llaMando al loading cuando se inicia esta funcion
    let imagenPath = await this.firebaseSvc.getFilePath(producto.imagen);
    await this.firebaseSvc.deleteFile(imagenPath);

    this.firebaseSvc.deleteDocument(path). then(async res =>{

      this.productos = this.productos.filter(p => p.id !== producto.id); //Para actualizar lista tras borrar producto

      this.utilsSvc.presentToast({
        message: "Producto eliminado correctamente",
        duration: 2500,
        color:'success',
        position:'middle',
        icon:'checkmark-circle-outline'
      })
      
      //Controlando errores 
    }).catch(error =>
      {console.log(error);

        
      }
      //SI TODO ESTA BIEN QUITAR LA FUNCION LOADING
    ).finally(()=>
      {loading.dismiss();
    }
      
    )
}

  // Obtener productos

  user(): User{ //Funcion que siempre está retornando los datos del usuario
    return this.utilsSvc.getFromLocal('user');
  }

  getProducts(){
    let path = `users/${this.user().uid}/productos`;

    this.loading = true;

    let query =( orderBy('unidades', 'desc'));  //Para que muestre los productos en orden descendente según cantidad de unidades  
    

    let sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        console.log(res);
        this.productos = res;

        this.loading = false;
        sub.unsubscribe(); //Para mantener un control de cuantas veces se aceptan peticiones hay que dessuscribirse cada vez que se obtenga la respuesta
      }
    })
  }

  ionViewWillEnter() { //Sirve para ejecutar una funcion cada vez que el usuario entra a la página
    this.getProducts();
  }

}
