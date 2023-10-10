import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Category } from 'src/app/models/form.model';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css'],
})
export class CategoriasComponent implements OnInit {
  displayedColumns: string[] = ['id', 'categoria', 'acao'];
  dataSource = new MatTableDataSource<Category>();
  editingCategoryId: number | null = null;

  constructor(private formService: FormService) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  // Método para aplicar o filtro na tabela conforme o usuário digita
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Método para carregar os dados das categorias do serviço
  carregarDados(): void {
    this.formService.getData().subscribe(
      (categories) => {
        this.dataSource.data = categories;
      },
      (error) => {
        console.error('Erro ao carregar dados:', error);
      }
    );
  }

  // Método para alternar entre o modo de edição e visualização ao clicar nos botões Renomear/Confirmar
  toggleEditing(category: Category): void {
    if (this.editingCategoryId === category.id) {
      this.stopEditing(category);
      this.editingCategoryId = null;
    } else {
      this.editingCategoryId = category.id;
    }
  }

  // Método para parar a edição e atualizar a categoria
  stopEditing(category: Category): void {
    this.editingCategoryId = null;
    this.formService.atualizarCategoria(category).subscribe(
      () => console.log('Categoria atualizada com sucesso'),
      (error: any) => console.error('Erro ao atualizar categoria:', error)
    );
  }

  // Método para excluir uma categoria
  excluirCategoria(categoryId: number): void {
    this.formService.excluirCategoria(categoryId).subscribe(
      (response) => {
        console.log('Categoria excluída com sucesso', response);
      },
      (error) => {
        console.error('Erro ao excluir categoria:', error);
      }
    );
  }
}
