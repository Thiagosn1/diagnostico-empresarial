import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FuncionarioService {
  private apiUrl = 'http://localhost:3000/funcionarios';

  constructor(private http: HttpClient) {}

  getFuncionarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  convidarFuncionario(email: string): Observable<any> {
    const body = {
      email,
      status: 'Convite Enviado',
    };
    return this.http.post(this.apiUrl, body);
  }

  reenviarConvite(id: number, email: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    const body = {
      email,
      status: 'Convite Enviado',
    };
    return this.http.put(url, body);
  }

  removerFuncionario(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }

  expirarConvite(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    const body = {
      status: 'Convite Expirado',
    };
    return this.http.put(url, body);
  }
}