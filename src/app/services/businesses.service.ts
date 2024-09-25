import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { ApiUrlService } from './apiUrl.service';

@Injectable({
  providedIn: 'root',
})
export class BusinessesService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private apiUrlService: ApiUrlService
  ) {}

  private getHeaders(): HttpHeaders | null {
    const token = this.authService.getToken();
    return token ? new HttpHeaders().set('Authorization', token) : null;
  }

  private handleError<T>(operation: string, result?: T) {
    return (error: any): Observable<T> => {
      console.error(`Erro ao ${operation}:`, error);
      return of(result as T);
    };
  }

  private getUrl(endpoint: string, isAdmin: boolean = false): string {
    const baseUrl = this.apiUrlService.getApiUrl();
    const adminPrefix = isAdmin ? 'admin/' : '';
    return `${baseUrl}${adminPrefix}${endpoint}`.replace(/([^:]\/)\/+/g, '$1');
  }

  criarEmpresa(business: any): Observable<any> {
    const headers = this.getHeaders();
    if (!headers) return of(null);

    return this.http
      .post(this.getUrl('businesses'), business, { headers })
      .pipe(catchError(this.handleError<any>('criar empresa')));
  }

  obterEmpresa(id: number): Observable<any> {
    const headers = this.getHeaders();
    if (!headers) return of(null);

    const isAdmin = this.router.url.includes('/admin');
    return this.http
      .get<any>(`${this.getUrl('businesses', isAdmin)}/${id}`, { headers })
      .pipe(catchError(this.handleError<any>('obter empresa')));
  }

  obterEmpresas(): Observable<any[]> {
    const headers = this.getHeaders();
    if (!headers) return of([]);

    const isAdmin = this.router.url.includes('/admin');
    return this.http
      .get<any[]>(this.getUrl('businesses', isAdmin), { headers })
      .pipe(catchError(this.handleError<any[]>('obter empresas', [])));
  }

  obterUsuarios(): Observable<any[]> {
    const headers = this.getHeaders();
    if (!headers) return of([]);

    const isAdmin = this.router.url.includes('/admin');
    return this.http
      .get<any[]>(this.getUrl('users', isAdmin), { headers })
      .pipe(catchError(this.handleError<any[]>('obter usuários', [])));
  }

  excluirEmpresa(id: number): Observable<any> {
    const headers = this.getHeaders();
    if (!headers) return of(null);

    return this.http
      .delete<any>(`${this.getUrl('businesses', true)}/${id}`, { headers })
      .pipe(catchError(this.handleError<any>('excluir empresa')));
  }

  atualizarEmpresa(id: number, empresa: any): Observable<any> {
    const headers = this.getHeaders();
    if (!headers) return of(null);

    const isAdmin = this.router.url.includes('/admin');
    return this.http
      .put<any>(`${this.getUrl('businesses', isAdmin)}/${id}`, empresa, {
        headers,
      })
      .pipe(catchError(this.handleError<any>('atualizar empresa')));
  }
}
