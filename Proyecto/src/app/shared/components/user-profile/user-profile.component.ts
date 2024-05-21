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
    email: new FormControl('',[Validators.required,,Validators.email])
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
    if (this.form.valid) {
      this.updateUser();
    }
  }


  async updateUser() {
    const loading = await this.utilsSvc.loading();
    await loading.present();
  
    try {
      if (this.usuario) { // Verificar si usuario está definido y tiene un valor
        await this.firebaseSvc.actualizarUsuario(
          this.usuario.uid,
          this.usuario.nombre,
          this.usuario.email
        );
  
        this.utilsSvc.presentToast({
          message: 'Usuario actualizado correctamente',
          duration: 2500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
        });
  
        // Actualiza los datos en local storage si es necesario
        this.utilsSvc.saveInLocal('user', this.usuario);
      } else {
        throw new Error('El usuario no está definido o es null.');
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      this.utilsSvc.presentToast({
        message: 'Error al actualizar usuario. Inténtalo de nuevo.',
        duration: 3500,
        color: 'warning',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    } finally {
      loading.dismiss();
    }
  }

}


