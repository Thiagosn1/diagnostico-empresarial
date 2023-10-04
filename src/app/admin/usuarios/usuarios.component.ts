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
  dataSource = new MatTableDataSource(); // Atualizado para MatTableDataSource

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.userService.obterUsuarios().subscribe(
      (data) => {
        console.log('Dados recebidos:', data);
        this.dataSource.data = data; // Atualizado para usar os dados diretamente
        this.dataSource._updateChangeSubscription(); // Força a atualização da tabela
      },
      (error) => {
        console.error('Erro ao carregar usuários:', error);
      }
    );
  }

  promoverAdmin(usuario: any): void {
  
  }
}
