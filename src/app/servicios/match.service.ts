import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  constructor(
    private authService: AuthenticationService,
    private http: HttpClient
  ) { }

  getMatchs(): Promise<any> {
    return this.http.get(this.authService.api + '/matches', {
      headers: this.authService.authHeader
    }).toPromise();
  }

  storeMatch(data: { property_id: number }) {
    return this.http.post(this.authService.api + '/matches', data, {
      headers: this.authService.authHeader
    }).toPromise();
  }

  deleteMatch(matchId: number) {
    return this.http.delete(this.authService.api + '/matches/' + matchId, {
      headers: this.authService.authHeader
    }).toPromise();
  }

  deleteAllMatch() {
    return this.http.delete(this.authService.api + '/matches', {
      headers: this.authService.authHeader
    }).toPromise();
  }
}
