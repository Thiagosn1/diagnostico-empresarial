import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { BusinessesService } from 'src/app/services/businesses.service';
import { cnpj as cnpjValidator } from 'cpf-cnpj-validator';
import { BusinessUsersService } from 'src/app/services/businessUsers.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-cadastro-empresa',
  templateUrl: './cadastro-empresa.component.html',
  styleUrls: ['./cadastro-empresa.component.css'],
})
export class CadastroEmpresaComponent {
  public cnpjMask = [
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
    /\d/,
    '/',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
  ];
  public mensagemErro: string = '';

  constructor(
    private router: Router,
    private businessesService: BusinessesService,
    private businessUsersService: BusinessUsersService,
    private userService: UserService
  ) {}

  submeterFormulario(formValue: any, form: NgForm) {
    if (form.valid && cnpjValidator.isValid(formValue.cnpj)) {
      const business = {
        name: formValue.nomeEmpresa,
        cnpjCpf: formValue.cnpj,
      };

      this.businessesService.criarEmpresa(business).subscribe(() => {
        this.router.navigate(['/gestao-empresa']);
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

  /* submeterFormulario(formValue: any, form: NgForm) {
    if (form.valid && cnpjValidator.isValid(formValue.cnpj)) {
      const business = {
        name: formValue.nomeEmpresa,
        cnpjCpf: formValue.cnpj,
      };

      this.businessesService.criarEmpresa(business).subscribe(() => {
        if (formValue.quantidadePessoas > 1) {
          this.router.navigate(['/gestao-empresa']);
        } else {
          this.router.navigate(['/info']);
        }
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
  } */

  formatarCNPJ(event: any) {
    let cnpj = event.target.value;
    cnpj = cnpj.replace(/\D/g, '');
    if (cnpj.length > 14) {
      cnpj = cnpj.slice(0, 14);
    }
    cnpj = cnpj.replace(/^(\d{2})(\d)/, '$1.$2');
    cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    cnpj = cnpj.replace(/\.(\d{3})(\d)/, '.$1/$2');
    cnpj = cnpj.replace(/(\d{4})(\d)/, '$1-$2');
    event.target.value = cnpj;
  }

  permitirApenasNumeros(event: any) {
    const pattern = /[0-9\.\-\/]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
