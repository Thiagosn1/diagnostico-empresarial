import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BusinessUsersService } from 'src/app/services/businessUsers.service';
import { BusinessesService } from 'src/app/services/businesses.service';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css'],
})
export class EmpresaComponent {
  columnsToDisplay = ['email', 'status', 'answers', 'actions'];
  dataSource = new MatTableDataSource();
  userEmail = '';
  errorMessage = '';
  successMessage = '';
  nomeEmpresa = '';
  cnpjEmpresa = '';
  editandoEmpresa = false;
  idEmpresa: number = 1;

  constructor(
    private businessUsersService: BusinessUsersService,
    private businessesService: BusinessesService
  ) {}

  ngOnInit(): void {
    this.carregarEmpresa();
    this.carregarFuncionarios();
  }

  carregarEmpresa(): void {
    this.businessesService.obterEmpresas().subscribe(
      (data: any[]) => {
        if (data.length > 0) {
          this.nomeEmpresa = data[0].name;
          this.cnpjEmpresa = data[0].cnpjCpf;
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  editarEmpresa(): void {
    this.editandoEmpresa = !this.editandoEmpresa;
    if (!this.editandoEmpresa) {
      this.atualizarEmpresa();
    }
  }

  atualizarEmpresa(): void {
    const empresaAtualizada = {
      name: this.nomeEmpresa,
      cnpjCpf: this.cnpjEmpresa,
    };
    this.businessesService
      .atualizarEmpresa(this.idEmpresa, empresaAtualizada)
      .subscribe(
        () => {
          console.log('Empresa atualizada com sucesso');
          this.carregarEmpresa();
        },
        (error) => {
          console.error('Erro ao atualizar a empresa:', error);
        }
      );
  }

  carregarFuncionarios(): void {
    this.businessUsersService.obterFuncionarios().subscribe(
      (data: any[]) => {
        data.sort((a: any, b: any) => a.id - b.id);
        this.dataSource.data = data.map((businessUsers) => {
          return {
            ...businessUsers,
            invitationAccepted: businessUsers.invitationAccepted
              ? 'Convite Aceito'
              : 'Convite não Aceito',
          };
        });
        this.dataSource._updateChangeSubscription();
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  convidarFuncionario(): void {
    let validarEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (this.userEmail && validarEmail.test(this.userEmail)) {
      this.businessUsersService.convidarFuncionario(this.userEmail).subscribe(
        () => {
          this.successMessage = 'Convite enviado';
          this.userEmail = '';
          setTimeout(() => (this.successMessage = ''), 3000);
          this.carregarFuncionarios();
        },
        (error) => {
          console.error('Error:', error);
          this.errorMessage = 'Erro ao enviar convite';
          setTimeout(() => (this.errorMessage = ''), 3000);
        }
      );
    } else {
      this.errorMessage = 'Por favor, insira um email válido';
      setTimeout(() => (this.errorMessage = ''), 3000);
    }
  }

  reenviarConvite(id: number, email: string): void {
    this.businessUsersService.reenviarConvite(id, email).subscribe(
      () => {
        this.successMessage = 'Convite reenviado';
        setTimeout(() => (this.successMessage = ''), 3000);
        this.carregarFuncionarios();
      },
      (error) => {
        console.error('Error:', error);
        this.errorMessage = 'Erro ao reenviar convite';
        setTimeout(() => (this.errorMessage = ''), 3000);
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
