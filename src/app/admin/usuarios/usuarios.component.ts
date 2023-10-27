import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {
  displayedColumns: string[] = ['email', 'tipo', 'acao'];
  dataSource = new MatTableDataSource();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.userService.obterUsuarios().subscribe(
      (data) => {
        this.dataSource.data = data;
        this.dataSource._updateChangeSubscription();
      },
      (error) => {
        console.error('Erro ao carregar usuários:', error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  tornarAdmin(usuario: any): void {
    this.userService.tornarAdmin(usuario.id).subscribe(
      () => this.carregarUsuarios(),
      (error) => console.error('Erro ao tornar usuário admin:', error)
    );
  }

  removerAdmin(usuario: any): void {
    this.userService.removerAdmin(usuario.id).subscribe(
      () => this.carregarUsuarios(),
      (error) => console.error('Erro ao remover admin:', error)
    );
  }

  excluirUsuario(usuario: any): void {
    this.userService.excluirUsuario(usuario.id).subscribe(
      () => this.carregarUsuarios(),
      (error) => console.error('Erro ao excluir usuário:', error)
    );
  }
}
