import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  email = '';

  constructor(private http: HttpClient) {}

  // Método para enviar o email para a API
  enviarEmail(email: string) {
    this.email = email;
    const userType = window.location.pathname.includes('/admin') ? 'admin' : 'comum';
    const user = { email, tipo: userType };
    // Primeiro, adicione o usuário à lista de usuários
    return this.http.post('http://localhost:3000/usuarios', user)
      .pipe(
        // Em seguida, envie o email para requirelogin para obter o código de login
        switchMap(() => this.http.post('http://localhost:3000/requirelogin', { email }))
      );
  }

  // Método para enviar o token para a API
  enviarToken(token: string) {
    const body = {
      email: this.email,
      loginCode: token,
    };
    return this.http.post('http://localhost:3000/login', body);
  }

  // Método para reenviar o código para o email
  reenviarToken() {
    const body = {
      email: this.email,
    };
    // Substitua o URL pelo endpoint correto para reenviar o código
    return this.http.post('http://localhost:3000/requirelogin', body);
  }
}