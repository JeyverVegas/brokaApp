import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PropertyCardPage } from './property-card.page';

describe('PropertyCardPage', () => {
  let component: PropertyCardPage;
  let fixture: ComponentFixture<PropertyCardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyCardPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyCardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
