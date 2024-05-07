import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {

  constructor() { }

    // CICLO DE VIDA DE LA APP 
    ngOnInit() {
      console.log('[ngOnInit] mapa');
    }
    ionViewWillEnter(){
      console.log('[ionViewWillEnter] mapa');
    }
  
    ionViewDidEnter(){
      console.log('[ionViewDidEnter] mapa');
    }
  
    ionViewWillLeave(){
      console.log('[ionViewWillLeave] mapa');
    }
  
    ionViewDidLeave(){
      console.log('[ionViewDidLeave] mapa');
    }

    ngOnDestroy(){
      console.log('[ngOnDestroy] mapa');
    }
}
