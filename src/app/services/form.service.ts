import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap, take, tap } from 'rxjs';
import { Category, Question } from '../models/form.model';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private apiUrl = 'http://localhost:4200/api/admin/categories';
  private apiUrlQuestions = 'http://localhost:4200/api/admin/questions';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

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

  // Método para atualizar a descrição de uma questão
  atualizarQuestao(question: Question): Observable<Question> {
    const token = this.authService.getToken();
    console.log('Token obtido:', token);
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

  // Método para adicionar uma questão
  adicionarQuestao(questao: any): Observable<any> {
    const token = this.authService.getToken();
    console.log('Token obtido:', token);
    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      return this.http.post(this.apiUrlQuestions, questao, { headers });
    } else {
      console.error('Nenhum token de autenticação disponível');
      return new Observable<any>((subscriber) => {
        subscriber.next([]);
        subscriber.complete();
      });
    }
  }

  // Método para excluir uma questão
  excluirQuestao(questionsId: number): Observable<any> {
    const token = this.authService.getToken();
    console.log('Token obtido:', token);
    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      const url = `${this.apiUrlQuestions}/${questionsId}`;
      return this.http.delete(url, { headers }).pipe(
        tap((response) => {
          console.log('Resposta da API para excluirQuestao:', response);
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

  // Método para adicionar uma categoria
  adicionarCategoria(name: string): Observable<Category> {
    const token = this.authService.getToken();
    console.log('Token obtido:', token);
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
