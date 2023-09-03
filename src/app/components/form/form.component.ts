import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, state, style, animate, transition} from '@angular/animations';
import {HttpClient} from "@angular/common/http";

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
  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) {
    this.getQuestions();
    this.getCategories();
    this.updateCategory();
  }

  questions: any[] = [];
  categories: any[] = [];

  // Obtém as perguntas do arquivo JSON usando o serviço HttpClient
  getQuestions() {
    this.http.get('./assets/data/questions.json').subscribe((data: any) => {
      this.questions = data;
    });
  }

  // Obtém as categorias do arquivo JSON usando o serviço HttpClient
  getCategories() {
    this.http.get('./assets/data/categories.json').subscribe((data: any) => {
      this.categories = data;
    });
  }

  currentQuestionIndex = 0;
  currentCategoryIndex = 0;

  // Atualiza a categoria atual com base no índice da pergunta atual
  updateCategory() {
    if (this.currentQuestionIndex >= this.questions.length) {
      return;
    }
    console.log('Objeto atual:', this.questions[this.currentQuestionIndex]);
    const newIndex = this.categories.indexOf(
      this.questions[this.currentQuestionIndex].category
    );

    // Verifica se a categoria mudou, e se sim, marca a categoria anterior como concluída
    if (newIndex !== this.currentCategoryIndex) {
      this.completedCategories[this.currentCategoryIndex] = true;
      this.currentCategoryIndex = newIndex;
    }
  }

  // Inicializa um array para armazenar o status de conclusão de cada categoria
  completedCategories: boolean[] = new Array(this.categories.length).fill(
    false
  );

  // Retorna a pergunta atual com base no índice da pergunta atual
  get currentQuestion() {
    return this.questions[this.currentQuestionIndex].text;
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

  transitioning = false;
  showQuestion = true;

  // Transição para a próxima pergunta, ocultando e mostrando a pergunta com um atraso
  async transitionToNextQuestion() {
    this.transitioning = true;
    this.showQuestion = false;
    await new Promise((resolve) => setTimeout(resolve, 300));
    this.nextQuestion();
    this.showQuestion = true;
    this.transitioning = false;
  }

  // Exibe uma mensagem de sucesso usando o serviço MatSnackBar e navega para o dashboard usando o serviço Router
  async showSuccessMessageAndNavigate() {
    this.snackBar.open('Concluído com sucesso', '', {
      duration: 3000, // Duração do snack bar (em milissegundos)
      panelClass: ['success-snackbar'], // Classe CSS para estilizar o snack bar
    });

    await new Promise((resolve) => setTimeout(resolve, 3000)); // Aguarde a duração do snack bar
    this.router.navigate(['/dashboard']); // Navegue para o dashboard
  }

  // Avança para a próxima pergunta ou marca a categoria atual como concluída e atualiza a categoria se todas as perguntas tiverem sido respondidas
  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.updateCategory();
    } else {
      // Marca a categoria atual como concluída antes de atualizar a categoria
      this.completedCategories[this.currentCategoryIndex] = true;

      // Verifica se todas as categorias foram concluídas
      if (this.completedCategories.every((category) => category === true)) {
        this.showSuccessMessageAndNavigate(); // Exibe a mensagem de sucesso e navega para o dashboard
      } else {
        this.updateCategory();
      }
    }
  }



  // Calcula a porcentagem de progresso com base no índice da pergunta atual e no tamanho total das perguntas
  get progressPercentage() {
    return Math.round(
      (this.currentQuestionIndex / this.questions.length) * 100
    );
  }
}
