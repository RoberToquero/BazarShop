import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent  implements OnInit {



  form = new FormGroup({
    uid: new FormControl(''),
    nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
    // password: new FormControl('', [Validators.required])
  })

  //INYECTANDO EL SERVICIO DE FIREBASE PARA RECOGER DATOS 

  firebaseSvc = inject(FirebaseService);

  // INYECTO EL SERVICIO DE UTILS

  utilsSvc = inject(UtilsService);

  usuario = {} as User;

  ngOnInit() {
    this.usuario = this.utilsSvc.getFromLocal('user');

  }

  user(): User {
    return this.usuario;
  }

  submit(){
    
      this.updateProfile();
    
  }


  async updateProfile() {
    let path = `users/${this.usuario.uid}`
    const loading = await this.utilsSvc.loading();
    await loading.present();
  
    delete this.form.value.uid, //Se borra el ID porque se realiza en la función de actualizar pero no para la de agregar 
   
      this.firebaseSvc.updateDocument(path,this.form.value). then(async res =>{
  
        this.utilsSvc.dismissModal({ success: true});

        this.usuario.nombre = this.form.value.nombre;
        // this.usuario.password = this.form.value.password;

  
      this.utilsSvc.presentToast({
        message: 'Usuario actualizado correctamente',
        duration: 2500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      })

    }).catch (error=>
      {console.log(error);
        this.utilsSvc.presentToast({
        message: "Error",
        duration: 3500,
        color: 'warning',
        position: 'middle',
        icon: 'alert-circle-outline'
      })
    }).finally (()=>
      {loading.dismiss();
    });
  } 
  

}


