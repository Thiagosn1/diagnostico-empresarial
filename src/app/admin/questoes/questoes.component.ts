import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { format } from 'date-fns';
import { Category, Question } from 'src/app/models/form.model';
import { FormService } from 'src/app/services/form.service';
import { TimelineService } from 'src/app/services/timeline.service';

@Component({
  selector: 'app-questoes',
  templateUrl: './questoes.component.html',
  styleUrls: ['./questoes.component.css'],
})
export class QuestoesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'questao', 'categoria', 'acao'];
  dataSource = new MatTableDataSource<Question>();
  categories: Category[] = [];
  nomeCategoria: string = '';
  editingQuestionId: number | null = null;

  constructor(
    private formService: FormService,
    private timelineService: TimelineService
  ) {}

  ngOnInit(): void {
    this.carregarDados();
    this.carregarCategorias();
  }

  // Método para carregar os dados
  carregarDados(): void {
    this.formService.getData().subscribe(
      (categories) => {
        let questions: Question[] = [];
        categories.forEach((category) => questions.push(...category.questions));
        this.dataSource.data = questions;
      },
      (error) => {
        console.error('Erro ao carregar dados:', error);
      }
    );
  }

  // Método para carregar as categorias
  carregarCategorias(): void {
    this.formService.getData().subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Erro ao carregar categorias:', error);
      }
    );
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(
      (category) => category.id === categoryId
    );
    return category ? category.name : '';
  }

  startEditing(question: Question): void {
    this.editingQuestionId = question.id;
  }

  // Método para parar a edição
  stopEditing(question: Question): void {
    this.editingQuestionId = null;
    this.formService.atualizarQuestao(question.categoryId, question).subscribe(
      () => {
        console.log('Questão atualizada com sucesso');
        this.salvarAlteracaoNaTimeline(
          `Questão ${
            question.id
          } atualizada na categoria ${this.getCategoryName(
            question.categoryId
          )}`
        );
      },
      (error: any) => console.error('Erro ao atualizar questão:', error)
    );
  }

  // Método para excluir uma questão
  excluirQuestao(categoryId: number, questionId: number): void {
    this.formService.excluirQuestao(categoryId, questionId).subscribe(
      () => {
        console.log('Questão excluída com sucesso');
        this.salvarAlteracaoNaTimeline(
          `Questão ${questionId} excluída na categoria ${this.getCategoryName(
            categoryId
          )}`
        );
      },
      (error) => {
        console.error('Erro ao excluir questão:', error);
      }
    );
  }

  // Método para salvar a alteração na linha do tempo
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
