import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectFilePage } from './select-file.page';

describe('SelectFilePage', () => {
  let component: SelectFilePage;
  let fixture: ComponentFixture<SelectFilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectFilePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectFilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
