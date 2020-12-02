import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MisMatchsPage } from './mis-matchs.page';

describe('MisMatchsPage', () => {
  let component: MisMatchsPage;
  let fixture: ComponentFixture<MisMatchsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisMatchsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MisMatchsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
