import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, catchError, map, mergeMap, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnswerService {
  private apiUrl = 'http://localhost:4200/api';
  private answersUrl = `${this.apiUrl}/answers`;
  private businessUsersUrl = `${this.apiUrl}/businessusers`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  buscarBusinessUserId(): Observable<any> {
    const token = this.authService.getToken();

    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      return this.http.get<any[]>(this.businessUsersUrl, { headers }).pipe(
        map((businessUsers) => {
          if (businessUsers && businessUsers.length > 0) {
            return businessUsers[0].id;
          } else {
            throw new Error('Nenhum businessUser encontrado');
          }
        }),
        catchError((error) => {
          console.error('Erro ao buscar o businessUserId:', error);
          return throwError(() => new Error('Erro ao buscar o businessUserId'));
        })
      );
    } else {
      console.error('Nenhum token de autenticação disponível');
      return of(null);
    }
  }

  buscarQuestoes(): Observable<any> {
    const token = this.authService.getToken();

    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      return this.http
        .get<any[]>('http://localhost:4200/api/questions', { headers })
        .pipe(
          map((questoes) => questoes.sort((a, b) => a.position - b.position)),
          catchError((error) => {
            console.error('Erro ao buscar as questões:', error);
            return throwError(() => new Error('Erro ao buscar as questões'));
          })
        );
    } else {
      console.error('Nenhum token de autenticação disponível');
      return of(null);
    }
  }

  buscarRespostas(): Observable<any> {
    const token = this.authService.getToken();

    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      return this.http.get<any[]>(this.businessUsersUrl, { headers }).pipe(
        map((businessUsers) => {
          if (businessUsers && businessUsers.length > 0) {
            return businessUsers[0].answers;
          } else {
            throw new Error('Nenhum businessUser encontrado');
          }
        }),
        catchError((error) => {
          console.error('Erro ao buscar as respostas:', error);
          return throwError(() => new Error('Erro ao buscar as respostas'));
        })
      );
    } else {
      console.error('Nenhum token de autenticação disponível');
      return of(null);
    }
  }

  buscarCategorias(): Observable<any> {
    const token = this.authService.getToken();

    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      return this.http
        .get<any[]>('http://localhost:4200/api/categories', { headers })
        .pipe(
          map((categorias) =>
            categorias.sort((a, b) => a.position - b.position)
          ),
          catchError((error) => {
            console.error('Erro ao buscar as categorias:', error);
            return throwError(() => new Error('Erro ao buscar as categorias'));
          })
        );
    } else {
      console.error('Nenhum token de autenticação disponível');
      return of(null);
    }
  }

  salvarResposta(answer: any): Observable<any> {
    return this.buscarBusinessUserId().pipe(
      mergeMap((businessUserId) => {
        const token = this.authService.getToken();

        if (businessUserId !== null && token) {
          const answerWithBusinessUserId = { ...answer, businessUserId };
          const headers = new HttpHeaders().set('Authorization', token);
          return this.http.post<any>(
            this.answersUrl,
            answerWithBusinessUserId,
            { headers }
          );
        } else {
          console.error(
            'Nenhum businessUserId encontrado ou token de autenticação disponível'
          );
          return throwError(
            () =>
              new Error(
                'Nenhum businessUserId encontrado ou token de autenticação disponível'
              )
          );
        }
      })
    );
  }
}
