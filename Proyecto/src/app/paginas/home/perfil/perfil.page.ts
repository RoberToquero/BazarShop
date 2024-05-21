import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { UserProfileComponent } from 'src/app/shared/components/user-profile/user-profile.component';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  darkMode = false;

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);



  usuario = {} as User;
  loading: boolean;

 

  ngOnInit(): void {
    this.checkAppMode();
    this.usuario = this.utilsSvc.getFromLocal('user');

    console.log('User UID:', this.usuario.uid);
    console.log('User Email:', this.usuario.email);
    
    this.getUser();
  }
  

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

  getUser(){
    let path = `users/${this.usuario.uid}`;
    this.loading = true;

    let sub = this.firebaseSvc.getDocumentData(path).subscribe({
      next: (res: any) => {
        console.log(res);
        this.usuario = res;

        this.loading = false;
        sub.unsubscribe(); //Para mantener un control de cuantas veces se aceptan peticiones hay que dessuscribirse cada vez que se obtenga la respuesta
      }
    })

  
  }
  ionViewWillEnter() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    return this.usuario;
  }



  async updateUser(user?: User){
    let success = await this.utilsSvc.presentModal({
      component: UserProfileComponent,
      cssClass:'User-Profile-modal',
      componentProps: {user: this.usuario}
    })
    if(success) this.getUser;
  }

  doRefresh(event) {
    setTimeout(() => {
      this.getUser()
      event.target.complete();
    }, 2000);
  }

    //Confirmación de borrado de usuario
  async confirmDeleteUser(user: User) {
    this.utilsSvc.presentAlert({
      header: 'Eliminar Usuario',
      message: '¿Deseas eliminar este usuario?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Sí, eliminar',
          handler: () => {
            this.deleteUser(user);
          }
        }
      ]
    });
  }
  //Borrar un usuario
  async deleteUser(user: User) {
    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      await this.firebaseSvc.deleteUser(user.uid);

      this.utilsSvc.presentToast({
        message: 'Usuario eliminado correctamente',
        duration: 2500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });

      // Cerrar sesión después de eliminar el usuario
      await this.firebaseSvc.auth.signOut();
      this.utilsSvc.routerLink('/login'); // Redirigir al login o a otra página adecuada
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      this.utilsSvc.presentToast({
        message: 'Error al eliminar usuario. Inténtalo de nuevo.',
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
      