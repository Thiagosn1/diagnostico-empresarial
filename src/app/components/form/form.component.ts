import {
  AfterViewInit,
  Component,
  HostListener,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { FormService } from 'src/app/services/form.service';
import { Category } from 'src/app/models/form.model';
import { MatTooltip, TooltipPosition } from '@angular/material/tooltip';
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

  categorias: Category[] = [];
  responses: any = {};
  respostas = Array.from({ length: 11 }, (_, i) => i + 1);
  transicionando = false;
  exibirPergunta = true;
  indicePerguntaAtual = 0;
  indiceCategoriaAtual = 0;
  totalPerguntas = 0;
  perguntasAtuais = 0;
  categoriasCompletas: boolean[] = new Array(this.categorias.length).fill(
    false
  );
  questionarioFinalizado: boolean = false;
  carregandoDados: boolean = false;
  primeiroTooltipPosition: TooltipPosition = 'below';
  exibirTooltip: boolean = false;

  constructor(
    private router: Router,
    private formService: FormService,
    private answerService: AnswerService
  ) {}

  ngOnInit() {
    this.carregarDados();
    this.buscarRespostas();
    this.atualizarPrimeiroTooltipPosition();
  }

  ngAfterViewInit() {
    this.exibirTooltips();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.atualizarPrimeiroTooltipPosition();
    this.atualizarVisibilidadeTooltip();
  }

  atualizarPrimeiroTooltipPosition() {
    this.primeiroTooltipPosition = window.innerWidth < 768 ? 'above' : 'below';
  }

  atualizarVisibilidadeTooltip() {
    this.exibirTooltip = window.innerWidth < 480;
  }

  getTooltipPosition(index: number): TooltipPosition {
    if (window.innerWidth <= 768 && index === 0) {
      return 'above';
    }
    return 'below';
  }

  carregarDados(): void {
    this.formService.getData().subscribe((data) => {
      data.sort((a: any, b: any) => a.position - b.position);
      data.forEach((c: any) => {
        this.totalPerguntas += c.questions.length;
        c.questions.sort((a: any, b: any) => a.position - b.position);
      });
      this.categorias = data;
      this.buscarRespostas();
    });
  }

  buscarRespostas(): void {
    this.answerService.buscarRespostas().subscribe({
      next: (respostas) => {
        if (respostas) {
          this.perguntasAtuais = respostas.length;

          if (this.perguntasAtuais === this.totalPerguntas) {
            this.router.navigate(['/relatorio']);
            return;
          }

          this.atualizarStatusCategorias(respostas);
        } else {
          this.perguntasAtuais = 0;
          this.atualizarStatusCategorias([]);
        }
      },
      error: (error) => {
        console.error('Erro ao buscar as respostas:', error);
      },
    });
  }

  atualizarStatusCategorias(respostas: any[]): void {
    let questaoAtualEncontrada = false;
    let totalRespondidas = 0;

    for (let i = 0; i < this.categorias.length; i++) {
      const categoria = this.categorias[i];
      let perguntasRespondidasNaCategoria = 0;

      for (let j = 0; j < categoria.questions.length; j++) {
        const questao = categoria.questions[j];
        const respostaEncontrada = respostas.find(
          (r) => r.questionId === questao.id
        );

        if (respostaEncontrada) {
          perguntasRespondidasNaCategoria++;
          totalRespondidas++;
        } else if (!questaoAtualEncontrada) {
          this.indiceCategoriaAtual = i;
          this.indicePerguntaAtual = j;
          questaoAtualEncontrada = true;
        }
      }

      this.categoriasCompletas[i] =
        perguntasRespondidasNaCategoria === categoria.questions.length;
    }

    this.perguntasAtuais = totalRespondidas;
  }

  perguntaAtual() {
    if (!this.categorias || !this.categorias[this.indiceCategoriaAtual]) {
      return '';
    }
    return this.categorias[this.indiceCategoriaAtual].questions[this.indicePerguntaAtual]?.description || '';
  }
  
  categoriaAtual() {
    return this.categorias[this.indiceCategoriaAtual]?.name || '';
  }

  porcentagemProgresso() {
    const totalQuestions = this.totalPerguntas;
    const completedQuestions = this.perguntasAtuais;
    return Math.round((completedQuestions / totalQuestions) * 100);
  }

  positividadePerguntaAtual(): boolean {
    return this.categorias[this.indiceCategoriaAtual].questions[
      this.indicePerguntaAtual
    ].positive;
  }

  valorExibidoBotao(index: number): number {
    return index;
  }

  exibirTooltips() {
    this.tooltips.forEach((tooltip) => {
      tooltip.show();
    });
  }

  textoTooltip(index: number): string {
    if (this.positividadePerguntaAtual()) {
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

  corGradiente(index: number): string {
    return `hsl(${(120 * index) / 10}, 100%, 50%)`;
  }

  selecionarResposta(index: number): void {
    const currentCategory = this.categorias[this.indiceCategoriaAtual];
    const currentQuestion = currentCategory.questions[this.indicePerguntaAtual];
    const recordedAnswer = index;
    console.log('Resposta selecionada:', recordedAnswer);

    if (!this.responses[currentCategory.name]) {
      this.responses[currentCategory.name] = [];
    }

    if (
      this.responses[currentCategory.name].length > this.indicePerguntaAtual
    ) {
      console.log('A pergunta atual já foi respondida.');
      return;
    }

    this.responses[currentCategory.name].push(recordedAnswer);

    const answer = {
      questionId: currentQuestion.id,
      value: recordedAnswer,
    };

    this.answerService.salvarResposta(answer).subscribe({
      next: (response) => {
        console.log('Resposta salva com sucesso:', response);
        this.transicaoParaProximaPergunta();
        this.perguntasAtuais++;
      },
      error: (error) => {
        if (
          error.error.title ===
          'Já exíste uma resposta cadastrada com essa descrição'
        ) {
          console.log('Resposta já existe, pulando para a próxima pergunta');
          this.transicaoParaProximaPergunta();
          this.perguntasAtuais++;
        }
      },
    });
  }

  proximaPergunta() {
    const currentCategory = this.categorias[this.indiceCategoriaAtual];

    if (this.indicePerguntaAtual < currentCategory.questions.length - 1) {
      this.indicePerguntaAtual++;
    } else {
      this.categoriasCompletas[this.indiceCategoriaAtual] = true;

      this.indiceCategoriaAtual++;
      this.indicePerguntaAtual = 0;

      if (this.indiceCategoriaAtual == this.categorias.length) {
        this.finalizarQuestionario();
      }
    }
  }

  async transicaoParaProximaPergunta() {
    this.transicionando = true;
    this.exibirPergunta = false;

    await new Promise((resolve) => setTimeout(resolve, 300));

    this.proximaPergunta();

    this.exibirPergunta = true;
    this.transicionando = false;

    this.exibirTooltips();
  }

  finalizarQuestionario(): void {
    this.carregandoDados = true;
    setTimeout(() => {
      this.questionarioFinalizado = true;
      this.carregandoDados = false;
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 3000);
    }, 6000);
  }

  voltar() {
    this.router.navigate(['/info']);
  }
}
