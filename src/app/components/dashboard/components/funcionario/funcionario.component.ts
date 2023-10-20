import { Component, OnInit } from '@angular/core';
import { FuncionarioService } from 'src/app/services/funcionario.service';

@Component({
  selector: 'app-funcionario',
  templateUrl: './funcionario.component.html',
  styleUrls: ['./funcionario.component.css'],
})
export class FuncionarioComponent implements OnInit {
  columnsToDisplay = [
    'email',
    'status',
    'actions',
  ];
  funcionarios: any[] = [];
  email = '';
  errorMessage = '';
  successMessage = '';

  constructor(private funcionarioService: FuncionarioService) {}

  ngOnInit(): void {
    this.fetchFuncionarios();
  }

  fetchFuncionarios(): void {
    this.funcionarioService.getFuncionarios().subscribe(
      (data) => {
        this.funcionarios = data;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  convidarFuncionario(): void {
    if (this.email) {
      this.funcionarioService.convidarFuncionario(this.email).subscribe(
        () => {
          this.fetchFuncionarios();
          this.email = ''; // Limpando o campo de email após o convite ser enviado.
          this.successMessage = 'Convite enviado';
          setTimeout(() => (this.successMessage = ''), 3000); // Limpar mensagem de sucesso após 3 segundos.
        },
        (error) => {
          console.error('Error:', error);
          this.errorMessage = 'Erro ao enviar convite';
          setTimeout(() => (this.errorMessage = ''), 3000); // Limpar mensagem de erro após 3 segundos.
        }
      );
    } else {
      this.errorMessage = 'Por favor, insira um email válido';
      setTimeout(() => (this.errorMessage = ''), 3000); // Limpar mensagem de erro após 3 segundos.
    }
  }

  reenviarConvite(id: number, email: string): void {
    this.funcionarioService.reenviarConvite(id, email).subscribe(
      () => {
        this.fetchFuncionarios();
        this.successMessage = 'Convite reenviado';
        setTimeout(() => (this.successMessage = ''), 3000); // Limpar mensagem de sucesso após 3 segundos.
      },
      (error) => {
        console.error('Error:', error);
        this.errorMessage = 'Erro ao reenviar convite';
        setTimeout(() => (this.errorMessage = ''), 3000); // Limpar mensagem de erro após 3 segundos.
      }
    );
  }

  removerFuncionario(id: number): void {
    this.funcionarioService.removerFuncionario(id).subscribe(
      () => {
        this.fetchFuncionarios();
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}
