import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-anadir-actualizar-productos',
  templateUrl: './anadir-actualizar-productos.component.html',
  styleUrls: ['./anadir-actualizar-productos.component.scss'],
})
export class AnadirActualizarProductosComponent  implements OnInit {

  form = new FormGroup({
    id: new FormControl(''),
    imagen: new FormControl('',[Validators.required]),
    nombre: new FormControl('',[Validators.required,Validators.minLength(4)]),
    precio: new FormControl('',[Validators.required,Validators.min(0)]),
    unidades: new FormControl('',[Validators.required,Validators.min(0)])
    

  })

  //INYECTANDO EL SERVICIO DE FIREBASE CON EL LOGIN PARA RECOGER DATOS 

  firebaseSvc = inject(FirebaseService);

  // INYECTO EL SERVICIO DE UTILS

  utilsSvc = inject(UtilsService);

  user = {} as User;



  ngOnInit() {
    this.user = this.utilsSvc.getFromLocal('user');
  }

  //FUNCION PARA REALIZAR/SELECCIONAR IMAGEN, debe ser asíncrona hay que esperar a que devuelva la imagen
  async tomarImagen(){
    const dataURL = (await this.utilsSvc.tomarFoto('Imagen del producto')).dataUrl;
    this.form.controls.imagen.setValue(dataURL); //Seteando la imagen
  }



  //FUNCION ASINCRONA AÑADIR PRODUCTO
  async submit(){

    if(this.form.valid){

      let path = `users/${this.user.uid}/productos`

      const loading=await this.utilsSvc.loading();

      await loading.present(); //llaMando al loading cuando se inicia esta funcion
      
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

          this.utilsSvc.presentToast({
            message: "Contraseña o email incorrectos. Inténtalo de nuevo.",
            duration: 3500,
            color:'warning',
            position:'middle',
            icon:'alert-circle-outline'
          })
        }
        //SI TODO ESTA BIEN QUITAR LA FUNCION LOADING
      ).finally(()=>
        {loading.dismiss();
      }
        
      )
    }
  }

}
