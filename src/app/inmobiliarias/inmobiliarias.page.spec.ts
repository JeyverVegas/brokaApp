import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InmobiliariasPage } from './inmobiliarias.page';

describe('InmobiliariasPage', () => {
  let component: InmobiliariasPage;
  let fixture: ComponentFixture<InmobiliariasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InmobiliariasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InmobiliariasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
