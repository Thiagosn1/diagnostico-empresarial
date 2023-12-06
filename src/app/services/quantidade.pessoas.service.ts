import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuantidadePessoasService {
  private quantidadePessoasSource = new BehaviorSubject<number>(0);
  quantidadePessoas$ = this.quantidadePessoasSource.asObservable();

  // Método para atualizar a quantidade de pessoas
  setQuantidadePessoas(quantidade: number) {
    this.quantidadePessoasSource.next(quantidade);
  }
}
