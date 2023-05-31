import { Component } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate(300),
      ]),
      transition(':leave', [
        animate(300, style({ opacity: 0 })),
      ]),
    ]),
    trigger('slideLeftRight', [
      state('left', style({ transform: 'translateX(-100%)' })),
      state('right', style({ transform: 'translateX(100%)' })),
      state('center', style({ transform: 'translateX(0)' })),
      state('center-delayed', style({ transform: 'translateX(0)' })),
      transition('* => center', [
        animate('800ms ease-out'),
      ]),
      transition('* => center-delayed', [
        animate('800ms ease-out'),
      ]),
      transition('center => *', [
        animate('800ms ease-in'),
      ]),
    ]),
  ],
})
export class FormComponent {
  answers = Array.from({ length: 11 }, (_, i) => i);
  currentCategory = '';
  transitioning = false;
  showQuestion = true;

  // Perguntas e suas categorias
  questions = [
    { text: 'Pergunta 1', category: 'Administrativo' },
    { text: 'Pergunta 2', category: 'Administrativo' },
    { text: 'Pergunta 3', category: 'Administrativo' },
    { text: 'Pergunta 4', category: 'Administrativo' },
    { text: 'Pergunta 5', category: 'Administrativo' },
    { text: 'Pergunta 6', category: 'Administrativo' },
    { text: 'Pergunta 7', category: 'Administrativo' },
    { text: 'Pergunta 8', category: 'Administrativo' },
    { text: 'Pergunta 9', category: 'Administrativo' },
    { text: 'Pergunta 10', category: 'Administrativo' },
    { text: 'Pergunta 11', category: 'Comercial' },
    { text: 'Pergunta 12', category: 'Comercial' },
    { text: 'Pergunta 13', category: 'Comercial' },
    { text: 'Pergunta 14', category: 'Comercial' },
    { text: 'Pergunta 15', category: 'Comercial' },
    { text: 'Pergunta 16', category: 'Comercial' },
    { text: 'Pergunta 17', category: 'Comercial' },
    { text: 'Pergunta 18', category: 'Comercial' },
    { text: 'Pergunta 19', category: 'Comercial' },
    { text: 'Pergunta 20', category: 'Comercial' },
    { text: 'Pergunta 21', category: 'Marketing' },
    { text: 'Pergunta 22', category: 'Marketing' },
    { text: 'Pergunta 23', category: 'Marketing' },
    { text: 'Pergunta 24', category: 'Marketing' },
    { text: 'Pergunta 25', category: 'Marketing' },
    { text: 'Pergunta 26', category: 'Marketing' },
    { text: 'Pergunta 27', category: 'Marketing' },
    { text: 'Pergunta 28', category: 'Marketing' },
    { text: 'Pergunta 29', category: 'Marketing' },
    { text: 'Pergunta 30', category: 'Marketing' },
    { text: 'Pergunta 31', category: 'Financeiro' },
    { text: 'Pergunta 32', category: 'Financeiro' },
    { text: 'Pergunta 33', category: 'Financeiro' },
    { text: 'Pergunta 34', category: 'Financeiro' },
    { text: 'Pergunta 35', category: 'Financeiro' },
    { text: 'Pergunta 36', category: 'Financeiro' },
    { text: 'Pergunta 37', category: 'Financeiro' },
    { text: 'Pergunta 38', category: 'Financeiro' },
    { text: 'Pergunta 39', category: 'Financeiro' },
    { text: 'Pergunta 40', category: 'Financeiro' },
    { text: 'Pergunta 41', category: 'Compras' },
    { text: 'Pergunta 42', category: 'Compras' },
    { text: 'Pergunta 43', category: 'Compras' },
    { text: 'Pergunta 44', category: 'Compras' },
    { text: 'Pergunta 45', category: 'Compras' },
    { text: 'Pergunta 46', category: 'Compras' },
    { text: 'Pergunta 47', category: 'Compras' },
    { text: 'Pergunta 48', category: 'Compras' },
    { text: 'Pergunta 49', category: 'Compras' },
    { text: 'Pergunta 50', category: 'Compras' },
    { text: 'Pergunta 51', category: 'Recursos Humanos' },
    { text: 'Pergunta 52', category: 'Recursos Humanos' },
    { text: 'Pergunta 53', category: 'Recursos Humanos' },
    { text: 'Pergunta 54', category: 'Recursos Humanos' },
    { text: 'Pergunta 55', category: 'Recursos Humanos' },
    { text: 'Pergunta 56', category: 'Recursos Humanos' },
    { text: 'Pergunta 57', category: 'Recursos Humanos' },
    { text: 'Pergunta 58', category: 'Recursos Humanos' },
    { text: 'Pergunta 59', category: 'Recursos Humanos' },
    { text: 'Pergunta 60', category: 'Recursos Humanos' },
    { text: 'Pergunta 61', category: 'Operações' },
    { text: 'Pergunta 62', category: 'Operações' },
    { text: 'Pergunta 63', category: 'Operações' },
    { text: 'Pergunta 64', category: 'Operações' },
    { text: 'Pergunta 65', category: 'Operações' },
    { text: 'Pergunta 66', category: 'Operações' },
    { text: 'Pergunta 67', category: 'Operações' },
    { text: 'Pergunta 68', category: 'Operações' },
    { text: 'Pergunta 69', category: 'Operações' },
    { text: 'Pergunta 70', category: 'Operações' },
    { text: 'Pergunta 71', category: 'Jurídico' },
    { text: 'Pergunta 72', category: 'Jurídico' },
    { text: 'Pergunta 73', category: 'Jurídico' },
    { text: 'Pergunta 74', category: 'Jurídico' },
    { text: 'Pergunta 75', category: 'Jurídico' },
    { text: 'Pergunta 76', category: 'Jurídico' },
    { text: 'Pergunta 77', category: 'Jurídico' },
    { text: 'Pergunta 78', category: 'Jurídico' },
    { text: 'Pergunta 79', category: 'Jurídico' },
    { text: 'Pergunta 80', category: 'Jurídico' },
  ];

