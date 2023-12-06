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

  // Buscar businessUserId
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
          return throwError('Erro ao buscar o businessUserId');
        })
      );
    } else {
      console.error('Nenhum token de autenticação disponível');
      return of(null);
    }
  }

  // Salvar resposta na api
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
            'Nenhum businessUserId encontrado ou token de autenticação disponível'
          );
        }
      }),
      catchError((error) => {
        console.error('Erro ao salvar a resposta com businessUserId:', error);
        return throwError('Erro ao salvar a resposta com businessUserId');
      })
    );
  }
}
