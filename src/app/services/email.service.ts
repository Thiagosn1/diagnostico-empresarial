import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private apiUrl = 'http://localhost:4200/api';

  email: string = '';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Método para enviar o email para a API
  enviarEmail(email: string) {
    this.email = email;
    const user = {
      email: this.email,
    };

    const postRequireLogin = this.http.post(
      `${this.apiUrl}/requirelogin`,
      user
    );
    return postRequireLogin;
  }

  // Método para buscar o email do usuário
  buscarEmail(): Observable<any> {
    const token = this.authService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      return this.http.get(`${this.apiUrl}/users`, { headers });
    } else {
      console.error('Nenhum token de autenticação disponível');
      return new Observable((subscriber) => {
        subscriber.next(null);
        subscriber.complete();
      });
    }
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
