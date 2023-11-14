import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private apiUrl = 'http://localhost:4200/api';

  email: string = '';

  constructor(private http: HttpClient) {
    this.email = localStorage.getItem('email') || '';
  }

  // Método para enviar o email para a API
  enviarEmail(email: string) {
    this.setEmail(email);
    this.email = email;

    const user = {
      email: this.email,
      name: null,
      authority: 'DEFAULT',
      businessUsers: null,
      businesses: null,
    };

    const postRequireLogin = this.http.post(
      `${this.apiUrl}/requirelogin`,
      user
    );
    return postRequireLogin;
  }

  // Método para salvar o email no localStorage
  setEmail(value: string) {
    this.email = value;
    localStorage.setItem('email', value);
  }

  // Método para enviar o token para a API
  enviarToken(token: string): Observable<any> {
    const body = {
      email: this.email,
      loginCode: token,
    };
    return this.http.post(`${this.apiUrl}/login`, body, {
      observe: 'response',
    });
  }

  // Método para reenviar o código para o email
  reenviarToken() {
    return this.enviarEmail(this.email);
  }
}
