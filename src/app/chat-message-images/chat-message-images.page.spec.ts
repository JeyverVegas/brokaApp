import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChatMessageImagesPage } from './chat-message-images.page';

describe('ChatMessageImagesPage', () => {
  let component: ChatMessageImagesPage;
  let fixture: ComponentFixture<ChatMessageImagesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatMessageImagesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatMessageImagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
