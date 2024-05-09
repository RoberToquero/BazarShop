import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
})
export class CustomInputComponent  implements OnInit {
  //parámetros
  @Input() control!:FormControl;
  @Input() type!: string;
  @Input() label!: string;
  @Input() autocomplete!:string;
  @Input() icon!: string;

  //Variables
  
  isPassword!:boolean;
  oculta: boolean= true;
  constructor() { }

  ngOnInit() {
    if(this.type == 'password') this.isPassword = true;
  }

  //FUNCIONES

  mostrarPassword(){
    
    this.oculta=!this.oculta;
    if (this.oculta) this.type='password';
    else this.type='text';
  }

}
