import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  email = '';

  constructor(private http: HttpClient) { }

  // Método para enviar o email para a API
  sendEmail(email: string) {
    this.email = email;
    const body = {
      "email": email
    };
    return this.http.post('http://localhost:3000/requirelogin', body);
  }
  

  // Método para enviar o token para a API
  submitToken(token: string) {
    const body = {
      "email": this.email,
      "loginCode": token
    };
    return this.http.post('http://localhost:3000/login', body);
  }  
}
