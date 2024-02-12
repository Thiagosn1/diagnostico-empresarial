import { Component } from '@angular/core';
import { TimelineItem } from 'src/app/models/form.model';
import { BusinessUsersService } from 'src/app/services/businessUsers.service';
import { FormService } from 'src/app/services/form.service';
import { TimelineService } from 'src/app/services/timeline.service';

@Component({
  selector: 'app-home-dash',
  templateUrl: './home-dash.component.html',
  styleUrls: ['./home-dash.component.css'],
})
export class HomeDashComponent {
  businessuserCount: number = 0;
  invitationAcceptedCount: number = 0;
  invitationNoAcceptedCount: number = 0;
  formsCompletedCount: number = 0;
  totalQuestions: number = 0;
  timeline: TimelineItem[] = [];
  colunasExibidas: string[] = ['date', 'description'];

  constructor(
    private businessUsersService: BusinessUsersService,
    private timelineService: TimelineService,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    this.carregarTotalDeQuestoes();
    this.carregarContadores();
    this.carregarLinhaDoTempo();
  }

  carregarContadores(): void {
    this.businessUsersService.obterFuncionarios().subscribe({
      next: (businessUsers) => {
        this.businessuserCount = businessUsers.length;
        this.invitationAcceptedCount = businessUsers.filter(
          (user) => user.invitationAccepted
        ).length;
        this.invitationNoAcceptedCount = businessUsers.filter(
          (user) => !user.invitationAccepted
        ).length;
        this.formsCompletedCount = businessUsers.filter(
          (user: any) => user.answers.length === this.totalQuestions
        ).length;
      },
      error: (error) => {
        console.error('Erro ao carregar funcionários:', error);
      },
    });
  }

  carregarTotalDeQuestoes(): void {
    this.formService.getData().subscribe({
      next: (categories) => {
        this.totalQuestions = categories.reduce(
          (sum, category) => sum + category.questions.length,
          0
        );
      },
      error: (error) => {
        console.error('Erro ao carregar questões:', error);
      },
    });
  }

  carregarLinhaDoTempo(): void {
    this.timelineService.getTimeline().subscribe({
      next: (response: { timeline: TimelineItem[] }) => {
        this.timeline = response.timeline.sort(
          (a: TimelineItem, b: TimelineItem) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          }
        );
      },
      error: (error) => {
        console.error('Erro ao carregar linha do tempo:', error);
      },
    });
  }

  adicionarItemLinhaDoTempo(): void {
    const newItem = {
      date: new Date().toISOString(),
      description: 'Nova alteração',
    };

    console.log('Enviando para a API:', newItem); // Adicione esta linha

    this.timelineService.createTimeline(newItem).subscribe({
      next: (response) => {
        console.log('Item da linha do tempo criado:', response);
        this.carregarLinhaDoTempo();
      },
      error: (error) => {
        console.error('Erro ao criar item da linha do tempo:', error);
      },
    });
  }

  atualizarItemLinhaDoTempo(id: number): void {
    const updatedItem = {
      description: 'Descrição atualizada',
    };

    this.timelineService.updateTimeline(id, updatedItem).subscribe({
      next: (response) => {
        console.log('Item da linha do tempo atualizado:', response);
        this.carregarLinhaDoTempo();
      },
      error: (error) => {
        console.error('Erro ao atualizar item da linha do tempo:', error);
      },
    });
  }
}
