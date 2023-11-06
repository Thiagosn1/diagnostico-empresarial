import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { format } from 'date-fns';
import { Category } from 'src/app/models/form.model';
import { FormService } from 'src/app/services/form.service';
import { TimelineService } from 'src/app/services/timeline.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css'],
})
export class CategoriasComponent implements OnInit {
  displayedColumns: string[] = ['id', 'categoria', 'acao'];
  dataSource = new MatTableDataSource<Category>();
  editingCategoryId: number | null = null;

  constructor(
    private formService: FormService,
    private timelineService: TimelineService
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  // Método para aplicar o filtro na tabela conforme o usuário digita
  aplicarFiltro(event: Event) {
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
  alternarEdicao(category: Category): void {
    if (this.editingCategoryId === category.id) {
      this.pararEdicao(category);
      this.editingCategoryId = null;
    } else {
      this.editingCategoryId = category.id;
    }
  }

  // Método para parar a edição e atualizar a categoria
  pararEdicao(category: Category): void {
    this.editingCategoryId = null;
    this.formService.atualizarCategoria(category).subscribe(
      () => {
        console.log('Categoria atualizada com sucesso');
        this.salvarAlteracaoNaLinhaDoTempo(
          `Categoria ${category.name} atualizada`
        );
      },
      (error: any) => console.error('Erro ao atualizar categoria:', error)
    );
  }

  // Método para excluir uma categoria
  excluirCategoria(categoryId: number): void {
    this.formService.excluirCategoria(categoryId).subscribe(
      () => {
        console.log('Categoria excluída com sucesso');
        this.salvarAlteracaoNaLinhaDoTempo(`Categoria ${categoryId} excluída`);
      },
      (error) => {
        console.error('Erro ao excluir categoria:', error);
      }
    );
  }

  // Método para salvar a alteração na linha do tempo
  salvarAlteracaoNaLinhaDoTempo(descricao: string): void {
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
