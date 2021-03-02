import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Filtros2Page } from './filtros2.page';

describe('Filtros2Page', () => {
  let component: Filtros2Page;
  let fixture: ComponentFixture<Filtros2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Filtros2Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Filtros2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
