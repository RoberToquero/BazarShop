import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  //Controlar las peticiones asíncronas a la base de datos
  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  router = inject(Router)

  //FUNCION LOADING

  loading(){
    return this.loadingCtrl.create({spinner:'crescent'});
  }

  //FUNCION TOAST

  async presentToast(opts?: ToastOptions) {
    const toast = await this. toastCtrl.create(opts);
    toast.present();
  }

  // FUNCION QUE ENRUTA A CUALQUIER PAGINA DISPONIBLE 
  routerLink(url:string){
    return this.router.navigateByUrl(url);
  }

  // Guardar elementos localmente
  saveInLocal(key: string, value: any){
    return localStorage.setItem(key, JSON.stringify(value)) //Se convierte en tipo string para almacenarlo correctamente
  }

  //Obtener un elemento desde local

  getFromLocal(key: string){
    return JSON.parse(localStorage.getItem(key)) 
  }
}
