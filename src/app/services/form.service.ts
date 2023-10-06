import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Category, Question } from '../models/form.model';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private apiUrl = 'http://localhost:3000/formulario';

  constructor(private http: HttpClient) {}

  // Método para obter dados da api
  getData(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  // Método para renomear uma questão
  atualizarQuestao(
    categoryId: number,
    question: Question
  ): Observable<Question> {
    const url = `${this.apiUrl}/${categoryId}/questions/${question.id}`;
    return this.http.put<Question>(url, question);
  }

  // Método para excluir uma questão
  excluirQuestao(categoryId: number, questionId: number): Observable<any> {
    const url = `${this.apiUrl}/${categoryId}/questions/${questionId}`;
    return this.http.delete(url);
  }
}
