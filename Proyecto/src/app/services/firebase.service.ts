//AQUÍ ES DONDE SE IMPORTA TODO LO QUE TENGA QUE VER CON FIREBASE
import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword,updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {getFirestore, setDoc, doc,getDoc, addDoc, collection, collectionData, query, updateDoc, deleteDoc} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL, deleteObject } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage = inject(AngularFireStorage);
  utilsSve = inject(UtilsService);

  // AUTENTICACIONES

  getAuth(){
    return getAuth();
  }

// FUNCION PARA LOGEARSE Y ACCEDER

 signIn(user: User){
  return signInWithEmailAndPassword(getAuth(), user.email, user.password);
 }

 //FUNCION PARA REGISTRO
 signUp(user: User){
  return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
 }

 //FUNCION PARA ACTUALIZAR USUARIO

 updateUser(displayName:string){
  return updateProfile(getAuth().currentUser, {displayName})
 }

 //Enviar Email para restablecer contraseña

 recuperarPassword(email: string){
  return sendPasswordResetEmail(getAuth(), email);
 }

 //CERRAR SESIÓN



 signOut(){
  getAuth().signOut();
  localStorage.removeItem('user');
  this.utilsSve.removeFromLocal('user');
  this.utilsSve.routerLink('/login');
 }


 // BASE DE DATOS

 //Obtener documentos de una colección

 getCollectionData(path: string, collectionQuery?:any){
  const ref = collection(getFirestore(), path);
  return collectionData(query(ref,collectionQuery), {idField: 'id'});
 }

  //Setear un documento es decir crearlo si no existe y cambiarlo si es que existe
 setDocument(path: string, data: any){
   return setDoc(doc(getFirestore(), path), data);
 }

 //Actualizar documento

 updateDocument(path: string, data: any){
  return updateDoc(doc(getFirestore(), path), data);
}

//Borrar un documento

deleteDocument(path: string){
  return deleteDoc(doc(getFirestore(), path));
}

 //Obtener un registro

 async getDocument(path: string){
  return (await getDoc(doc(getFirestore(), path))).data();
 }

 // Añadir documento

 addDocument(path: string, data: any){
  return addDoc(collection(getFirestore(), path), data);
}

// Almacenamiento en Firebase

  //Subir Imagen

  async uploadImage(path:string, data_url:string){
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() =>{
      return getDownloadURL(ref(getStorage(), path))
    })
  }

  //Obtener ruta de la imagen con su URL

  async getFilePath(url:string){
    return ref(getStorage(), url).fullPath
  }

  // Eliminar archivos de la base de datos

  deleteFile(path: string){
   return deleteObject(ref(getStorage(),path));
  }

}


