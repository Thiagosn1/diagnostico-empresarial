import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { format } from 'date-fns';
import { concatMap, forkJoin, map, tap } from 'rxjs';
import { RelatorioComponent } from 'src/app/components/relatorio/relatorio.component';
import { User } from 'src/app/models/form.model';
import { BusinessesService } from 'src/app/services/businesses.service';
import { TimelineService } from 'src/app/services/timeline.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css'],
})
export class EmpresasComponent implements OnInit {
  colunasExibidas: string[] = [
    'id',
    'nome',
    'cnpj',
    'managerId',
    'relatorio',
    'acao',
  ];
  emailEmpresa: { [key: number]: string } = {};
  dataSource = new MatTableDataSource();
  editingBusinessId: number | null = null;

  constructor(
    private businessesService: BusinessesService,
    private timelineService: TimelineService,
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.obterUsuarios();
    this.carregarEmpresas();
  }

  abrirModalRelatorio(business: any) {
    console.log(business);
    this.dialog.open(RelatorioComponent, {
      width: '800px',
      height: '600px',
      data: { business: business },
      autoFocus: false,
    });
  }

  obterUsuarios(): void {
    this.businessesService.obterUsuarios().subscribe({
      next: (users: User[]) => {
        users.forEach((user: User) => {
          this.emailEmpresa[user.id] = user.email;
        });
      },
      error: (error) => {
        console.error('Erro ao obter usuários:', error);
      },
    });
  }

  carregarEmpresas(): void {
    this.businessesService.obterEmpresas().subscribe({
      next: (data: any[]) => {
        data.sort((a: any, b: any) => a.id - b.id);
        this.dataSource.data = data;
        this.dataSource._updateChangeSubscription();
      },
      error: (error) => {
        console.error('Erro ao carregar empresas:', error);
      },
    });
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  alternarEdicao(business: any): void {
    if (this.editingBusinessId === business.id) {
      const user = {
        id: business.managerId,
        email: this.emailEmpresa[business.managerId],
      };
      this.userService.atualizarUsuario(user.id, user).subscribe({
        next: () => {
          console.log('Email do usuário atualizado com sucesso');
          this.atualizarEmpresa(business);
        },
        error: (error) =>
          console.error('Erro ao atualizar email do usuário:', error),
      });
      this.editingBusinessId = null;
    } else {
      this.editingBusinessId = business.id;
    }
  }

  atualizarEmpresa(empresa: any): void {
    this.businessesService.atualizarEmpresa(empresa.id, empresa).subscribe({
      next: () => {
        const descricao = `A empresa ${empresa.name} foi atualizada`;
        this.salvarAlteracaoNaTimeline(descricao);
        this.carregarEmpresas();
      },
      error: (error) => console.error('Erro ao atualizar empresa:', error),
    });
  }

  excluirEmpresa(empresa: any): void {
    forkJoin({
      usuarios: this.userService.obterUsuarios(),
      empresa: this.businessesService.obterEmpresa(empresa.id),
    })
      .pipe(
        concatMap(({ usuarios, empresa }) => {
          const usuariosCorrespondentes = empresa.businessUsers
            .map((businessUser: any) => {
              return usuarios.find(
                (usuario: any) =>
                  usuario.id === businessUser.userId &&
                  usuario.email === businessUser.userEmail
              );
            })
            .filter((usuario: any) => usuario !== undefined);
          return this.businessesService.excluirEmpresa(empresa.id).pipe(
            tap({
              next: () => {
                const descricao = `A empresa ${empresa.name} foi excluída`;
                this.salvarAlteracaoNaTimeline(descricao);
                this.carregarEmpresas();
              },
              error: (error) =>
                console.error('Erro ao excluir empresa:', error),
            }),
            map(() => usuariosCorrespondentes)
          );
        }),
        concatMap((usuariosCorrespondentes: any[]) => {
          const exclusoesDeUsuarios = usuariosCorrespondentes.map(
            (usuario: any) => {
              return this.userService.excluirUsuario(usuario.id).pipe(
                tap({
                  next: () =>
                    console.log('Usuário excluído com sucesso:', usuario),
                  error: (error) =>
                    console.error('Erro ao excluir usuário:', error),
                })
              );
            }
          );

          return forkJoin(exclusoesDeUsuarios);
        })
      )
      .subscribe({
        next: () =>
          console.log('Todos os usuários correspondentes foram excluídos'),
        error: (error) => console.error('Erro ao excluir usuários:', error),
      });
  }

  salvarAlteracaoNaTimeline(descricao: string): void {
    const date = format(new Date(), 'dd-MM-yyyy HH:mm');
    const newItem = {
      date: date,
      description: descricao,
    };

    this.timelineService.createTimeline(newItem).subscribe({
      next: (response) => {
        console.log('Alteração salva na linha do tempo:');
      },
      error: (error) =>
        console.error('Erro ao salvar alteração na linha do tempo:'),
    });
  }
}
