import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { ApiUrlService } from './apiUrl.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
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

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} falhou: ${error.message}`);
      return of(result as T);
    };
  }

  obterUsuario(): Observable<any> {
    const headers = this.getHeaders();
    if (!headers) return of(null);

    return this.http
      .get<any>(`${this.apiUrlService.getApiUrl()}users`, { headers })
      .pipe(catchError(this.handleError<any>('obterUsuario')));
  }

  obterUsuarios(): Observable<any> {
    const headers = this.getHeaders();
    if (!headers) return of([]);

    return this.http
      .get<any>(`${this.apiUrlService.getApiUrl()}admin/users`, { headers })
      .pipe(catchError(this.handleError<any>('obterUsuarios', [])));
  }

  atualizarUsuario(id: number, user: any): Observable<any> {
    const headers = this.getHeaders();
    if (!headers) return of(null);

    const apiUrl = this.router.url.includes('/admin')
      ? `${this.apiUrlService.getApiUrl()}admin/users/${id}`
      : `${this.apiUrlService.getApiUrl()}users/${id}`;

    return this.http
      .put<any>(apiUrl, user, { headers })
      .pipe(catchError(this.handleError<any>('atualizarUsuario')));
  }

  tornarAdmin(id: number): Observable<any> {
    const headers = this.getHeaders();
    if (!headers) return of(null);

    return this.http
      .put<any>(
        `${this.apiUrlService.getApiUrl()}admin/users/setauthority/${id}`,
        { text: 'ROOT' },
        { headers }
      )
      .pipe(catchError(this.handleError<any>('tornarAdmin')));
  }

  removerAdmin(id: number): Observable<any> {
    const headers = this.getHeaders();
    if (!headers) return of(null);

    return this.http
      .put<any>(
        `${this.apiUrlService.getApiUrl()}admin/users/setauthority/${id}`,
        { text: 'DEFAULT' },
        { headers }
      )
      .pipe(catchError(this.handleError<any>('removerAdmin')));
  }

  excluirUsuario(id: number): Observable<any> {
    const headers = this.getHeaders();
    if (!headers) return of(null);

    return this.http
      .delete<any>(`${this.apiUrlService.getApiUrl()}admin/users/${id}`, {
        headers,
      })
      .pipe(catchError(this.handleError<any>('excluirUsuario')));
  }
}
