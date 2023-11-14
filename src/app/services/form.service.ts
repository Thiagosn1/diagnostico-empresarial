import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap, take } from 'rxjs';
import { Category, Question } from '../models/form.model';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  apiUrl = 'http://localhost:4200/api/admin/categories';

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  /* // Método para obter dados da api
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

  // Método para renomear uma categoria
  atualizarCategoria(category: Category): Observable<Category> {
    const url = `${this.apiUrl}/${category.id}`;
    return this.http.put<Category>(url, category);
  }

  // Método para excluir uma categoria
  excluirCategoria(categoryId: number): Observable<any> {
    const url = `${this.apiUrl}/${categoryId}`;
    return this.http.delete(url);
  } */

  // Método para obter dados da api
  getData(): Observable<Category[]> {
    const token = this.authService.getToken();
    console.log('Token obtido:', token);
    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      let apiUrl = 'http://localhost:4200/api/categories';
      if (this.router.url.includes('/admin')) {
        apiUrl = 'http://localhost:4200/api/admin/categories';
      }
      return this.http.get<Category[]>(apiUrl, { headers });
    } else {
      console.error('Nenhum token de autenticação disponível');
      return new Observable<Category[]>((subscriber) => {
        subscriber.next([]);
        subscriber.complete();
      });
    }
  }

  // Método para renomear uma questão
  atualizarQuestao(
    categoryId: number,
    question: Question
  ): Observable<Category> {
    const token = this.authService.getToken();
    console.log('Token obtido:', token);
    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      const url = `${this.apiUrl}/${categoryId}`;
      return this.http.get<Category>(url, { headers }).pipe(
        take(1),
        switchMap((category) => {
          const updatedQuestions = category.questions.map((q) =>
            q.id === question.id ? question : q
          );
          const updatedCategory = { ...category, questions: updatedQuestions };
          return this.http.put<Category>(url, updatedCategory, { headers });
        })
      );
    } else {
      console.error('Nenhum token de autenticação disponível');
      return new Observable<Category>((subscriber) => {
        subscriber.next(undefined);
        subscriber.complete();
      });
    }
  }

  // Método para excluir uma questão
  excluirQuestao(categoryId: number, questionId: number): Observable<any> {
    const token = this.authService.getToken();
    console.log('Token obtido:', token);
    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      const url = `${this.apiUrl}/${categoryId}`;
      return this.http.get<Category>(url, { headers }).pipe(
        take(1),
        switchMap((category) => {
          const updatedQuestions = category.questions.filter(
            (q) => q.id !== questionId
          );
          const updatedCategory = { ...category, questions: updatedQuestions };
          return this.http.put(url, updatedCategory, { headers });
        })
      );
    } else {
      console.error('Nenhum token de autenticação disponível');
      return new Observable<any>((subscriber) => {
        subscriber.next([]);
        subscriber.complete();
      });
    }
  }

  // Método para renomear uma categoria
  atualizarCategoria(category: Category): Observable<Category> {
    const token = this.authService.getToken();
    console.log('Token obtido:', token);
    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      const url = `${this.apiUrl}/${category.id}`;
      return this.http.put<Category>(url, category, { headers });
    } else {
      console.error('Nenhum token de autenticação disponível');
      return new Observable<Category>((subscriber) => {
        subscriber.next(undefined);
        subscriber.complete();
      });
    }
  }

  // Método para excluir uma categoria
  excluirCategoria(categoryId: number): Observable<any> {
    const token = this.authService.getToken();
    console.log('Token obtido:', token);
    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      const url = `${this.apiUrl}/${categoryId}`;
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
