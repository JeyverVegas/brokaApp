import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MapConfigPage } from './map-config.page';

describe('MapConfigPage', () => {
  let component: MapConfigPage;
  let fixture: ComponentFixture<MapConfigPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapConfigPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MapConfigPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
