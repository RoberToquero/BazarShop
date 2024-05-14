import { Component, Input, OnInit, inject, input } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {
// Para pasarle parámetros no inicializados al componente
  @Input() title!: string;
  @Input() backButton!: string;
  @Input() isModal!: boolean;


  utilsSvc = inject(UtilsService);

  ngOnInit() {}

  cerrarModal(){
    this.utilsSvc.dismissModal();
  }

}
