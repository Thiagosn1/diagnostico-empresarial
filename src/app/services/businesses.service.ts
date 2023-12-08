import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class BusinessesService {
  private apiUrl = 'http://localhost:4200/api/businesses';
  private apiUrlAdmin = 'http://localhost:4200/api/admin/businesses';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  // Método para criar uma empresa
  criarEmpresa(business: any) {
    const token = this.authService.getToken();

    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      return this.http.post(this.apiUrl, business, { headers });
    } else {
      console.error('Nenhum token de autenticação disponível');
      return new Observable<any>((subscriber) => {
        subscriber.next([]);
        subscriber.complete();
      });
    }
  }

  // Método para obter as empresas
  obterEmpresas(): Observable<any> {
    const token = this.authService.getToken();

    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      let apiUrl = 'http://localhost:4200/api/businesses';
      if (this.router.url.includes('/admin')) {
        apiUrl = 'http://localhost:4200/api/admin/businesses';
      }
      return this.http.get<any>(apiUrl, { headers });
    } else {
      console.error('Nenhum token de autenticação disponível');
      return new Observable<any>((subscriber) => {
        subscriber.next([]);
        subscriber.complete();
      });
    }
  }

  // Método para excluir uma empresa
  excluirEmpresa(id: number): Observable<any> {
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

  // Método para atualizar uma empresa
  atualizarEmpresa(id: number, empresa: any): Observable<any> {
    const token = this.authService.getToken();

  if (token) {
    const headers = new HttpHeaders().set('Authorization', token);
    let apiUrl = 'http://localhost:4200/api/businesses';
    if (this.router.url.includes('/admin')) {
      apiUrl = 'http://localhost:4200/api/admin/businesses';
    }
    return this.http.put<any>(`${apiUrl}/${id}`, empresa, { headers });
  } else {
    console.error('Nenhum token de autenticação disponível');
    return new Observable<any>((subscriber) => {
      subscriber.next([]);
      subscriber.complete();
    });
  }
  }
}
