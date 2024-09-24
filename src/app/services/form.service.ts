import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Category, Question } from '../models/form.model';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private apiUrl = '/api/admin/categories';
  private apiUrlQuestions = '/api/admin/questions';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  getData(): Observable<Category[]> {
    const token = this.authService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      let apiUrl = '/api/categories';
      if (this.router.url.includes('/admin')) {
        apiUrl = '/api/admin/categories';
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

  getCategoria(categoryId: number): Observable<Category> {
    const token = this.authService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      const url = `${this.apiUrl}/${categoryId}`;
      return this.http.get<Category>(url, { headers });
    } else {
      console.error('Nenhum token de autenticação disponível');
      return new Observable<Category>((subscriber) => {
        subscriber.next(undefined);
        subscriber.complete();
      });
    }
  }

  getQuestao(questionId: number): Observable<Question> {
    const token = this.authService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      const url = `${this.apiUrlQuestions}/${questionId}`;
      return this.http.get<Question>(url, { headers });
    } else {
      console.error('Nenhum token de autenticação disponível');
      return new Observable<Question>((subscriber) => {
        subscriber.next(undefined);
        subscriber.complete();
      });
    }
  }

  atualizarQuestao(question: Question): Observable<Question> {
    const token = this.authService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      const url = `${this.apiUrlQuestions}/${question.id}`;
      return this.http.put<Question>(url, question, { headers }).pipe(
        tap((response) => {
          console.log('Resposta da API para atualizarQuestao:', response);
        })
      );
    } else {
      console.error('Nenhum token de autenticação disponível');
      return new Observable<Question>((subscriber) => {
        subscriber.next(undefined);
        subscriber.complete();
      });
    }
  }

  adicionarQuestao(questao: any): Observable<Question> {
    const token = this.authService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      return this.http.post<Question>(this.apiUrlQuestions, questao, {
        headers,
      });
    } else {
      console.error('Nenhum token de autenticação disponível');
      return new Observable<Question>((subscriber) => {
        subscriber.next(undefined);
        subscriber.complete();
      });
    }
  }

  excluirQuestao(questionId: number): Observable<any> {
    const token = this.authService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      const url = `${this.apiUrlQuestions}/${questionId}`;
      return this.http.delete(url, { headers });
    } else {
      console.error('Nenhum token de autenticação disponível');
      return new Observable<any>((subscriber) => {
        subscriber.next([]);
        subscriber.complete();
      });
    }
  }

  adicionarCategoria(name: string): Observable<Category> {
    const token = this.authService.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      const category = {
        name: name,
      };
      return this.http.post<Category>(this.apiUrl, category, { headers });
    } else {
      console.error('Nenhum token de autenticação disponível');
      return new Observable<Category>((subscriber) => {
        subscriber.next(undefined);
        subscriber.complete();
      });
    }
  }

  atualizarCategoria(category: Category): Observable<Category> {
    const token = this.authService.getToken();
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

  excluirCategoria(categoryId: number): Observable<any> {
    const token = this.authService.getToken();
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
