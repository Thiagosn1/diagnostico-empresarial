import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:4200/api/admin/users';

  constructor(private http: HttpClient, private authService: AuthService) {}

  /* obterUsuarios(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  } */

  obterUsuarios(): Observable<any> {
    const token = this.authService.getToken();
    console.log('Token obtido:', token);
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

  atualizarUsuario(id: number, user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, user);
  }

  tornarAdmin(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, { authority: 'ROOT' });
  }

  removerAdmin(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, {
      authority: 'DEFAULT',
    });
  }

  excluirUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
