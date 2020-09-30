import { Component, OnInit } from '@angular/core';
import { SmartAudioService } from '../servicios/smart-audio.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    private smartAudio: SmartAudioService
  ) { }

  ngOnInit() {
  }

  playSound() {
    this.smartAudio.play('tabSwitch');
  }

}
