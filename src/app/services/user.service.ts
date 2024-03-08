import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:4200/api/users';
  private apiUrlAdmin = 'http://localhost:4200/api/admin/users';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  obterUsuario(): Observable<any> {
    const token = this.authService.getToken();

    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      return this.http.get<any>(this.apiUrl, { headers });
    } else {
      console.error('Nenhum token de autenticação disponível');
      return new Observable<any>((subscriber) => {
        subscriber.next([]);
        subscriber.complete();
      });
    }
  }

  obterUsuarios(): Observable<any> {
    const token = this.authService.getToken();

    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      return this.http.get<any>(this.apiUrlAdmin, { headers });
    } else {
      console.error('Nenhum token de autenticação disponível');
      return new Observable<any>((subscriber) => {
        subscriber.next([]);
        subscriber.complete();
      });
    }
  }

  atualizarUsuario(id: number, user: any): Observable<any> {
    const token = this.authService.getToken();
  
    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      let apiUrl = this.apiUrl;
  
      if (this.router.url.includes('/admin')) {
        apiUrl = `${this.apiUrlAdmin}/${id}`;
      } else {
        apiUrl = `${apiUrl}/${id}`;
      }
  
      return this.http.put<any>(apiUrl, user, { headers });
    } else {
      console.error('Nenhum token de autenticação disponível');
      return new Observable<any>((subscriber) => {
        subscriber.next([]);
        subscriber.complete();
      });
    }
  }
  

  tornarAdmin(id: number): Observable<any> {
    const token = this.authService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      return this.http.put<any>(
        `${this.apiUrlAdmin}/setauthority/${id}`,
        { text: 'ROOT' },
        { headers }
      );
    } else {
      console.error('Nenhum token de autenticação disponível');
      return new Observable<any>((subscriber) => {
        subscriber.next([]);
        subscriber.complete();
      });
    }
  }

  removerAdmin(id: number): Observable<any> {
    const token = this.authService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      return this.http.put<any>(
        `${this.apiUrlAdmin}/setauthority/${id}`,
        { text: 'DEFAULT' },
        { headers }
      );
    } else {
      console.error('Nenhum token de autenticação disponível');
      return new Observable<any>((subscriber) => {
        subscriber.next([]);
        subscriber.complete();
      });
    }
  }

  excluirUsuario(id: number): Observable<any> {
    const token = this.authService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      return this.http.delete<any>(`${this.apiUrlAdmin}/${id}`, { headers });
    } else {
      console.error('Nenhum token de autenticação disponível');
      return new Observable<any>((subscriber) => {
        subscriber.next([]);
        subscriber.complete();
      });
    }
  }
}
