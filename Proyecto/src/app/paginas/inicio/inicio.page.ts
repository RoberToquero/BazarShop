import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  arr: string[];

  constructor(
    private router: Router
  ) {
    
    this.arr=['Mario', 'Laura', 'Raquel', 'Manuel']
   }
   // CICLO DE VIDA DE LA APP 
  ngOnInit() {
    console.log('[ngOnInit] inicio');
  }
  ionViewWillEnter(){
    console.log('[ionViewWillEnter] inicio');
  }

  ionViewDidEnter(){
    console.log('[ionViewDidEnter] inicio');
  }

  ionViewWillLeave(){
    console.log('[ionViewWillLeave] inicio');
  }

  ionViewDidLeave(){
    console.log('[ionViewDidLeave] inicio');
  }

  ngOnDestroy(){
    console.log('[ngOnDestroy] inicio');
  }

 
  // MÉTODOS PROPIOS

  pulsarNombre = (inicio: any) => {
    console.log(inicio);
  }
 


}
