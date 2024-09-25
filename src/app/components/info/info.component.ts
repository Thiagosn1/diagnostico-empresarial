import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AnswerService } from 'src/app/services/answers.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css'],
})
export class InfoComponent {
  textoBotao: string = 'Iniciar';
  estaContinuando: boolean = false;
  todasPerguntasRespondidas: boolean = false;
  carregandoDados: boolean = true;

  constructor(private router: Router, private answerService: AnswerService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.buscarRespostas();
    }, 100);
  }

  buscarRespostas(): void {
    this.answerService.buscarQuestoes().subscribe({
      next: (questoes) => {
        if (questoes) {
          this.answerService.buscarRespostas().subscribe({
            next: (respostas) => {
              this.carregandoDados = false;
              if (respostas && respostas.length > 0) {
                this.textoBotao = 'Continuar de onde parou';
                this.estaContinuando = true;
                this.todasPerguntasRespondidas =
                  questoes.length === respostas.length;
                if (this.todasPerguntasRespondidas) {
                  setTimeout(() => {
                    this.router.navigate(['/']);
                  }, 6000);
                }
              } else {
                this.textoBotao = 'Iniciar';
                this.estaContinuando = false;
                this.todasPerguntasRespondidas = false;
              }
            },
            error: (error) => {
              console.error('Erro ao buscar as respostas:', error);
            },
          });
        } else {
          this.carregandoDados = false;
          this.textoBotao = 'Iniciar';
          this.estaContinuando = false;
          this.todasPerguntasRespondidas = false;
        }
      },
      error: (error) => {
        console.error('Erro ao buscar as questões:', error);
      },
    });
  }

  checarRota(): boolean {
    return this.router.url === '/dashboard/empresa';
  }

  deslogar(): void {
    localStorage.clear();
  }
}
