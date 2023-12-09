import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AnswerService } from 'src/app/services/answers.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css'],
})
export class InfoComponent {
  buttonText: string = 'Iniciar';
  isContinuing: boolean = false;

  constructor(private router: Router, private answerService: AnswerService) {}

  ngOnInit(): void {
    this.answerService.buscarRespostas().subscribe(
      (respostas) => {
        if (respostas.length > 0) {
          this.buttonText = 'Continuar de onde parou';
          this.isContinuing = true;
        }
      },
      (error) => {
        console.error('Erro ao buscar as respostas:', error);
      }
    );
  }

  isInfoRoute(): boolean {
    return this.router.url === '/dashboard/info';
  }
}