  currentQuestionIndex = 0;

  categories = [
    'Administrativo',
    'Comercial',
    'Marketing',
    'Financeiro',
    'Compras',
    'Recursos Humanos',
    'Operações',
    'Jurídico',
  ];

  // Inicializa um array para armazenar o status de conclusão de cada categoria
  completedCategories: boolean[] = new Array(this.categories.length).fill(
    false
  );
  currentCategoryIndex = 0;

  constructor() {
    this.updateCategory();
  }

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

  async transitionToNextQuestion() {
    this.transitioning = true;
    this.showQuestion = false;
    await new Promise(resolve => setTimeout(resolve, 300));
    this.nextQuestion();
    this.showQuestion = true;
    this.transitioning = false;
  }

  // Avança para a próxima pergunta
  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.updateCategory();
    } else {
      // Marca a categoria atual como concluída antes de atualizar a categoria
      this.completedCategories[this.currentCategoryIndex] = true;
      this.updateCategory();
    }
  }

  // Atualiza a categoria atual com base no índice da pergunta atual
  updateCategory() {
    const newIndex = this.categories.indexOf(
      this.questions[this.currentQuestionIndex].category
    );

    // Verifica se a categoria mudou, e se sim, marca a categoria anterior como concluída
    if (newIndex !== this.currentCategoryIndex) {
      this.completedCategories[this.currentCategoryIndex] = true;
      this.currentCategoryIndex = newIndex;
    }
  }

  // Calcula a porcentagem de progresso com base no índice da pergunta atual e no tamanho total das perguntas
  get progressPercentage() {
    return Math.round(
      (this.currentQuestionIndex / this.questions.length) * 100
    );
  }
}
