import { ChangeDetectorRef, Component } from '@angular/core';
import { SmartAudioService } from '../servicios/smart-audio.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    private smartAudio: SmartAudioService,    
  ) { }  
  
  playSound(){
    this.smartAudio.play('tabSwitch');
  }
  
}
