import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TimelineItem } from '../models/form.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TimelineService {
  private apiUrl = 'http://localhost:4200/api/admin/timelines';

  constructor(private http: HttpClient, private authService: AuthService) {}

  createTimeline(item: any): Observable<any> {
    const token = this.authService.getToken();

    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      return this.http.post<any>(`${this.apiUrl}`, item, { headers });
    } else {
      console.error('Nenhum token de autenticação disponível');
      return new Observable<any>((subscriber) => {
        subscriber.next(null);
        subscriber.complete();
      });
    }
  }

  getTimeline(): Observable<TimelineItem[]> {
    const token = this.authService.getToken();
    const headers = token
      ? new HttpHeaders().set('Authorization', token)
      : undefined;
    return this.http.get<TimelineItem[]>(this.apiUrl, { headers });
  }

  updateTimeline(id: number, item: any): Observable<any> {
    const token = this.authService.getToken();

    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      return this.http.put<any>(`${this.apiUrl}/${id}`, item, { headers });
    } else {
      console.error('Nenhum token de autenticação disponível');
      return new Observable<any>((subscriber) => {
        subscriber.next(null);
        subscriber.complete();
      });
    }
  }
}
