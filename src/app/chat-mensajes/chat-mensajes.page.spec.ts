import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChatMensajesPage } from './chat-mensajes.page';

describe('ChatMensajesPage', () => {
  let component: ChatMensajesPage;
  let fixture: ComponentFixture<ChatMensajesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatMensajesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatMensajesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
