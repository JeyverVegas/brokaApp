import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChatImagesPreviewPage } from './chat-images-preview.page';

describe('ChatImagesPreviewPage', () => {
  let component: ChatImagesPreviewPage;
  let fixture: ComponentFixture<ChatImagesPreviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatImagesPreviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatImagesPreviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
