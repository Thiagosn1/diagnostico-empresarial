import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BusinessUsersService } from 'src/app/services/businessUsers.service';
import { BusinessesService } from 'src/app/services/businesses.service';
import { EmailService } from 'src/app/services/email.service';
import { UserService } from 'src/app/services/user.service';
import { RelatorioComponent } from '../relatorio/relatorio.component';

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
  emailEmpresaOriginal!: string;
  emailEmpresa = '';
  editandoEmpresa = false;
  idEmpresa: number = 1;

  constructor(
    private businessUsersService: BusinessUsersService,
    private businessesService: BusinessesService,
    private emailService: EmailService,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.emailService.buscarEmail().subscribe({
      next: (data) => {
        if (data) {
          this.emailEmpresa = data.email;
        }
      },
      error: (error) => {
        console.error('Erro ao buscar o email:', error);
      },
    });
    this.carregarEmpresa();
    this.carregarFuncionarios();
  }

  abrirModalRelatorio(): void {
    this.dialog.open(RelatorioComponent, {
      width: '800px',
      height: '600px',
      data: { business: this.idEmpresa },
      autoFocus: false,
    });
  }

  carregarEmpresa(): void {
    this.businessesService.obterEmpresas().subscribe({
      next: (data: any[]) => {
        if (data.length > 0) {
          this.nomeEmpresa = data[0].name;
          this.cnpjEmpresa = data[0].cnpjCpf;
        }
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }

  atualizarEmpresa(): void {
    if (!this.editandoEmpresa) {
      let empresaAtualizada = {
        name: this.nomeEmpresa,
        cnpjCpf: this.cnpjEmpresa,
        emailEmpresa: this.emailEmpresa,
      };

      this.businessesService
        .atualizarEmpresa(this.idEmpresa, empresaAtualizada)
        .subscribe({
          next: () => {
            console.log('Empresa atualizada com sucesso');
            this.carregarEmpresa();
          },
          error: (error) => {
            console.error('Erro ao atualizar a empresa:', error);
          },
        });

      if (this.emailEmpresa !== this.emailEmpresaOriginal) {
        this.atualizarEmail(this.emailEmpresa);
      }

      this.editandoEmpresa = false;
    }
  }

  atualizarEmail(novoEmail: string): void {
    this.emailService.buscarEmail().subscribe({
      next: (data) => {
        if (data) {
          const user = {
            id: data.id,
            email: novoEmail,
          };
          this.userService.atualizarUsuario(user.id, user).subscribe({
            next: () => {
              console.log('Email atualizado com sucesso');
              this.emailEmpresa = novoEmail;
              this.router.navigate(['/login']);
            },
            error: (error) => console.error('Erro ao atualizar email:', error),
          });
        }
      },
      error: (error) => {
        console.error('Erro ao buscar o email:', error);
      },
    });
  }

  editarEmpresa(): void {
    this.editandoEmpresa = !this.editandoEmpresa;
    if (this.editandoEmpresa) {
      this.emailEmpresaOriginal = this.emailEmpresa;
    } else {
      this.atualizarEmpresa();
    }
  }

  carregarFuncionarios(): void {
    this.businessUsersService.obterFuncionarios().subscribe({
      next: (data: any[]) => {
        data.sort((a: any, b: any) => a.id - b.id);
        this.dataSource.data = data.map((businessUsers) => {
          let statusConvite = '';

          if (businessUsers.answers.length >= 1) {
            statusConvite = 'Convite Aceito';
          } else {
            statusConvite = 'Convite Enviado';
          }

          return {
            ...businessUsers,
            invitationAccepted: statusConvite,
          };
        });
        this.dataSource._updateChangeSubscription();
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  convidarFuncionario(suppressMessage: boolean = false): void {
    let validarEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (this.userEmail && validarEmail.test(this.userEmail)) {
      if (!suppressMessage) {
        this.successMessage = 'Enviando convite...';
      }
      this.businessUsersService.convidarFuncionario(this.userEmail).subscribe({
        next: () => {
          if (!suppressMessage) {
            this.successMessage = 'Convite enviado.';
          }
          this.userEmail = '';
          setTimeout(() => (this.successMessage = ''), 3000);
          this.carregarFuncionarios();
        },
        error: (error) => {
          console.error('Error:', error);
          this.errorMessage = 'Erro ao enviar convite.';
          setTimeout(() => (this.errorMessage = ''), 2000);
        },
      });
    } else {
      this.errorMessage = 'Por favor, insira um email válido.';
      setTimeout(() => (this.errorMessage = ''), 2000);
    }
  }

  reenviarConvite(id: number, email: string): void {
    this.successMessage = 'Reenviando convite...';
    let emailFuncionario = email;
    this.businessUsersService.removerFuncionario(id).subscribe({
      next: () => {
        this.userEmail = emailFuncionario;
        this.convidarFuncionario();
        this.userEmail = '';
      },
      error: (error) => {
        console.error('Error:', error);
        this.errorMessage = 'Erro ao reenviar convite.';
        setTimeout(() => (this.errorMessage = ''), 2000);
      },
    });
  }

  removerFuncionario(id: number): void {
    this.businessUsersService.removerFuncionario(id).subscribe({
      next: () => {
        this.carregarFuncionarios();
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }

  deslogar(): void {
    localStorage.clear();
  }
}
