import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DescartadoPage } from './descartado.page';

describe('DescartadoPage', () => {
  let component: DescartadoPage;
  let fixture: ComponentFixture<DescartadoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescartadoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DescartadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
