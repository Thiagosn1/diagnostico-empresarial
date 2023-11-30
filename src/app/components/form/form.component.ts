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
import { AnswerService } from 'src/app/services/answers.service';

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

  answers = Array.from({ length: 11 }, (_, i) => i + 1);
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
    private answerService: AnswerService,
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

      // Verifique se os índices da pergunta e da categoria, o número atual de perguntas respondidas e as categorias concluídas estão no armazenamento local
      const savedCategoryIndex = localStorage.getItem('currentCategoryIndex');
      const savedQuestionIndex = localStorage.getItem('currentQuestionIndex');
      const savedNQuestions = localStorage.getItem('currentNQuestions');
      const savedCompletedCategories = localStorage.getItem(
        'completedCategories'
      );

      if (
        savedCategoryIndex !== null &&
        savedQuestionIndex !== null &&
        savedNQuestions !== null &&
        savedCompletedCategories !== null
      ) {
        this.currentCategoryIndex = Number(savedCategoryIndex);
        this.currentQuestionIndex = Number(savedQuestionIndex);
        this.currentNQuestions = Number(savedNQuestions);
        this.completedCategories = JSON.parse(savedCompletedCategories);
      }
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
    return index;
  }

  /* getDisplayValue(index: number): number {
    return this.isCurrentQuestionPositive() ? index + 1 : 10 - index;
  } */

  // Exibe todos os tooltips
  showTooltips() {
    this.tooltips.forEach((tooltip) => {
      tooltip.show();
    });
  }

  // Retorna o texto do tooltip com base no índice do botão
  getTooltipText(index: number): string {
    if (this.isCurrentQuestionPositive()) {
      if (index === 0) {
        return 'Discordo totalmente';
      } else if (index === 10) {
        return 'Concordo totalmente';
      } else {
        return '';
      }
    } else {
      if (index === 0) {
        return 'Concordo totalmente';
      } else if (index === 10) {
        return 'Discordo totalmente';
      } else {
        return '';
      }
    }
  }

  /* getTooltipText(index: number): string {
    if (index === 0) {
      return 'Discordo totalmente';
    } else if (index === 9) {
      return 'Concordo totalmente';
    } else {
      return '';
    }
  } */

  // Retorna a cor do gradiente com base no índice fornecido
  gradientColor(index: number): string {
    return `hsl(${(120 * index) / 10}, 100%, 50%)`;
  }

  /* gradientColor(index: number): string {
    const positive = this.isCurrentQuestionPositive();
    const adjustedIndex = positive ? index + 0 : 9 - index;
    return `hsl(${(120 * adjustedIndex) / 9}, 100%, 50%)`;
  } */

  // Esta função é chamada quando o usuário selecionar uma resposta
  selectAnswer(index: number): void {
    // Obtenha a categoria e a pergunta atual
    const currentCategory = this.categories[this.currentCategoryIndex];
    const currentQuestion =
      currentCategory.questions[this.currentQuestionIndex];

    // Calcule a resposta com base no índice selecionado e na positividade da pergunta

    // const positive = this.isCurrentQuestionPositive();
    const recordedAnswer = index;
    // const recordedAnswer = positive ? index + 1 : 10 - index;

    console.log('Resposta selecionada:', recordedAnswer);

    // Adicione a resposta ao objeto de respostas
    if (!this.responses[currentCategory.name]) {
      this.responses[currentCategory.name] = [];
    }

    // Verifique se a pergunta atual já foi respondida
    if (
      this.responses[currentCategory.name].length > this.currentQuestionIndex
    ) {
      console.log('A pergunta atual já foi respondida.');
      return;
    }

    this.responses[currentCategory.name].push(recordedAnswer);

    // Salve os índices da pergunta e da categoria, o número atual de perguntas respondidas e as categorias concluídas no armazenamento local
    localStorage.setItem(
      'currentCategoryIndex',
      String(this.currentCategoryIndex)
    );
    localStorage.setItem(
      'currentQuestionIndex',
      String(this.currentQuestionIndex)
    );
    localStorage.setItem('currentNQuestions', String(this.currentNQuestions));
    localStorage.setItem(
      'completedCategories',
      JSON.stringify(this.completedCategories)
    );

    // Salve a resposta na API
    const answer = {
      questionId: currentQuestion.id,
      value: recordedAnswer,
    };

    this.answerService.salvarResposta(answer).subscribe(
      (response) => {
        console.log('Resposta salva com sucesso:', response);
        this.transitionToNextQuestion();
        this.currentNQuestions++;
      },
      (error) => {
        console.error('Erro ao salvar a resposta:', error);
      }
    );
  }

  // Avança para a próxima pergunta
  nextQuestion() {
    const currentCategory = this.categories[this.currentCategoryIndex];

    // Se ainda há perguntas na categoria atual, vá para a próxima pergunta
    if (this.currentQuestionIndex < currentCategory.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      // Caso contrário, marque a categoria atual como concluída
      this.completedCategories[this.currentCategoryIndex] = true;

      // E avance para a próxima categoria
      this.currentCategoryIndex++;
      this.currentQuestionIndex = 0;

      // Se todas as categorias foram concluídas, exiba a mensagem de sucesso e navegue para o dashboard
      if (this.currentCategoryIndex == this.categories.length) {
        this.showSuccessMessageAndNavigate();
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
