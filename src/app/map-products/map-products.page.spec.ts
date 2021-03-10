import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MapProductsPage } from './map-products.page';

describe('MapProductsPage', () => {
  let component: MapProductsPage;
  let fixture: ComponentFixture<MapProductsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapProductsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MapProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
