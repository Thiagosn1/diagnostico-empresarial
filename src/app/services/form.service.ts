import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, take } from 'rxjs';
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
  ): Observable<Category> {
    const url = `${this.apiUrl}/${categoryId}`;
    return this.http.get<Category>(url).pipe(
      take(1),
      switchMap((category) => {
        const updatedQuestions = category.questions.map((q) =>
          q.id === question.id ? question : q
        );
        const updatedCategory = { ...category, questions: updatedQuestions };
        return this.http.put<Category>(url, updatedCategory);
      })
    );
  }

  // Método para excluir uma questão
  excluirQuestao(categoryId: number, questionId: number): Observable<any> {
    const url = `${this.apiUrl}/${categoryId}`;
    return this.http.get<Category>(url).pipe(
      take(1),
      switchMap((category) => {
        const updatedQuestions = category.questions.filter(
          (q) => q.id !== questionId
        );
        const updatedCategory = { ...category, questions: updatedQuestions };
        return this.http.put(url, updatedCategory);
      })
    );
  }
}
