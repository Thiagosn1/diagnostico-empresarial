import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:4200/api/users';

  constructor(private http: HttpClient) {}

  obterUsuarios(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  tornarAdmin(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, { authority: 'ROOT' });
  }

  removerAdmin(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, { authority: 'DEFAULT' });
  }

  excluirUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
