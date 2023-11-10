import { Component } from '@angular/core';
import { QuantidadePessoasService } from 'src/app/services/quantidade.pessoas.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { BusinessesService } from 'src/app/services/businesses.service';
import { cnpj as cnpjValidator } from 'cpf-cnpj-validator';

@Component({
  selector: 'app-cadastro-empresa',
  templateUrl: './cadastro-empresa.component.html',
  styleUrls: ['./cadastro-empresa.component.css'],
})
export class CadastroEmpresaComponent {
  public cnpjMask = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/,];
  public mensagemErro: string = '';

  constructor(
    private router: Router,
    private businessesService: BusinessesService,
    private qtdPessoasService: QuantidadePessoasService
  ) {}

  onSubmit(formValue: any, form: NgForm) {
    if (form.valid && cnpjValidator.isValid(formValue.cnpj)) {
      const business = {
        name: formValue.nomeEmpresa,
        cnpjCpf: formValue.cnpj,
        businessUsers: null,
      };

      this.businessesService.criarEmpresa(business).subscribe((res) => {
        this.qtdPessoasService.setQuantidadePessoas(
          formValue.quantidadePessoas
        );
        this.router.navigate(['/info']);
      });
    } else {
      if (!form.valid) {
        this.mensagemErro = 'Por favor, preencha todos os campos.';
      } else if (!cnpjValidator.isValid(formValue.cnpj)) {
        this.mensagemErro = 'Por favor, insira um CNPJ válido.';
      }
      console.log(this.mensagemErro);
      setTimeout(() => {
        this.mensagemErro = '';
      }, 2000);
    }
  }

  formatarCNPJ(event: any) {
    let cnpj = event.target.value;
    cnpj = cnpj.replace(/\D/g, ''); // Remove tudo o que não é dígito
    if (cnpj.length > 14) {
      cnpj = cnpj.slice(0, 14); // Limita a entrada a 14 dígitos
    }
    cnpj = cnpj.replace(/^(\d{2})(\d)/, '$1.$2'); // Coloca ponto entre o segundo e o terceiro dígitos
    cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3'); // Coloca ponto entre o quinto e o sexto dígitos
    cnpj = cnpj.replace(/\.(\d{3})(\d)/, '.$1/$2'); // Coloca uma barra entre o oitavo e o nono dígitos
    cnpj = cnpj.replace(/(\d{4})(\d)/, '$1-$2'); // Coloca um hífen depois do bloco de quatro dígitos
    event.target.value = cnpj;
  }

  permitirApenasNumeros(event: any) {
    const pattern = /[0-9\.\-\/]/; // Padrão de caracteres permitidos (números, ponto, hífen e barra)
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // Se o caractere digitado não estiver no padrão permitido
      event.preventDefault(); // Cancela o evento
    }
  }
}