import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/form.model';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  constructor(private http: HttpClient) { }

  // Método para obter dados da api
  getData(): Observable<Category[]> {
    return this.http.get<Category[]>('http://localhost:3000/formulario');
    //return this.http.get<Category[]>('http://localhost:4200/api/categories'); 
  }
}
