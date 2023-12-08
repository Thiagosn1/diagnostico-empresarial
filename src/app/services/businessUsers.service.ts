import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class BusinessUsersService {
  private apiUrl = 'http://localhost:4200/api/businessusers';

  constructor(private http: HttpClient, private authService: AuthService) {}

  obterFuncionarios(): Observable<any[]> {
    const token = this.authService.getToken();

    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      return this.http
        .get<any>('http://localhost:4200/api/businesses', {
          headers,
        })
        .pipe(map((res) => res[0]?.businessUsers || []));
    } else {
      console.error('Nenhum token de autenticação disponível');
      return of([]);
    }
  }

  convidarFuncionario(userEmail: string): Observable<any> {
    return new Observable<any>((subscriber) => {
      const token = this.authService.getToken();
      if (token) {
        const headers = new HttpHeaders().set('Authorization', token);
        this.http
          .get<any>('http://localhost:4200/api/businesses', { headers })
          .subscribe((response) => {
            const businessId = response[0].id;
            const body = {
              userEmail,
              businessId,
            };
            this.http
              .post(`${this.apiUrl}/add`, body, {
                headers,
              })
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

  /* convidarFuncionario(userEmail: string): Observable<any> {
    return new Observable<any>((subscriber) => {
      const token = this.authService.getToken();
      if (token) {
        const headers = new HttpHeaders().set('Authorization', token);
        this.http
          .get<any>('http://localhost:4200/api/users', { headers })
          .subscribe((response) => {
            const businessId = response.businesses[0].id;
            const body = {
              userEmail,
              businessId,
            };
            this.http
              .post(`${this.apiUrl}/add`, body, { headers })
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
  } */

  reenviarConvite(id: number, userEmail: string): Observable<any> {
    const token = this.authService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      const url = `${this.apiUrl}/${id}`;
      const body = {
        userEmail,
      };
      return this.http.put(url, body, { headers });
    } else {
      console.error('Nenhum token de autenticação disponível');
      return new Observable<any>((subscriber) => {
        subscriber.next([]);
        subscriber.complete();
      });
    }
  }

  removerFuncionario(id: number): Observable<any> {
    const token = this.authService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      const url = `${this.apiUrl}/${id}`;
      return this.http.delete(url, { headers });
    } else {
      console.error('Nenhum token de autenticação disponível');
      return new Observable<any>((subscriber) => {
        subscriber.next([]);
        subscriber.complete();
      });
    }
  }
}
