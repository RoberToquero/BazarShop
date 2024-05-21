import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Producto } from 'src/app/models/producto.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-anadir-actualizar-productos',
  templateUrl: './anadir-actualizar-productos.component.html',
  styleUrls: ['./anadir-actualizar-productos.component.scss'],
})
export class AnadirActualizarProductosComponent  implements OnInit {

  @Input() product: Producto;
  @Input() user: User;
  
  form = new FormGroup({
    id: new FormControl(''),
    imagen: new FormControl('',[Validators.required]),
    nombre: new FormControl('',[Validators.required,Validators.minLength(4)]),
    precio: new FormControl(null,[Validators.required,Validators.min(0)]),
    unidades: new FormControl(null,[Validators.required,Validators.min(0)])
    

  })

  //INYECTANDO EL SERVICIO DE FIREBASE PARA RECOGER DATOS 

  firebaseSvc = inject(FirebaseService);

  // INYECTO EL SERVICIO DE UTILS

  utilsSvc = inject(UtilsService);

  



  ngOnInit() {
    this.user = this.utilsSvc.getFromLocal('user');

    console.log('User from local storage:', this.user);
   

    if (!this.user || !this.user.uid) {
      console.error('User UID is not available');
      return;
    }
    console.log('User UID:', this.user.uid);
    console.log('User Name:', this.user.nombre);
    console.log('User Email:', this.user.email);
    
    if(this.product) this.form.setValue(this.product);
  }

  //FUNCION PARA REALIZAR/SELECCIONAR IMAGEN, debe ser asíncrona hay que esperar a que devuelva la imagen
  async tomarImagen(){
    const dataURL = (await this.utilsSvc.tomarFoto('Imagen del producto')).dataUrl;
    this.form.controls.imagen.setValue(dataURL); //Seteando la imagen
  }

  submit(){
    if(this.form.valid){
      
      if(this.product) this.updateProduct();
      else this.createProduct();
    }
  }

  //Convertir valores string en number

  convertirANumero(){
    let {unidades, precio} = this.form.controls;

    if(unidades.value) unidades.setValue(parseFloat(unidades.value));
    if(precio.value) precio.setValue(parseFloat(precio.value));
  }


   //CREAR PRODUCTO
   async createProduct(){

    if (!this.user || !this.user.uid) {
      console.error('User is not defined or user UID is missing');
      return;
    }

      let path = `users/${this.user.uid}/productos`

      const loading=await this.utilsSvc.loading();

      await loading.present(); //llamando al loading cuando se inicia esta funcion
      
      //Parámetros para subir la imagen y obtener la URL

      let dataUrl = this.form.value.imagen;
      let imagenPath = `${this.user.uid}/${Date.now()}`; //De este modo se obtiene un path único para cada imagen

      //Obtner la URL de la imagen
      let imagenUrl = await this.firebaseSvc.uploadImage(imagenPath,dataUrl);
      this.form.controls.imagen.setValue(imagenUrl); 

      delete this.form.value.id //Se borra el ID porque se realiza en la función de actualizar pero no para la de agregar 

      this.firebaseSvc.addDocument(path,this.form.value). then(async res =>{

        this.utilsSvc.dismissModal({ success: true});

        this.utilsSvc.presentToast({
          message: "Producto creado correctamente",
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
      })
  }

  // ACTUALIZAR PRODUCTO

  async updateProduct(){

      let path = `users/${this.user.uid}/productos/${this.product.id}`

      const loading=await this.utilsSvc.loading();

      await loading.present(); //llaMando al loading cuando se inicia esta funcion

      //Si cambio la imagen, subir la nueva y obtener la url
      
     if(this.form.value.imagen !== this.product.imagen){

      let dataUrl = this.form.value.imagen;
      let imagenPath = await this.firebaseSvc.getFilePath(this.product.imagen);
      //Obtener la URL de la imagen
      let imagenUrl = await this.firebaseSvc.uploadImage(imagenPath,dataUrl);
      this.form.controls.imagen.setValue(imagenUrl); 

     }

      

       delete this.form.value.id //Se borra el ID porque se realiza en la función de actualizar pero no para la de agregar 

      this.firebaseSvc.updateDocument(path,this.form.value). then(async res =>{

        this.utilsSvc.dismissModal({ success: true});

        this.utilsSvc.presentToast({
          message: "Producto actualizado correctamente",
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
      })
  }

}
