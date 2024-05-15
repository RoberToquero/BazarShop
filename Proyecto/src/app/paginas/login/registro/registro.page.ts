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
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    nombre: new FormControl('', [Validators.required, Validators.minLength(5)])
  })

  //INYECTANDO EL SERVICIO DE FIREBASE CON EL LOGIN PARA RECOGER DATOS 

  firebaseSvc = inject(FirebaseService);

  // INYECTO EL SERVICIO DE UTILS

  utilsSvc = inject(UtilsService);

  constructor() { }

  ngOnInit() {
  }
  // Función asincrónica que lleva el botón "Entrar" para registrarse
  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present(); // Llamando al loading cuando se inicia esta función

      // Función de registro
      try {
        const res = await this.firebaseSvc.signUp(this.form.value as User);

        const uid = res.user.uid;
        this.form.controls.uid.setValue(uid); // Colocando el valor uid en el formulario

        // Actualizando el perfil del usuario
        await this.firebaseSvc.updateUser(this.form.value.nombre);

        // Guardando el dato en la base de datos
        await this.setUserInfo(uid);

        this.utilsSvc.routerLink('/home/principal');
        this.form.reset();

        this.utilsSvc.presentToast({
          message: 'Registro exitoso. Bienvenido!',
          duration: 2500,
          color: 'success',
          position: 'middle',
          icon: 'person-circle-outline'
        });
      } catch (error) {
        console.log(error);
        this.utilsSvc.presentToast({
          message: 'Contraseña o email incorrectos. Inténtalo de nuevo.',
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

  async setUserInfo(uid: string) {
    if (this.form.valid) {
      const userData = {
        id: uid,
        email: this.form.value.email,
        nombre: this.form.value.nombre,
        // No guardar la contraseña en la base de datos por seguridad
      };

      const path = `users/${uid}`; // Lugar donde se almacenará la info de los usuarios

      try {
        await this.firebaseSvc.setDocument(path, userData);
        this.utilsSvc.saveInLocal('user', userData);
      } catch (error) {
        console.log(error);
        this.utilsSvc.presentToast({
          message: 'Error al guardar la información del usuario. Inténtalo de nuevo.',
          duration: 3500,
          color: 'warning',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
      }
    }
  }
}
