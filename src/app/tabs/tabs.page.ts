import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../interface';
import { AuthenticationService } from '../servicios/authentication.service';
import { ChatService } from '../servicios/chat.service';
import { SmartAudioService } from '../servicios/smart-audio.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  selectedPath = null;
  user = {} as Usuario;
  newMessagesCount = new BehaviorSubject(0);
  constructor(
    private smartAudio: SmartAudioService,
    private authService: AuthenticationService,
    private chatService: ChatService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.router.events.subscribe((event: RouterEvent) => {
      this.selectedPath = this.router.url;
    })
    this.user = this.authService.user;
    console.log(this.user);
    this.newMessagesCount = this.chatService.getNewMewssagesCount();
  }

  playSound() {
    this.smartAudio.play('tabSwitch');
  }

}
