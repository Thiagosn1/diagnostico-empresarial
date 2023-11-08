import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class BusinessesService {
  private apiUrl = 'http://localhost:4200/api/businesses';

  criarEmpresa(business: any) {
    return this.http.post(this.apiUrl, business);
  }

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Obtém todas as empresas
  obterEmpresas(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  /* obterEmpresas(): Observable<any> {
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
  } */

  // Exclui uma empresa pelo ID
  excluirEmpresa(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Atualiza uma empresa
  atualizarEmpresa(id: number, empresa: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, empresa);
  }
}
