import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms'; //Importa parte del framework de Angular específico para formularios
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  
  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('',[Validators.required]),
    name: new FormControl('',[Validators.required,Validators.minLength(5)])
  })

    //INYECTANDO EL SERVICIO DE FIREBASE CON EL LOGIN PARA RECOGER DATOS 

    firebaseSvc = inject(FirebaseService);

    // INYECTO EL SERVICIO DE UTILS
  
    utilsSvc = inject(UtilsService);
  
  constructor() { }

  ngOnInit() {
  }
  //FUNCION ASINCRONA QUE LLEVA EL BOTÓN ENTRAR PARA LOGARSE
  async submit(){

    if(this.form.valid){

      const loading=await this.utilsSvc.loading();

      await loading.present(); //llaMando al loading cuando se inicia esta funcion
      //FUNCION DE REGISTRO
      this.firebaseSvc.signUp(this.form.value as User). then(async res =>{

        await this.firebaseSvc.updateUser(this.form.value.name);

        let uid= res.user.uid;
        this.form.controls.uid.setValue(uid); //Colocando el valor uid en el formulario

        this.setUserInfo(uid); //Guardando el dato en la base de datos


       
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

  async setUserInfo(id: string){

    if(this.form.valid){

      const loading=await this.utilsSvc.loading();

      await loading.present(); //llaMando al loading cuando se inicia esta funcion
      //FUNCION DE MODIFICAR
      let path ='users/${id}'; //lugar donde se almacenará la info de los usuarios
      delete this.form.value.password; //No envío la contraseña a la base de datos

      this.firebaseSvc.setDocument(path, this.form.value). then(async res =>{

        this.utilsSvc.saveInLocal('user', this.form.value);
        this.utilsSvc.routerLink('/home/principal');
        this.form.reset();
        //Controlando errores 
      }).catch(error =>
        {console.log(error);

          this.utilsSvc.presentToast({
            message: "Email ya registrado. Inténtalo de nuevo.",
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
