import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'firebase/auth';
import { UtilsService } from 'src/app/services/utils.service';
import { UserProfileComponent } from 'src/app/shared/components/user-profile/user-profile.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
  }

  async updateProduct(){
 
  }

}
