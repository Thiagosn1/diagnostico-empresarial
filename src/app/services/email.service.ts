import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private apiUrl = 'http://localhost:4200/api';

  email: string = '';

  constructor(private http: HttpClient) {}

  // Método para verificar se o email já existe na API
  verificarEmail(email: string): Observable<boolean> {
    return this.http
      .get<any[]>(`${this.apiUrl}/users`)
      .pipe(map((users) => users.some((user) => user.email === email)));
  }

  // Método para enviar o email para a API
  /* enviarEmail(email: string): Observable<any> {
    this.email = email;
    const userType = window.location.pathname.includes('/admin')
      ? 'ROOT'
      : 'DEFAULT';
    const body = {
      email: this.email,
      name: null,
      authority: userType,
      businessUsers: null,
      businesses: null,
    };
    return this.verificarEmail(this.email).pipe(
      switchMap(exists => {
        if (!exists) {
          const requireLogin$ = this.http.post(`${this.apiUrl}/requirelogin`, body);
          const users$ = this.http.post(`${this.apiUrl}/users`, body);
          return forkJoin([requireLogin$, users$]).pipe(
            tap(response => {
            })
          );
        } else {
          console.log('O usuário já existe');
          return of(null);
        }
      })
    );
  } */

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

    //const postUser = this.http.post('http://localhost:3000/usuarios', user);
    //const postRequireLogin = this.http.post('http://localhost:3000/requirelogin', user);
    const postRequireLogin = this.http.post(`${this.apiUrl}/requirelogin`, user);
    return postRequireLogin;
    //return forkJoin([postUser, postRequireLogin]);
    //return postUser;
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
