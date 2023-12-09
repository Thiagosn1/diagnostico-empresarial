import {
  AfterViewInit,
  Component,
  OnInit,
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
export class FormComponent implements AfterViewInit, OnInit {
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

  ngOnInit() {
    this.answerService.buscarRespostas().subscribe(
      (respostas) => {
        // Aqui você tem as respostas do usuário
        // Você pode usar essas respostas para determinar a próxima pergunta
        const ultimaResposta = respostas[respostas.length - 1];
        const proximaQuestaoId = ultimaResposta.questionId + 1;

        // Atualize o número de perguntas respondidas
        this.currentNQuestions = respostas.length;

        // Verifique se todas as perguntas foram respondidas
        if (this.currentNQuestions === this.totalNQuestions) {
          // Se todas as perguntas foram respondidas, navegue para /relatorio
          this.router.navigate(['/relatorio']);
          return;
        }

        // Marque as categorias concluídas
        for (let i = 0; i < this.categories.length; i++) {
          for (let j = 0; j < this.categories[i].questions.length; j++) {
            if (this.categories[i].questions[j].id === proximaQuestaoId) {
              this.currentCategoryIndex = i;
              this.currentQuestionIndex = j;
              // Marque todas as categorias anteriores como concluídas
              for (let k = 0; k < i; k++) {
                this.completedCategories[k] = true;
              }
              return;
            }
          }
        }
      },
      (error) => {
        console.error('Erro ao buscar as respostas:', error);
      }
    );
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

    // Verifique se a pergunta atual é positiva ou negativa
    //const isPositive = this.isCurrentQuestionPositive();

    // Inverta o valor da resposta se a pergunta for negativa
    //const recordedAnswer = isPositive ? index : 10 - index;
    const recordedAnswer = index;
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
    this.snackBar.open('Concluído com sucesso', '', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
    await new Promise((resolve) => setTimeout(resolve, 3000));
    this.router.navigate(['/relatorio']);
  }
}
