import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { ApiUrlService } from './apiUrl.service';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  email: string = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private apiUrlService: ApiUrlService
  ) {}

  enviarEmail(email: string) {
    this.email = email;
    const user = {
      email: this.email,
    };

    const postRequireLogin = this.http.post(
      `${this.apiUrlService.getApiUrl()}/requirelogin`,
      user
    );
    return postRequireLogin;
  }

  buscarEmail(): Observable<any> {
    const token = this.authService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      return this.http.get(`${this.apiUrlService.getApiUrl()}/users`, {
        headers,
      });
    } else {
      console.error('Nenhum token de autenticação disponível');
      return of(null);
    }
  }

  enviarToken(token: string): Observable<any> {
    const body = {
      email: this.email,
      loginCode: token,
    };
    return this.http.post(`${this.apiUrlService.getApiUrl()}/login`, body, {
      observe: 'response',
    });
  }

  reenviarToken() {
    return this.enviarEmail(this.email);
  }
}
