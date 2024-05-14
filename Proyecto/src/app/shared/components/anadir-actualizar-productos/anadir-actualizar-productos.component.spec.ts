import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AnadirActualizarProductosComponent } from './anadir-actualizar-productos.component';

describe('AnadirActualizarProductosComponent', () => {
  let component: AnadirActualizarProductosComponent;
  let fixture: ComponentFixture<AnadirActualizarProductosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AnadirActualizarProductosComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AnadirActualizarProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
