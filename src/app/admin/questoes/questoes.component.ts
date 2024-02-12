import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  colunasExibidas: string[] = ['questao', 'categoria', 'status', 'acao'];
  dataSource = new MatTableDataSource<Question>();
  categories: Category[] = [];
  editingQuestionId: number | null = null;
  mostrarFormulario = false;
  formQuestao!: FormGroup;

  constructor(
    private formService: FormService,
    private formBuilder: FormBuilder,
    private timelineService: TimelineService
  ) {}

  ngOnInit(): void {
    this.carregarDados();
    this.carregarCategorias();
    this.formQuestao = this.formBuilder.group({
      description: ['', Validators.required],
      positive: ['', Validators.required],
      categoryId: ['', Validators.required],
    });
  }

  carregarDados(): void {
    this.formService.getData().subscribe({
      next: (categories) => {
        let questions: { question: Question; categoryPosition: number }[] = [];
        categories.forEach((category) => {
          category.questions.forEach((question) => {
            questions.push({
              question: question,
              categoryPosition: category.position,
            });
          });
        });
        questions.sort((a, b) => {
          if (a.categoryPosition === b.categoryPosition) {
            return a.question.position - b.question.position;
          } else {
            return a.categoryPosition - b.categoryPosition;
          }
        });
        this.dataSource.data = questions.map((q) => q.question);
      },
      error: (error) => {
        console.error('Erro ao carregar dados:', error);
      },
    });
  }

  carregarCategorias(): void {
    this.formService.getData().subscribe({
      next: (categories) => {
        this.categories = categories.sort((a, b) => a.position - b.position);
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
      },
    });
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  obterNomeCategoria(categoryId: number): string {
    const category = this.categories.find(
      (category) => category.id === categoryId
    );
    return category ? category.name : '';
  }

  iniciarEdicao(question: Question): void {
    this.editingQuestionId = question.id;
  }

  pararEdicao(question: Question): void {
    this.editingQuestionId = null;
    this.formService.atualizarQuestao(question).subscribe({
      next: () => {
        this.salvarAlteracaoNaTimeline(
          `Questão ${
            question.id
          } atualizada na categoria ${this.obterNomeCategoria(
            question.categoryId
          )}`
        );
      },
      error: (error: any) => console.error('Erro ao atualizar questão:', error),
    });
  }

  adicionarQuestao(): void {
    if (this.formQuestao.valid) {
      const questao = this.formQuestao.value;
      this.formService.adicionarQuestao(questao).subscribe({
        next: () => {
          this.mostrarFormulario = false;
          this.carregarDados();
          this.formQuestao.reset();
        },
        error: (error) => {
          console.error('Erro ao adicionar questão:', error);
        },
      });
    }
  }

  excluirQuestao(questionId: number): void {
    this.formService.excluirQuestao(questionId).subscribe({
      next: () => {
        this.salvarAlteracaoNaTimeline(`Questão ${questionId} excluída`);
        this.carregarDados();
      },
      error: (error) => {
        console.error('Erro ao excluir questão:', error);
      },
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
