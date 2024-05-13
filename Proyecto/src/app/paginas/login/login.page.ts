import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('',[Validators.required])
  })

  //INYECTANDO EL SERVICIO DE FIREBASE CON EL LOGIN PARA RECOGER DATOS 

  firebaseSvc = inject(FirebaseService);

  // INYECTO EL SERVICIO DE UTILS

  utilsSvc = inject(UtilsService);

  constructor(
    private router: Router
  ) {}

  ngOnInit() {
  }

  navegarRegistro(){
    //Acciones para la navegación
    this.router.navigate(['/registro'])
  }
  //FUNCION ASINCRONA QUE LLEVA EL BOTÓN ENTRAR PARA LOGARSE
  async submit(){

    if(this.form.valid){

      const loading=await this.utilsSvc.loading();

      await loading.present(); //llaMando al loading cuando se inicia esta funcion
      this.firebaseSvc.signIn(this.form.value as User). then(res =>{
       
        this.getUserInfo(res.user.uid)
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
  async getUserInfo(uid: string){

    if(this.form.valid){

      const loading=await this.utilsSvc.loading();

      await loading.present(); //llamando al loading cuando se inicia esta funcion
      //FUNCION DE MODIFICAR
      let path =`users/${uid}`; //lugar donde se almacenará la info de los usuarios
      

      this.firebaseSvc.getDocument(path).then((user: User)=>{

        this.utilsSvc.saveInLocal('user', user);
        this.utilsSvc.routerLink('/home/principal');
        this.form.reset();

        this.utilsSvc.presentToast({
          message:"Te damos la bienvenida",
          duration: 2500,
          color:'success',
          position:'middle',
          icon:'person-circle-outline'
        });

        
      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: "Email o contraseña incorrectos. Inténtalo de nuevo.",
          duration: 3500,
          color:'warning',
          position:'middle',
          icon:'alert-circle-outline'
        });
      }).finally(() => {
        loading.dismiss();
      });
    }
}

}
