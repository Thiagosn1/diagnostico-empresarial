import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, state, style, animate, transition} from '@angular/animations';
import {HttpClient} from "@angular/common/http";
import { Observable } from 'rxjs';

interface Question {
    id: number;
    description: string;
    position: number;
}

interface Category {
    id: number;
    name: string;
    position: number;
    questions: Question[];
}

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
    trigger('slideLeftRight', [
      state('left', style({ transform: 'translateX(-100%)' })),
      state('right', style({ transform: 'translateX(100%)' })),
      state('center', style({ transform: 'translateX(0)' })),
      state('center-delayed', style({ transform: 'translateX(0)' })),
      transition('* => center', [animate('800ms ease-out')]),
      transition('* => center-delayed', [animate('800ms ease-out')]),
      transition('center => *', [animate('800ms ease-in')]),
    ]),
  ],
})
export class FormComponent {
    answers = Array.from({ length: 11 }, (_, i) => i);
    currentCategory = '';
    transitioning = false;
    showQuestion = true;
    questionsByCategory: any[] = [];

    currentQuestionIndex = 0;
    categories: string[] = [];

    // Inicializa um array para armazenar o status de conclusão de cada categoria
    completedCategories: boolean[] = new Array(this.categories.length).fill(
        false
    );
    currentCategoryIndex = 0;

    constructor(
        private router: Router,
        private snackBar: MatSnackBar,
        private http: HttpClient
    ) {
        this.getData().subscribe((data) => {
            this.categories = data.map((item) => item.name);
            this.questionsByCategory = data.map((item: Category) => ({
                category: item.name,
                questions: item.questions.map((question: Question) => ({
                    id: question.id,
                    text: question.description,
                    position: question.position,
                })),
            }));
            this.updateCategory();
        });
    }

    getData(): Observable<Category[]> {
        return this.http.get<Category[]>('./assets/data/teste.json');
    }


  // Retorna a pergunta atual com base no índice da pergunta atual
  get currentQuestion() {
    const currentCategoryQuestions =
      this.questionsByCategory[this.currentCategoryIndex].questions;
    return currentCategoryQuestions[this.currentQuestionIndex].text;
  }

  // Retorna a cor do gradiente com base no índice fornecido
  getGradientColor(index: number) {
    return `hsl(${(120 * index) / 10}, 100%, 50%)`;
  }

  // Esta função é chamada quando o usuário selecionar uma resposta
  selectAnswer(index: number) {
    console.log('Resposta selecionada:', index);
    this.transitionToNextQuestion();
  }

  async transitionToNextQuestion() {
    this.transitioning = true;
    this.showQuestion = false;
    await new Promise((resolve) => setTimeout(resolve, 300));
    this.nextQuestion();
    this.showQuestion = true;
    this.transitioning = false;
  }

  async showSuccessMessageAndNavigate() {
    this.snackBar.open('Concluído com sucesso', '', {
      duration: 3000, // Duração do snack bar (em milissegundos)
      panelClass: ['success-snackbar'], // Classe CSS para estilizar o snack bar
    });

    await new Promise((resolve) => setTimeout(resolve, 3000)); // Aguarde a duração do snack bar
    this.router.navigate(['/dashboard']); // Navegue para o dashboard
  }

  // Avança para a próxima pergunta
  nextQuestion() {
    const currentCategoryQuestions =
      this.questionsByCategory[this.currentCategoryIndex].questions;

    if (this.currentQuestionIndex < currentCategoryQuestions.length -1) {
      this.currentQuestionIndex++;
      this.updateCategory();
    } else {
      // Marca a categoria atual como concluída antes de atualizar a categoria
      this.completedCategories[this.currentCategoryIndex] = true;

      // Verifica se todas as categorias foram concluídas
      if (this.completedCategories.every((category) => category === true)) {
        this.showSuccessMessageAndNavigate(); // Exibe a mensagem de sucesso e navega para o dashboard
      } else {
        this.currentQuestionIndex = -1; // Reseta o índice da pergunta atual para -1 para que ele seja incrementado para zero na próxima chamada de nextQuestion()
        this.updateCategory();
        this.nextQuestion();
      }
    }
  }

  // Atualiza a categoria atual com base no índice da pergunta atual
  updateCategory() {
    const currentCategoryQuestions =
      this.questionsByCategory[this.currentCategoryIndex].questions;

    if (this.currentQuestionIndex === currentCategoryQuestions.length -1) {
      const newIndex =
        (this.currentCategoryIndex +1) % this.categories.length;

      // Verifica se a categoria mudou, e se sim, marca a categoria anterior como concluída
      if (newIndex !== this.currentCategoryIndex) {
        this.completedCategories[this.currentCategoryIndex] = true;
        this.currentCategoryIndex = newIndex;
      }
    }

    const newCurrentCategoryQuestions =
      this.questionsByCategory[this.currentCategoryIndex].questions;

    if (this.currentQuestionIndex === -1 && newCurrentCategoryQuestions.length ===0){
      const newIndex =
        (this.currentCategoryIndex +1) % this.categories.length;
      this.currentCategoryIndex = newIndex;
      this.updateCategory();
    }
  }

  // Calcula a porcentagem de progresso com base no índice da pergunta atual e no tamanho total das perguntas
  get progressPercentage() {
    const totalQuestions = this.questionsByCategory.reduce(
      (acc, curr) => acc + curr.questions.length,
      0
    );
    const completedQuestions = this.questionsByCategory.reduce(
      (acc, curr, index) =>
        index < this.currentCategoryIndex
          ? acc + curr.questions.length
          : acc,
      0
    );
    return Math.round(
      ((completedQuestions + this.currentQuestionIndex + 1) / totalQuestions) *
      100
    );
  }
}
