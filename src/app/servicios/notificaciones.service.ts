import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  constructor(
    private authService: AuthenticationService,
    private http: HttpClient
  ) { }



  getNotifications(){
    return this.http.get(this.authService.api + '/notifications', {
      headers: this.authService.authHeader
    }).toPromise();
  }

  notificationMarkRead(notificationId: any){
    return this.http.put(this.authService.api + '/notifications/' + notificationId + '/mark-as-read', {
      headers: this.authService.authHeader
    }).toPromise();
  }

  notificationMarkAllRead(){
    return this.http.put(this.authService.api + '/notifications/mark-as-read', {
      headers: this.authService.authHeader
    }).toPromise();
  }
}
