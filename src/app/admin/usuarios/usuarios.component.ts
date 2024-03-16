import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/services/user.service';
import { TimelineService } from 'src/app/services/timeline.service';
import { format } from 'date-fns';
import { BusinessesService } from 'src/app/services/businesses.service';
import { BusinessUsersService } from 'src/app/services/businessUsers.service';
import { forkJoin, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {
  colunasExibidas: string[] = ['id', 'email', 'tipo', 'acao'];
  editingUserId: number | null = null;
  dataSource = new MatTableDataSource();

  constructor(
    private userService: UserService,
    private timelineService: TimelineService,
    private businessesService: BusinessesService,
    private businessUsersService: BusinessUsersService
  ) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.userService.obterUsuarios().subscribe({
      next: (usuarios: any[]) => {
        usuarios.forEach((usuario: any) => {
          if (
            usuario.authority === 'DEFAULT' &&
            usuario.businesses.length === 0 &&
            usuario.businessUsers.length === 0
          ) {
            this.excluirUsuario(usuario);
          }
        });
        usuarios = usuarios.filter(
          (usuario) =>
            usuario.authority !== 'DEFAULT' ||
            usuario.businesses.length > 0 ||
            usuario.businessUsers.length > 0
        );
        usuarios.sort((a: any, b: any) => a.id - b.id);
        this.dataSource.data = usuarios;
        this.dataSource._updateChangeSubscription();
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
      },
    });
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  alternarEdicao(user: any): void {
    if (this.editingUserId === user.id) {
      this.atualizarUsuario(user);
      this.editingUserId = null;
    } else {
      this.editingUserId = user.id;
    }
  }

  atualizarUsuario(user: any): void {
    this.userService.atualizarUsuario(user.id, user).subscribe({
      next: () => {
        const descricao = `O usuário ${user.email} foi atualizado`;
        this.salvarAlteracaoNaTimeline(descricao);
        this.carregarUsuarios();
      },
      error: (error) => {
        console.error('Erro ao atualizar usuário:', error);
      },
    });
  }

  tornarAdmin(usuario: any): void {
    this.userService.tornarAdmin(usuario.id).subscribe({
      next: () => {
        const descricao = `${usuario.email} tornou-se administrador`;
        this.salvarAlteracaoNaTimeline(descricao);
        this.carregarUsuarios();
      },
      error: (error) => {
        console.error('Erro ao tornar usuário admin:', error);
      },
    });
  }

  removerAdmin(usuario: any): void {
    this.userService.removerAdmin(usuario.id).subscribe({
      next: () => {
        const descricao = `${usuario.email} deixou de ser administrador`;
        this.salvarAlteracaoNaTimeline(descricao);
        this.carregarUsuarios();
      },
      error: (error) => {
        console.error('Erro ao remover admin:', error);
      },
    });
  }

  excluirUsuario(usuario: any): void {
    this.businessesService
      .obterEmpresas()
      .pipe(
        switchMap((empresas: any[]) => {
          const exclusoesDeUsuarios = empresas.map((empresa: any) => {
            const businessUserIndex = empresa.businessUsers.findIndex(
              (businessUser: any) => businessUser.userId === usuario.id
            );
            if (businessUserIndex !== -1) {
              return this.businessUsersService.removerFuncionario(
                empresa.businessUsers[businessUserIndex].id
              );
            }
            if (empresa.managerId === usuario.id) {
              return this.businessesService.excluirEmpresa(empresa.id);
            }
            return of(null);
          });
          return forkJoin(exclusoesDeUsuarios);
        }),
        switchMap(() => {
          return this.userService.excluirUsuario(usuario.id);
        })
      )
      .subscribe({
        next: () => {
          const descricao = `${usuario.email} foi excluído`;
          this.salvarAlteracaoNaTimeline(descricao);
          this.carregarUsuarios();
          console.log('Usuário excluído com sucesso:', usuario);
        },
        error: (error) => {
          console.error('Erro ao excluir usuário:', error);
        },
      });
  }

  obterAutoridade(usuario: any) {
    if (usuario.authority === 'ROOT') {
      return 'Administrador';
    } else if (usuario.authority === 'DEFAULT') {
      return 'Padrão';
    } else {
      return usuario.authority;
    }
  }

  salvarAlteracaoNaTimeline(descricao: string): void {
    const date = format(new Date(), 'dd-MM-yyyy HH:mm');
    const newItem = {
      date: date,
      description: descricao,
    };

    this.timelineService.createTimeline(newItem).subscribe({
      next: (response) => {
        console.log('Alteração salva na linha do tempo:', response);
      },
      error: (error) => {
        console.error('Erro ao salvar alteração na linha do tempo:', error);
      },
    });
  }
}