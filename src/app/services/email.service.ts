import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  email = '';

  constructor(private http: HttpClient) {}

  // Método para enviar o email para a API
  enviarEmail(email: string) {
    this.email = email;
    const userType = window.location.pathname.includes('/admin')
      ? 'admin'
      : 'comum';
    const user = {
      email: this.email,
      tipo: userType,
      name: null,
      authority: 'DEFAULT',
      businessUsers: null,
      businesses: null,
    };

    const postUser = this.http.post('http://localhost:3000/usuarios', user);
    const postRequireLogin = this.http.post('http://localhost:3000/requirelogin', user);
    //const postRequireLogin = this.http.post('http://localhost:4200/api/requirelogin', user);

    return forkJoin([postUser, postRequireLogin]);
    //return postRequireLogin;
    //return postUser;
  }

  // Método para enviar o token para a API
  enviarToken(token: string) {
    const body = {
      email: this.email,
      loginCode: token,
    };
    return this.http.post('http://localhost:3000/login', body);
    //return this.http.post('http://localhost:4200/api/login', body, { observe: 'response' });
  }

  // Método para reenviar o código para o email
  reenviarToken() {
    const body = {
      email: this.email,
    };
    return this.http.post('http://localhost:3000/requirelogin', body);
    //return this.http.post('http://localhost:4200/api/requirelogin', body);
  }
}