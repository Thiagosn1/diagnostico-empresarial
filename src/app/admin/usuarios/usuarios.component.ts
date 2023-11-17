import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/services/user.service';
import { TimelineService } from 'src/app/services/timeline.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'email', 'tipo', 'acao'];
  editingUserId: number | null = null;
  dataSource = new MatTableDataSource();

  constructor(
    private userService: UserService,
    private timelineService: TimelineService
  ) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  // Carrega os usuários
  carregarUsuarios(): void {
    this.userService.obterUsuarios().subscribe(
      (data: any[]) => {
        data.sort((a: any, b: any) => a.id - b.id); 
        this.dataSource.data = data;
        this.dataSource._updateChangeSubscription();
      },
      (error) => {
        console.error('Erro ao carregar usuários:', error);
      }
    );
  }

  // Aplica o filtro na tabela
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Método para alternar entre o modo de edição e visualização ao clicar nos botões Renomear/Confirmar
  toggleEditing(user: any): void {
    if (this.editingUserId === user.id) {
      this.atualizarUsuario(user);
      this.editingUserId = null;
    } else {
      this.editingUserId = user.id;
    }
  }

  // Método para atualizar um usuário
  atualizarUsuario(user: any): void {
    this.userService.atualizarUsuario(user.id, user).subscribe(
      () => {
        const descricao = `O usuário ${user.name} foi atualizado`;
        this.salvarAlteracaoNaTimeline(descricao);
        this.carregarUsuarios();
      },
      (error) => console.error('Erro ao atualizar usuário:', error)
    );
  }

  // Torna o usuário um administrador
  tornarAdmin(usuario: any): void {
    this.userService.tornarAdmin(usuario.id).subscribe(
      () => {
        const descricao = `${usuario.email} tornou-se administrador`;
        this.salvarAlteracaoNaTimeline(descricao);
        this.carregarUsuarios();
      },
      (error) => console.error('Erro ao tornar usuário admin:', error)
    );
  }

  // Remove o status de administrador do usuário
  removerAdmin(usuario: any): void {
    this.userService.removerAdmin(usuario.id).subscribe(
      () => {
        const descricao = `${usuario.email} deixou de ser administrador`;
        this.salvarAlteracaoNaTimeline(descricao);
        this.carregarUsuarios();
      },
      (error) => console.error('Erro ao remover admin:', error)
    );
  }

  // Exclui o usuário
  excluirUsuario(usuario: any): void {
    this.userService.excluirUsuario(usuario.id).subscribe(
      () => {
        const descricao = `${usuario.email} foi excluído`;
        this.salvarAlteracaoNaTimeline(descricao);
        this.carregarUsuarios();
      },
      (error) => console.error('Erro ao excluir usuário:', error)
    );
  }

  // Salva a alteração na linha do tempo
  salvarAlteracaoNaTimeline(descricao: string): void {
    const date = format(new Date(), 'dd-MM-yyyy HH:mm');
    const newItem = {
      date: date,
      description: descricao,
    };

    this.timelineService.createTimeline(newItem).subscribe(
      (response) => {
        console.log('Alteração salva na linha do tempo:', response);
      },
      (error) =>
        console.error('Erro ao salvar alteração na linha do tempo:', error)
    );
  }
}
