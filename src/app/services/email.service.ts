import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  email = '';

  constructor(private http: HttpClient) {}

  // Método para enviar o email para a API
  enviarEmail(email: string) {
    this.email = email;
    const body = {
      email: email,
    };
    return this.http.post('http://localhost:3000/requirelogin', body);
    //return this.http.post('http://localhost:4200/api/requirelogin', body);
  }

  // Método para enviar o token para a API
  enviarToken(token: string) {
    const body = {
      email: this.email,
      loginCode: token,
    };
    return this.http.post('http://localhost:3000/login', body);
    //return this.http.post('http://localhost:4200/api/login', body);
  }

  // Método para reenviar o código para o email
  reenviarToken() {
    const body = {
      email: this.email,
    };
    // Substitua o URL pelo endpoint correto para reenviar o código
    return this.http.post('http://localhost:3000/requirelogin', body);
    //return this.http.post('http://localhost:4200/api/requirelogin', body);
  }
}
