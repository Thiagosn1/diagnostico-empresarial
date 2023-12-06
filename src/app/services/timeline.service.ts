import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimelineService {
  //private apiUrl = 'http://localhost:4200/api';
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  createTimeline(item: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/timeline`, item);
  }

  getTimeline(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/timeline`);
  }

  updateTimeline(id: number, item: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/timeline/${id}`, item);
  }
}
