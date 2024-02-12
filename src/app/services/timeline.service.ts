import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TimelineItem } from '../models/form.model';

@Injectable({
  providedIn: 'root',
})
export class TimelineService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  createTimeline(item: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, item);
  }

  getTimeline(): Observable<{ timeline: TimelineItem[] }> {
    return this.http.get<{ timeline: TimelineItem[] }>(
      `${this.apiUrl}/timeline`
    );
  }

  updateTimeline(id: number, item: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/timeline/${id}`, item);
  }
}
