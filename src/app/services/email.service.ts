import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { ApiUrlService } from './apiUrl.service';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  email: string = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private apiUrlService: ApiUrlService
  ) {}

  private getHeaders(): HttpHeaders | null {
    const token = this.authService.getToken();
    return token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : null;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} falhou:`, error);
      return throwError(() => error);
    };
  }

  enviarEmail(email: string): Observable<any> {
    this.email = email;
    const user = { email: this.email };
    const url = `${this.apiUrlService.getApiUrl()}requirelogin`;
    console.log('Enviando requisição para:', url);

    return this.http.post(url, user).pipe(
      tap((response) => console.log('Resposta da API:', response)),
      catchError((error: HttpErrorResponse) =>
        this.handleError<any>('enviarEmail')(error)
      )
    );
  }

  buscarEmail(): Observable<any> {
    const headers = this.getHeaders();
    if (!headers) {
      console.error('Nenhum token de autenticação disponível');
      return of(null);
    }

    const url = `${this.apiUrlService.getApiUrl()}users`;
    return this.http.get(url, { headers }).pipe(
      tap((data) => console.log('Dados do usuário recuperados', data)),
      catchError(this.handleError('buscarEmail'))
    );
  }

  enviarToken(token: string): Observable<HttpResponse<any>> {
    const body = {
      email: this.email,
      loginCode: token,
    };
    const url = `${this.apiUrlService.getApiUrl()}login`;
    return this.http.post<any>(url, body, { observe: 'response' }).pipe(
      tap((response) => console.log('Login bem-sucedido', response)),
      catchError(this.handleError<HttpResponse<any>>('enviarToken'))
    );
  }

  reenviarToken(): Observable<any> {
    return this.enviarEmail(this.email);
  }
}
