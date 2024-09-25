import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { Category, Question } from '../models/form.model';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { ApiUrlService } from './apiUrl.service';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private apiUrlService: ApiUrlService
  ) {}

  private getHeaders(): HttpHeaders | null {
    const token = this.authService.getToken();
    return token ? new HttpHeaders().set('Authorization', token) : null;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} falhou: ${error.message}`);
      return of(result as T);
    };
  }

  getData(): Observable<Category[]> {
    const headers = this.getHeaders();
    if (headers) {
      const apiUrl = this.router.url.includes('/admin')
        ? `${this.apiUrlService.getApiUrl()}admin/categories`
        : `${this.apiUrlService.getApiUrl()}categories`;
      return this.http
        .get<Category[]>(apiUrl, { headers })
        .pipe(catchError(this.handleError<Category[]>('getData', [])));
    } else {
      console.error('Nenhum token de autenticação disponível');
      return of([]);
    }
  }

  getCategoria(categoryId: number): Observable<Category | undefined> {
    const headers = this.getHeaders();
    if (headers) {
      const url = `${this.apiUrlService.getApiUrl()}categories/${categoryId}`;
      return this.http
        .get<Category>(url, { headers })
        .pipe(catchError(this.handleError<Category>('getCategoria')));
    } else {
      console.error('Nenhum token de autenticação disponível');
      return of(undefined);
    }
  }

  getQuestao(questionId: number): Observable<Question | undefined> {
    const headers = this.getHeaders();
    if (headers) {
      const url = `${this.apiUrlService.getApiUrl()}admin/questions/${questionId}`;
      return this.http
        .get<Question>(url, { headers })
        .pipe(catchError(this.handleError<Question>('getQuestao')));
    } else {
      console.error('Nenhum token de autenticação disponível');
      return of(undefined);
    }
  }

  atualizarQuestao(question: Question): Observable<Question | undefined> {
    const headers = this.getHeaders();
    if (headers) {
      const url = `${this.apiUrlService.getApiUrl()}admin/questions/${
        question.id
      }`;
      return this.http.put<Question>(url, question, { headers }).pipe(
        tap((response) => {
          console.log('Resposta da API para atualizarQuestao:', response);
        }),
        catchError(this.handleError<Question>('atualizarQuestao'))
      );
    } else {
      console.error('Nenhum token de autenticação disponível');
      return of(undefined);
    }
  }

  adicionarQuestao(questao: any): Observable<Question | undefined> {
    const headers = this.getHeaders();
    if (headers) {
      const url = `${this.apiUrlService.getApiUrl()}admin/questions`;
      return this.http
        .post<Question>(url, questao, { headers })
        .pipe(catchError(this.handleError<Question>('adicionarQuestao')));
    } else {
      console.error('Nenhum token de autenticação disponível');
      return of(undefined);
    }
  }

  excluirQuestao(questionId: number): Observable<any> {
    const headers = this.getHeaders();
    if (headers) {
      const url = `${this.apiUrlService.getApiUrl()}admin/questions/${questionId}`;
      return this.http
        .delete(url, { headers })
        .pipe(catchError(this.handleError('excluirQuestao')));
    } else {
      console.error('Nenhum token de autenticação disponível');
      return of(null);
    }
  }

  adicionarCategoria(name: string): Observable<Category | undefined> {
    const headers = this.getHeaders();
    if (headers) {
      const url = `${this.apiUrlService.getApiUrl()}categories`;
      const category = { name: name };
      return this.http
        .post<Category>(url, category, { headers })
        .pipe(catchError(this.handleError<Category>('adicionarCategoria')));
    } else {
      console.error('Nenhum token de autenticação disponível');
      return of(undefined);
    }
  }

  atualizarCategoria(category: Category): Observable<Category | undefined> {
    const headers = this.getHeaders();
    if (headers) {
      const url = `${this.apiUrlService.getApiUrl()}categories/${category.id}`;
      return this.http
        .put<Category>(url, category, { headers })
        .pipe(catchError(this.handleError<Category>('atualizarCategoria')));
    } else {
      console.error('Nenhum token de autenticação disponível');
      return of(undefined);
    }
  }

  excluirCategoria(categoryId: number): Observable<any> {
    const headers = this.getHeaders();
    if (headers) {
      const url = `${this.apiUrlService.getApiUrl()}categories/${categoryId}`;
      return this.http
        .delete(url, { headers })
        .pipe(catchError(this.handleError('excluirCategoria')));
    } else {
      console.error('Nenhum token de autenticação disponível');
      return of(null);
    }
  }
}
