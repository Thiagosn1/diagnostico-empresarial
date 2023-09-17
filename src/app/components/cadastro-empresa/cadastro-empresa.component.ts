import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cadastro-empresa',
  templateUrl: './cadastro-empresa.component.html',
  styleUrls: ['./cadastro-empresa.component.css']
})
export class CadastroEmpresaComponent {
  constructor(private http: HttpClient, private router: Router) { }

  onSubmit(formValue: any) {
    this.http.post('http://localhost:3000/cadastro', formValue).subscribe(res => {
      if (formValue.quantidadePessoas === '1') {
        this.router.navigate(['/info']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    });
  }
}