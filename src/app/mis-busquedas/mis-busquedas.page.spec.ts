import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MisBusquedasPage } from './mis-busquedas.page';

describe('MisBusquedasPage', () => {
  let component: MisBusquedasPage;
  let fixture: ComponentFixture<MisBusquedasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisBusquedasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MisBusquedasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
