import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BusinessUsersService } from 'src/app/services/businessUsers.service';

@Component({
  selector: 'app-funcionario',
  templateUrl: './funcionario.component.html',
  styleUrls: ['./funcionario.component.css'],
})
export class FuncionarioComponent implements OnInit {
  columnsToDisplay = [
    'email',
    'actions',
  ];
  dataSource = new MatTableDataSource();
  userEmail = '';
  errorMessage = '';
  successMessage = '';

  constructor(private businessUsersService: BusinessUsersService) {}

  ngOnInit(): void {
    this.carregarFuncionarios();
  }

  carregarFuncionarios(): void {
    this.businessUsersService.obterFuncionarios().subscribe(
      (data) => {
        //data.sort((a: any, b: any) => a.id - b.id); 
        this.dataSource.data = data;
        this.dataSource._updateChangeSubscription();
        console.log(data);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  convidarFuncionario(): void {
    if (this.userEmail) {
      console.log(this.userEmail)
      this.businessUsersService.convidarFuncionario(this.userEmail).subscribe(
        () => {
          this.successMessage = 'Convite enviado';
          this.userEmail = ''; // Limpando o campo de email após o convite ser enviado.
          this.carregarFuncionarios();  
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
    this.businessUsersService.reenviarConvite(id, email).subscribe(
      () => {
        this.carregarFuncionarios();
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
    this.businessUsersService.removerFuncionario(id).subscribe(
      () => {
        this.carregarFuncionarios();
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}
