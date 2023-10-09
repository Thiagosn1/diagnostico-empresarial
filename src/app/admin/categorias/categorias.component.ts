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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

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

  startEditing(category: Category): void {
    this.editingCategoryId = category.id;
  }

  stopEditing(category: Category): void {
    this.editingCategoryId = null;
    this.formService.atualizarCategoria(category).subscribe(
      () => console.log('Categoria atualizada com sucesso'),
      (error: any) => console.error('Erro ao atualizar categoria:', error)
    );
  }

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
