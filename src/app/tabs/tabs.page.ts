import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Usuario } from '../interface';
import { AuthenticationService } from '../servicios/authentication.service';
import { SmartAudioService } from '../servicios/smart-audio.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit{

  user = {} as Usuario;

  constructor(
    private smartAudio: SmartAudioService,
    private authService: AuthenticationService
  ) { }  
  
  ngOnInit(){
    this.user = this.authService.user;
    console.log(this.user);
  }

  playSound(){
    this.smartAudio.play('tabSwitch');
  }
  
}
