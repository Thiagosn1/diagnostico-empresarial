import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QuantidadePessoasService } from 'src/app/services/quantidade.pessoas.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cadastro-empresa',
  templateUrl: './cadastro-empresa.component.html',
  styleUrls: ['./cadastro-empresa.component.css']
})
export class CadastroEmpresaComponent {
  constructor(private http: HttpClient, private router: Router, private qtdPessoasService: QuantidadePessoasService) { }

  onSubmit(formValue: any) {
    this.http.post('http://localhost:3000/cadastro', formValue).subscribe(res => {
      this.qtdPessoasService.setQuantidadePessoas(formValue.quantidadePessoas);
      this.router.navigate(['/info']);
    });
  }
}