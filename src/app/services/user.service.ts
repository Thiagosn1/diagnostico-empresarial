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

  private getUrl(endpoint: string): string {
    return `${this.apiUrlService.getApiUrl()}${endpoint}`.replace(
      /([^:]\/)\/+/g,
      '$1'
    );
  }

  obterUsuario(): Observable<any> {
    const headers = this.getHeaders();
    if (!headers) return of(null);

    return this.http
      .get<any>(this.getUrl('users'), { headers })
      .pipe(catchError(this.handleError<any>('obterUsuario')));
  }

  obterUsuarios(): Observable<any> {
    const headers = this.getHeaders();
    if (!headers) return of([]);

    return this.http
      .get<any>(this.getUrl('admin/users'), { headers })
      .pipe(catchError(this.handleError<any>('obterUsuarios', [])));
  }

  atualizarUsuario(id: number, user: any): Observable<any> {
    const headers = this.getHeaders();
    if (!headers) return of(null);

    const endpoint = this.router.url.includes('/admin')
      ? `admin/users/${id}`
      : `users/${id}`;

    return this.http
      .put<any>(this.getUrl(endpoint), user, { headers })
      .pipe(catchError(this.handleError<any>('atualizarUsuario')));
  }

  tornarAdmin(id: number): Observable<any> {
    const headers = this.getHeaders();
    if (!headers) return of(null);

    return this.http
      .put<any>(
        this.getUrl(`admin/users/setauthority/${id}`),
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
        this.getUrl(`admin/users/setauthority/${id}`),
        { text: 'DEFAULT' },
        { headers }
      )
      .pipe(catchError(this.handleError<any>('removerAdmin')));
  }

  excluirUsuario(id: number): Observable<any> {
    const headers = this.getHeaders();
    if (!headers) return of(null);

    return this.http
      .delete<any>(this.getUrl(`admin/users/${id}`), { headers })
      .pipe(catchError(this.handleError<any>('excluirUsuario')));
  }
}
