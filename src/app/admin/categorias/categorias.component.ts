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
  colunasExibidas: string[] = ['posicao', 'categoria', 'acao'];
  dataSource = new MatTableDataSource<Category>();
  editandoCategoriaId: number | null = null;
  nomeNovaCategoria: string = '';
  categories: Category[] = [];
  novaPosicao!: number;
  erro: string = '';

  constructor(
    private formService: FormService,
    private timelineService: TimelineService
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  carregarDados(): void {
    this.formService.getData().subscribe({
      next: (categories) => {
        this.dataSource.data = categories.sort(
          (a, b) => a.position - b.position
        );
      },
      error: (error) => {
        console.error('Erro ao carregar dados:', error);
      },
    });
  }

  carregarCategorias(): void {
    this.formService.getData().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
      },
    });
  }

  alternarEdicao(category: Category): void {
    if (this.editandoCategoriaId === category.id) {
      this.pararEdicao(category);
      this.editandoCategoriaId = null;
    } else {
      this.editandoCategoriaId = category.id;
    }
  }

  pararEdicao(category: Category): void {
    this.editandoCategoriaId = null;
    this.formService.atualizarCategoria(category).subscribe({
      next: () => {
        this.salvarAlteracaoNaLinhaDoTempo(
          `Categoria ${category.name} atualizada`
        );
      },
      error: (error: any) =>
        console.error('Erro ao atualizar categoria:', error),
    });
  }

  adicionarCategoria(): void {
    if (!this.nomeNovaCategoria.trim()) {
      this.erro = 'O nome da categoria não pode estar vazio.';
      setTimeout(() => (this.erro = ''), 2000);
      return;
    }

    this.formService.adicionarCategoria(this.nomeNovaCategoria).subscribe({
      next: () => {
        this.salvarAlteracaoNaLinhaDoTempo(
          `Categoria ${this.nomeNovaCategoria} adicionada`
        );
        this.nomeNovaCategoria = '';
        this.carregarDados();
      },
      error: (error) => {
        console.error('Erro ao adicionar categoria:', error);
        this.erro = 'Erro ao adicionar categoria.';
        setTimeout(() => (this.erro = ''), 2000);
      },
    });
  }

  obterNomeCategoria(categoryId: number): string {
    const category = this.categories.find(
      (category) => category.id === categoryId
    );
    return category ? category.name : '';
  }

  excluirCategoria(categoryId: number): void {
    this.formService.getCategoria(categoryId).subscribe({
      next: (category) => {
        this.formService.excluirCategoria(categoryId).subscribe({
          next: () => {
            this.carregarDados();
            this.salvarAlteracaoNaLinhaDoTempo(
              `Categoria ${category.name} excluída`
            );
          },
          error: (error) => {
            console.error('Erro ao excluir categoria:', error);
          },
        });
      },
      error: (error) => {
        console.error('Erro ao obter categoria:', error);
      },
    });
  }

  salvarAlteracaoNaLinhaDoTempo(descricao: string): void {
    const date = format(new Date(), 'dd-MM-yyyy HH:mm');
    const newItem = {
      date: date,
      description: descricao,
    };

    this.timelineService.createTimeline(newItem).subscribe({
      next: (response) => {
        console.log('Alteração salva na linha do tempo:', response);
      },
      error: (error) =>
        console.error('Erro ao salvar alteração na linha do tempo:', error),
    });
  }
}