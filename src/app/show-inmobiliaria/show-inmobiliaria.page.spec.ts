import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShowInmobiliariaPage } from './show-inmobiliaria.page';

describe('ShowInmobiliariaPage', () => {
  let component: ShowInmobiliariaPage;
  let fixture: ComponentFixture<ShowInmobiliariaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowInmobiliariaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowInmobiliariaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
