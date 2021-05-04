import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, timeout } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';
import { DEFAULT_REQUEST_TIMEOUT } from './productos.service';

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
    }).pipe(
      timeout(DEFAULT_REQUEST_TIMEOUT),
      catchError(e => {
        throw new Error("Tiempo de espera excedido.");
      })
    ).toPromise();
  }

  storeMatch(data: { property_id: number }) {
    return this.http.post(this.authService.api + '/matches', data, {
      headers: this.authService.authHeader
    }).pipe(
      timeout(DEFAULT_REQUEST_TIMEOUT),
      catchError(e => {
        throw new Error("Tiempo de espera excedido.");
      })
    ).toPromise();
  }

  deleteMatch(matchId: number) {
    return this.http.delete(this.authService.api + '/matches/' + matchId, {
      headers: this.authService.authHeader
    }).pipe(
      timeout(DEFAULT_REQUEST_TIMEOUT),
      catchError(e => {
        throw new Error("Tiempo de espera excedido.");
      })
    ).toPromise();
  }

  deleteAllMatch() {
    return this.http.delete(this.authService.api + '/matches', {
      headers: this.authService.authHeader
    }).pipe(
      timeout(DEFAULT_REQUEST_TIMEOUT),
      catchError(e => {
        throw new Error("Tiempo de espera excedido.");
      })
    ).toPromise();
  }
}
