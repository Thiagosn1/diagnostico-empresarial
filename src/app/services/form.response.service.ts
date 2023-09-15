import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormResponseService {
  // Cria um BehaviorSubject que armazenará as respostas do formulário
  private responseSource = new BehaviorSubject({});
  // Expõe o BehaviorSubject como um Observable para que outros componentes possam se inscrever
  currentResponse = this.responseSource.asObservable();

  constructor() { }

  // Atualiza o BehaviorSubject com as novas respostas do formulário
  changeResponse(response: any) {
    this.responseSource.next(response);
  }
}