import { Injectable } from '@angular/core';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SmartAudioService {

  audioType: string = 'html5';
  sounds: any = [];
  mute = false;
  constructor(public nativeAudio: NativeAudio, platform: Platform) {

    if (platform.is('cordova')) {
      this.audioType = 'native';
    }

  }

  toggleSound(){
    this.mute = !this.mute;    
  }

  getMute(){
    return this.mute;
  }

  preload(key, asset) {

    if (this.audioType === 'html5') {

      let audio = {
        key: key,
        asset: asset,
        type: 'html5'
      };

      this.sounds.push(audio);

    } else {

      this.nativeAudio.preloadSimple(key, asset).then((res)=>{
        
      }).catch((err)=>{
        //alert(err);
      });

      let audio = {
        key: key,
        asset: asset,
        type: 'native'
      };

      this.sounds.push(audio);
    }

  }

  play(key) {
    if(!this.mute){
      let audio = this.sounds.find((sound) => {
        return sound.key === key;
      });
  
      if (audio.type === 'html5') {
  
        let audioAsset = new Audio(audio.asset);
        audioAsset.play();
  
      } else {
        this.nativeAudio.play(audio.key).then((res) => {
          
        }, (err) => {
          //alert(err);
        });
  
      }
    }    
  }
}
