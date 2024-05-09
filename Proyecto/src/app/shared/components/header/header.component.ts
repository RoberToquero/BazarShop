import { Component, Input, OnInit, input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {
// Para pasarle parámetros no inicializados al componente
  @Input() title!: string;

  constructor() { }

  ngOnInit() {}

}
