import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, mergeMap, of, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { ApiUrlService } from './apiUrl.service';

@Injectable({
  providedIn: 'root',
})
export class BusinessUsersService {
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
    return `${baseUrl}${adminPrefix}${endpoint}`;
  }

  obterFuncionarios(): Observable<any[]> {
    const headers = this.getHeaders();
    if (!headers) return of([]);

    return this.http.get<any>(this.getUrl('businesses'), { headers }).pipe(
      map((res) => res[0]?.businessUsers || []),
      catchError(this.handleError<any[]>('obter funcionários', []))
    );
  }

  convidarFuncionario(
    userEmail: string,
    customTitle: string,
    customMessage: string
  ): Observable<any> {
    const headers = this.getHeaders();
    if (!headers)
      return throwError(
        () => new Error('Nenhum token de autenticação disponível')
      );

    return this.http.get<any>(this.getUrl('businesses'), { headers }).pipe(
      mergeMap((response) => {
        const businessId = response[0].id;
        const bodyAdd = { userEmail, businessId };
        return this.http
          .post(`${this.getUrl('businessusers')}/add`, bodyAdd, { headers })
          .pipe(
            mergeMap(() => {
              const bodyInvite = {
                userEmail,
                businessId,
                customTitle,
                customMessage,
              };
              return this.http.post(
                `${this.getUrl('businessusers')}/invite`,
                bodyInvite,
                { headers }
              );
            })
          );
      }),
      catchError(this.handleError('convidar funcionário'))
    );
  }

  reenviarConvite(id: number, userEmail: string): Observable<any> {
    const headers = this.getHeaders();
    if (!headers)
      return throwError(
        () => new Error('Nenhum token de autenticação disponível')
      );

    const bodyAdd = { userEmail, businessId: id };
    return this.http
      .post(`${this.getUrl('businessusers')}/add`, bodyAdd, { headers })
      .pipe(
        mergeMap(() => {
          const bodyInvite = { userEmail };
          return this.http.put(
            `${this.getUrl('businessusers')}/invite/${id}`,
            bodyInvite,
            { headers }
          );
        }),
        catchError(this.handleError('reenviar convite'))
      );
  }

  removerFuncionario(id: number): Observable<any> {
    const headers = this.getHeaders();
    if (!headers) return of(null);

    const isAdmin = this.router.url.includes('/admin');
    return this.http
      .delete<any>(`${this.getUrl('businessusers', isAdmin)}/${id}`, {
        headers,
      })
      .pipe(catchError(this.handleError('remover funcionário')));
  }
}
