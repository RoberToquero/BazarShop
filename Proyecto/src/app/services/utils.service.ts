import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  //Controlar las peticiones asíncronas a la base de datos
  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  router = inject(Router);
  modalCtrl = inject(ModalController);

 
//FUNCION PARA RECOGER IMAGENES GRACIAS A LA API DE LA CAMARA
  async tomarFoto(promptLabelHeader: string){
  return await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Prompt, //Permite al usuario elegir si quiere tomar la imagen de la cámara o de la galeria
    promptLabelHeader, //Título que aparecerá cuando se use la cámara
    promptLabelPhoto:"Selecciona una imagen",
    promptLabelPicture:"Toma una foto"
  });

 
};

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

  getFromLocal(key: string) {
    const item = localStorage.getItem(key);
    if (item !== null) {
      try {
        return JSON.parse(item);
      } catch (error) {
        console.error('Error al analizar JSON:', error);
        return null; // o algún otro valor predeterminado
      }
    } else {
      console.warn(`No hay ningún valor almacenado para la clave '${key}' en el almacenamiento local.`);
      return null; // o algún otro valor predeterminado
    }
  }

  // Modal

  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present();

    const { data } = await modal.onWillDismiss(); //Se obtiene los datos del modal si existen cuando se cierra
    if (data) return data;
  }

  dismissModal(data?:any){
    return this.modalCtrl.dismiss(data);
  }
}
