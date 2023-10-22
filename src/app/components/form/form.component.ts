import {
  AfterViewInit,
  Component,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { FormResponseService } from 'src/app/services/form.response.service';
import { FormService } from 'src/app/services/form.service';
import { Category } from 'src/app/models/form.model';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [style({ opacity: 0 }), animate(300)]),
      transition(':leave', [animate(300, style({ opacity: 0 }))]),
    ]),
    trigger('slideRightLeft', [
      state('left', style({ transform: 'translateX(-100%)' })),
      state('right', style({ transform: 'translateX(100%)' })),
      state('center', style({ transform: 'translateX(0)' })),
      state('center-delayed', style({ transform: 'translateX(0)' })),
      transition('* => center', [animate('900ms ease-out')]),
      transition('* => center-delayed', [animate('900ms ease-out')]),
      transition('center => *', [animate('900ms ease-in')]),
    ]),
  ],
})
export class FormComponent implements AfterViewInit {
  @ViewChildren(MatTooltip) tooltips!: QueryList<MatTooltip>;

  categories: Category[] = [];
  responses: any = {};

  answers = Array.from({ length: 10 }, (_, i) => i + 1);
  transitioning = false;
  showQuestion = true;
  currentQuestionIndex = 0;
  currentCategoryIndex = 0;
  totalNQuestions = 0;
  currentNQuestions = 0;
  completedCategories: boolean[] = new Array(this.categories.length).fill(
    false
  );

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private formService: FormService,
    private formResponseService: FormResponseService
  ) {
    // Carrega as categorias e questões
    this.formService.getData().subscribe((data) => {
      data.sort((a: any, b: any) => a.position - b.position);
      data.forEach((c: any) => {
        this.totalNQuestions += c.questions.length;
        c.questions.sort((a: any, b: any) => a.position - b.position);
      });
      this.categories = data;
    });
  }

  ngAfterViewInit() {
    this.showTooltips();
  }

  // Retorna a pergunta atual com base no índice da pergunta atual
  get currentQuestion() {
    return this.categories[this.currentCategoryIndex].questions[
      this.currentQuestionIndex
    ].description;
  }

  // Retorna a categoria atual com base no índice da categoria atual
  get currentCategory() {
    return this.categories[this.currentCategoryIndex].name;
  }

  // Calcula a porcentagem de progresso com base no número de perguntas respondidas e no total de perguntas
  get progressPercentage() {
    const totalQuestions = this.totalNQuestions;
    const completedQuestions = this.currentNQuestions;
    return Math.round((completedQuestions / totalQuestions) * 100);
  }

  // Determina se a questão atual é positiva
  isCurrentQuestionPositive(): boolean {
    return this.categories[this.currentCategoryIndex].questions[
      this.currentQuestionIndex
    ].positive;
  }

  // Retorna o valor a ser exibido no botão
  getDisplayValue(index: number): number {
    return this.isCurrentQuestionPositive() ? index + 1 : 10 - index;
  }

  // Exibe todos os tooltips
  showTooltips() {
    this.tooltips.forEach((tooltip) => {
      tooltip.show();
    });
  }

  // Retorna o texto do tooltip com base no índice do botão
  getTooltipText(index: number): string {
    if (index === 0) {
      return 'Discordo totalmente';
    } else if (index === 9) {
      return 'Concordo totalmente';
    } else {
      return '';
    }
  }

  // Retorna a cor do gradiente com base no índice fornecido
  gradientColor(index: number): string {
    const positive = this.isCurrentQuestionPositive();
    const adjustedIndex = positive ? index + 0 : 9 - index;
    return `hsl(${(120 * adjustedIndex) / 9}, 100%, 50%)`;
  }

  // Esta função é chamada quando o usuário selecionar uma resposta
  selectAnswer(index: number): void {
    const positive = this.isCurrentQuestionPositive();
    const recordedAnswer = positive ? index + 1 : 10 - index;
    console.log('Resposta selecionada:', recordedAnswer);
    const currentCategory = this.categories[this.currentCategoryIndex].name;
    if (!this.responses[currentCategory]) {
      this.responses[currentCategory] = [];
    }
    this.responses[currentCategory].push(recordedAnswer);
    this.transitionToNextQuestion();
    this.currentNQuestions++;
  }

  // Avança para a próxima pergunta
  nextQuestion() {
    // Verifica se há mais perguntas na categoria atual ou avança para a próxima categoria
    if (
      this.categories[this.currentCategoryIndex].questions.length - 1 >
        this.currentQuestionIndex &&
      this.categories.length - 1 >= this.currentCategoryIndex
    ) {
      this.currentQuestionIndex++;
    } else {
      // Marca a categoria atual como concluída antes de avançar para a próxima
      this.completedCategories[this.currentCategoryIndex] = true;
      this.currentCategoryIndex++;
      this.currentQuestionIndex = 0;
      if (this.categories.length == this.currentCategoryIndex) {
        // Marca a categoria atual como concluída antes de avançar para a próxima
        this.completedCategories[this.currentCategoryIndex - 1] = true;
        this.showSuccessMessageAndNavigate(); // Exibe a mensagem de sucesso e navega para o dashboard
      }
    }
  }

  // Função para fazer a transição para a próxima pergunta
  async transitionToNextQuestion() {
    this.transitioning = true;
    this.showQuestion = false;
    await new Promise((resolve) => setTimeout(resolve, 300));
    this.nextQuestion();
    this.showQuestion = true;
    this.transitioning = false;
    this.showTooltips();
  }

  // Função para exibir uma mensagem de sucesso e navegar para outra rota
  async showSuccessMessageAndNavigate() {
    this.formResponseService.changeResponse(this.responses);
    this.snackBar.open('Concluído com sucesso', '', {
      duration: 3000, // Duração do snack bar (em milissegundos)
      panelClass: ['success-snackbar'], // Classe CSS para estilizar o snack bar
    });

    await new Promise((resolve) => setTimeout(resolve, 3000)); // Aguarde a duração do snack bar
    this.router.navigate(['/relatorio']);
  }
}
