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



  ngOnInit() {
  }

  //FUNCION PARA REALIZAR/SELECCIONAR IMAGEN, debe ser asíncrona hay que esperar a que devuelva la imagen
  async tomarImagen(){
    const dataURL = (await this.utilsSvc.tomarFoto('Imagen del producto')).dataUrl;
    this.form.controls.imagen.setValue(dataURL); //Seteando la imagen
  }



  //FUNCION ASINCRONA AÑADIR PRODUCTO
  async submit(){

    if(this.form.valid){

      const loading=await this.utilsSvc.loading();

      await loading.present(); //llaMando al loading cuando se inicia esta funcion
      //FUNCION DE REGISTRO
      this.firebaseSvc.signUp(this.form.value as User). then(async res =>{

        await this.firebaseSvc.updateUser(this.form.value.nombre);

        let uid= res.user.uid;
        


       
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
