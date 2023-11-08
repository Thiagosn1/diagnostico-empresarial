import { Component } from '@angular/core';
import { QuantidadePessoasService } from 'src/app/services/quantidade.pessoas.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { BusinessesService } from 'src/app/services/businesses.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-cadastro-empresa',
  templateUrl: './cadastro-empresa.component.html',
  styleUrls: ['./cadastro-empresa.component.css'],
})
export class CadastroEmpresaComponent {
  constructor(
    private router: Router,
    private businessesService: BusinessesService,
    private qtdPessoasService: QuantidadePessoasService
  ) {}

  onSubmit(formValue: any, form: NgForm) {
    if (form.valid) {
      const business = {
        name: formValue.nomeEmpresa,
        cnpjCpf: formValue.cnpj,
        businessUsers: null
      };

      this.businessesService.criarEmpresa(business).subscribe(res => {
        this.qtdPessoasService.setQuantidadePessoas(formValue.quantidadePessoas);
        this.router.navigate(['/info']);
      });
    } else {
      console.log('Formulário inválido');
    }
  }
}