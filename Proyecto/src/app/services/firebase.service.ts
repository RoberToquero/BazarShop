//AQUÍ ES DONDE SE IMPORTA TODO LO QUE TENGA QUE VER CON FIREBASE
import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword,updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {getFirestore, setDoc, doc,getDoc} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);

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


 // BASE DE DATOS

  //Setear un documento es decir crearlo si no existo y cambiarlo si es que existe
 setDocument(path: string, data: any){
   return setDoc(doc(getFirestore(), path), data);
 }

 //Obtener un registro

 async getDocument(path: string){
  return (await getDoc(doc(getFirestore(), path))).data();
 }


 
}


