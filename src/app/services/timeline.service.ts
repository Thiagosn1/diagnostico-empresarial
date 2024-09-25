import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { TimelineItem } from '../models/form.model';
import { AuthService } from './auth.service';
import { ApiUrlService } from './apiUrl.service';

@Injectable({
  providedIn: 'root',
})
export class TimelineService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
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

  createTimeline(item: any): Observable<any> {
    const headers = this.getHeaders();
    if (!headers) return of(null);

    return this.http
      .post<any>(`${this.apiUrlService.getApiUrl()}admin/timelines`, item, {
        headers,
      })
      .pipe(catchError(this.handleError<any>('createTimeline')));
  }

  getTimeline(): Observable<TimelineItem[]> {
    const headers = this.getHeaders();
    if (!headers) return of([]);

    return this.http
      .get<TimelineItem[]>(`${this.apiUrlService.getApiUrl()}admin/timelines`, {
        headers,
      })
      .pipe(catchError(this.handleError<TimelineItem[]>('getTimeline', [])));
  }

  updateTimeline(id: number, item: any): Observable<any> {
    const headers = this.getHeaders();
    if (!headers) return of(null);

    return this.http
      .put<any>(
        `${this.apiUrlService.getApiUrl()}admin/timelines/${id}`,
        item,
        { headers }
      )
      .pipe(catchError(this.handleError<any>('updateTimeline')));
  }
}
