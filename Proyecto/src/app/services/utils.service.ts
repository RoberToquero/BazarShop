import { Injectable, inject } from '@angular/core';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  //Controlar las peticiones asíncronas a la base de datos
  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);

  //FUNCION LOADING

  loading(){
    return this.loadingCtrl.create({spinner:'crescent'});
  }

  //FUNCION TOAST

  async presentToast(opts?: ToastOptions) {
    const toast = await this. toastCtrl.create(opts);
    toast.present();
  }
}
