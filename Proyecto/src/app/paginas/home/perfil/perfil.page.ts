<<<<<<< HEAD
import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'firebase/auth';
import { UtilsService } from 'src/app/services/utils.service';
import { UserProfileComponent } from 'src/app/shared/components/user-profile/user-profile.component';
=======
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Producto } from 'src/app/models/producto.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
>>>>>>> 013c81f338be7c071244dfdc84392af8fca04a80

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

<<<<<<< HEAD
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
=======
  darkMode = false;
>>>>>>> 013c81f338be7c071244dfdc84392af8fca04a80

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);



  ngOnInit(): void {
    this.checkAppMode();
  }

<<<<<<< HEAD
  async updateProduct(){
 
  }

=======
  checkAppMode(){
    const checkIsDarkMode = localStorage.getItem('darkModeActivated');
    checkIsDarkMode == 'true'
      ? (this.darkMode = true)
      : (this.darkMode = false);
    document.body.classList.toggle('dark', this.darkMode);

  }

  user(): User{
    return this.utilsSvc.getFromLocal('user');
  }

  toggleDarkMode(){
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark', this.darkMode);
    if(this.darkMode){
      localStorage.setItem('darkModeActivated', 'true');
    } else{
      localStorage.setItem('darkModeActivated', 'false');
    }
  }

   //FUNCION PARA REALIZAR/SELECCIONAR IMAGEN, debe ser asíncrona hay que esperar a que devuelva la imagen
   async tomarImagen(){
    let user = this.user(); //variable que captura los datos del usuario
    let path = `users/${user.uid}`;

   
    const dataURL = (await this.utilsSvc.tomarFoto('Imagen de Perfil')).dataUrl;

    const loading=await this.utilsSvc.loading();
    await loading.present();

    let imagenPath = `${user.uid}/perfil`; //De este modo se obtiene un path único para cada imagen
    user.imagen = await this.firebaseSvc.uploadImage(imagenPath, dataURL);
    
    this.firebaseSvc.updateDocument(path, {imagen: user.imagen}). then(async res =>{

      this.utilsSvc.saveInLocal('user', user);

      this.utilsSvc.presentToast({
        message: "Imagen actualizada correctamente",
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


>>>>>>> 013c81f338be7c071244dfdc84392af8fca04a80
}
