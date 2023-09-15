import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  email = '';

  constructor(private http: HttpClient) { }

  /* sendEmail(email: string) {
    return this.http.post('http://localhost:3000/send-token', { email });
  } */
}
