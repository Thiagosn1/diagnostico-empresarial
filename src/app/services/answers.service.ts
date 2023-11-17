import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AnswerService {
  private apiUrl = 'http://localhost:4200/api/answers';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Salvar as respostas na API
  salvarResposta(answer: any): Observable<any> {
    const token = this.authService.getToken();
    console.log('Token obtido:', token);
    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      return this.http.post<any>(this.apiUrl, answer, { headers });
    } else {
      console.error('Nenhum token de autenticação disponível');
      return new Observable<any>((subscriber) => {
        subscriber.next([]);
        subscriber.complete();
      });
    }
  }
}
