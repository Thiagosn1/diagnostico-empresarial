import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, catchError, map, mergeMap, of, throwError } from 'rxjs';
import { ApiUrlService } from './apiUrl.service';

@Injectable({
  providedIn: 'root',
})
export class AnswerService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private apiUrlService: ApiUrlService
  ) {}

  private getHeaders(): HttpHeaders | null {
    const token = this.authService.getToken();
    return token ? new HttpHeaders().set('Authorization', token) : null;
  }

  private handleError(operation: string) {
    return (error: any): Observable<never> => {
      console.error(`Erro ao ${operation}:`, error);
      return throwError(() => new Error(`Erro ao ${operation}`));
    };
  }

  private getUrl(endpoint: string): string {
    return `${this.apiUrlService.getApiUrl()}${endpoint}`;
  }

  buscarBusinessUserId(): Observable<number | null> {
    const headers = this.getHeaders();
    if (!headers) return of(null);

    return this.http.get<any[]>(this.getUrl('businessusers'), { headers }).pipe(
      map((businessUsers) => businessUsers[0]?.id ?? null),
      catchError(this.handleError('buscar o businessUserId'))
    );
  }

  buscarQuestoes(): Observable<any[] | null> {
    const headers = this.getHeaders();
    if (!headers) return of(null);

    return this.http.get<any[]>(this.getUrl('questions'), { headers }).pipe(
      map((questoes) => questoes.sort((a, b) => a.position - b.position)),
      catchError(this.handleError('buscar as questões'))
    );
  }

  buscarRespostas(): Observable<any[] | null> {
    const headers = this.getHeaders();
    if (!headers) return of(null);

    return this.http.get<any[]>(this.getUrl('businessusers'), { headers }).pipe(
      map((businessUsers) => businessUsers[0]?.answers ?? null),
      catchError(this.handleError('buscar as respostas'))
    );
  }

  buscarCategorias(): Observable<any[] | null> {
    const headers = this.getHeaders();
    if (!headers) return of(null);

    return this.http.get<any[]>(this.getUrl('categories'), { headers }).pipe(
      map((categorias) => categorias.sort((a, b) => a.position - b.position)),
      catchError(this.handleError('buscar as categorias'))
    );
  }

  salvarResposta(answer: any): Observable<any> {
    return this.buscarBusinessUserId().pipe(
      mergeMap((businessUserId) => {
        const headers = this.getHeaders();
        if (!businessUserId || !headers) {
          return throwError(
            () =>
              new Error(
                'Nenhum businessUserId encontrado ou token de autenticação disponível'
              )
          );
        }

        const answerWithBusinessUserId = { ...answer, businessUserId };
        return this.http.post<any>(
          this.getUrl('answers'),
          answerWithBusinessUserId,
          { headers }
        );
      }),
      catchError(this.handleError('salvar a resposta'))
    );
  }
}
