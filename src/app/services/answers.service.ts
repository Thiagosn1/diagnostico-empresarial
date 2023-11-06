import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {
  private apiUrl = 'http://localhost:4200/api/answers';

  constructor(private http: HttpClient) { }
  // Salvar as respostas na API
  saveAnswer(answer: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, answer);
  }
}