import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SmartAudioService } from '../servicios/smart-audio.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    private router: Router,
    private smartAudio: SmartAudioService
  ) { }

  ngOnInit() {
  }


  next() {
    this.smartAudio.play('tabSwitch');
    this.router.navigateByUrl('login', {replaceUrl: true});    
  }

}
