import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController, NavParams } from '@ionic/angular';
import { SmartAudioService } from '../servicios/smart-audio.service';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.page.html',
  styleUrls: ['./image-modal.page.scss'],
})
export class ImageModalPage implements OnInit {

  @ViewChild('slideszoom', { static: true }) protected slidesZoom: IonSlides;
  @ViewChild('slidezoom', { static: true }) protected slideZoom: ElementRef;

  imgSrc = null;
  slidesOpts = {
    zoom: {
      maxRatio: 3
    }
  };

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private smartAudio: SmartAudioService
  ) { }

  ngOnInit() {
    this.imgSrc = this.navParams.get('img');    
  }

  ionViewDidEnter(){
    this.slidesZoom.update();
    
  }

  playSound(){
    this.smartAudio.play('tabSwitch');
  }

  zoom(zoomIn: boolean){
    this.playSound();
    this.slidesZoom.getSwiper().then((swiper) =>{
      if(zoomIn){
        swiper.zoom.in();
      }else{
        swiper.zoom.out();
      }  
    });
  }

  closeModal(){
    this.playSound();
    this.modalCtrl.dismiss();
  }

}
