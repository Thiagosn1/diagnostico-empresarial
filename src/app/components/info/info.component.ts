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

  constructor(private router: Router, private answerService: AnswerService) {}

  ngOnInit(): void {
    this.buscarRespostas();
  }

  buscarRespostas(): void {
    this.answerService.buscarRespostas().subscribe({
      next: (respostas) => {
        if (respostas.length > 0) {
          this.textoBotao = 'Continuar de onde parou';
          this.estaContinuando = true;
        }
      },
      error: (error) => {
        console.error('Erro ao buscar as respostas:', error);
      },
    });
  }

  checarRota(): boolean {
    return this.router.url === '/dashboard/empresa';
  }
}
