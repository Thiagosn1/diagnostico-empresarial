import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Category, Question } from 'src/app/models/form.model';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-questoes',
  templateUrl: './questoes.component.html',
  styleUrls: ['./questoes.component.css'],
})
export class QuestoesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'questao', 'categoria', 'acao'];
  dataSource = new MatTableDataSource<Question>();
  categories: Category[] = []; // Adicione esta linha
  nomeCategoria: string = '';
  editingQuestionId: number | null = null; // ID da questão sendo editada

  constructor(private formService: FormService) {}

  ngOnInit(): void {
    this.carregarDados();
    this.carregarCategorias(); // Adicione esta linha
  }

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

  carregarCategorias(): void {
    // Adicione este método
    this.formService.getData().subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Erro ao carregar categorias:', error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getCategoryName(categoryId: number): string {
    // Adicione este método
    const category = this.categories.find(
      (category) => category.id === categoryId
    );
    return category ? category.name : '';
  }

  // Métodos de Ação
  startEditing(question: Question): void {
    this.editingQuestionId = question.id;
  }

  stopEditing(question: Question): void {
    this.editingQuestionId = null;
    this.formService.atualizarQuestao(question.categoryId, question).subscribe(
      () => console.log('Questão atualizada com sucesso'),
      (error: any) => console.error('Erro ao atualizar questão:', error)
    );
  }

  excluirQuestao(categoryId: number, questionId: number): void {
    this.formService.excluirQuestao(categoryId, questionId).subscribe(
      (response) => {
        console.log('Questão excluída com sucesso', response);
      },
      (error) => {
        console.error('Erro ao excluir questão:', error);
      }
    );
  }
}
