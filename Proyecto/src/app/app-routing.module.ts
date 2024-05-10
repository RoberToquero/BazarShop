import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RecuperarPasswordPageModule } from './paginas/login/recuperar-password/recuperar-password.module';

const routes: Routes = [

  {
    path: 'inicio',
    loadChildren: () => import('./paginas/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path:'',
    redirectTo:'/inicio',
    pathMatch:'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./paginas/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./paginas/login/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'recuperar-password',
    loadChildren: () => import('./paginas/login/recuperar-password/recuperar-password.module').then( m => m.RecuperarPasswordPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
