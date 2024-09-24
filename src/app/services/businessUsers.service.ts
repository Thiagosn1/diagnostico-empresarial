import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class BusinessUsersService {
  private apiUrl = '/api/businessusers';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  obterFuncionarios(): Observable<any[]> {
    const token = this.authService.getToken();

    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      return this.http
        .get<any>('/api/businesses', {
          headers,
        })
        .pipe(map((res) => res[0]?.businessUsers || []));
    } else {
      console.error('Nenhum token de autenticação disponível');
      return of([]);
    }
  }

  convidarFuncionario(
    userEmail: string,
    customTitle: string,
    customMessage: string
  ): Observable<any> {
    return new Observable<any>((subscriber) => {
      const token = this.authService.getToken();
      if (token) {
        const headers = new HttpHeaders().set('Authorization', token);
        this.http
          .get<any>('/api/businesses', { headers })
          .subscribe((response) => {
            const businessId = response[0].id;
            const bodyAdd = {
              userEmail,
              businessId,
            };
            this.http
              .post(`${this.apiUrl}/add`, bodyAdd, { headers })
              .subscribe(() => {
                const bodyInvite = {
                  userEmail,
                  businessId,
                  customTitle,
                  customMessage,
                };
                this.http
                  .post(
                    '/api/businessusers/invite',
                    bodyInvite,
                    { headers }
                  )
                  .subscribe((res) => {
                    subscriber.next(res);
                    subscriber.complete();
                  });
              });
          });
      } else {
        console.error('Nenhum token de autenticação disponível');
        subscriber.next([]);
        subscriber.complete();
      }
    });
  }

  reenviarConvite(id: number, userEmail: string): Observable<any> {
    return new Observable<any>((subscriber) => {
      const token = this.authService.getToken();
      if (token) {
        const headers = new HttpHeaders().set('Authorization', token);
        const bodyAdd = {
          userEmail,
          businessId: id,
        };
        this.http
          .post(`${this.apiUrl}/add`, bodyAdd, { headers })
          .subscribe(() => {
            const bodyInvite = {
              userEmail,
            };
            this.http
              .put(
                `/api/businessusers/invite/${id}`,
                bodyInvite,
                { headers }
              )
              .subscribe((res) => {
                subscriber.next(res);
                subscriber.complete();
              });
          });
      } else {
        console.error('Nenhum token de autenticação disponível');
        subscriber.next([]);
        subscriber.complete();
      }
    });
  }

  removerFuncionario(id: number): Observable<any> {
    const token = this.authService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      let apiUrl = '/api/businessusers';
      if (this.router.url.includes('/admin')) {
        apiUrl = '/api/admin/businessusers';
      }
      return this.http.delete<any>(`${apiUrl}/${id}`, { headers });
    } else {
      console.error('Nenhum token de autenticação disponível');
      return new Observable<any>((subscriber) => {
        subscriber.next([]);
        subscriber.complete();
      });
    }
  }
}
