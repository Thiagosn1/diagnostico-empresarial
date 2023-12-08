import { Component } from '@angular/core';
import { BusinessUsersService } from 'src/app/services/businessUsers.service';
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
  answersCount: number = 0;
  timeline: any[] = [];
  displayedColumns: string[] = ['date', 'description'];

  constructor(
    private businessUsersService: BusinessUsersService,
    private timelineService: TimelineService
  ) {}

  ngOnInit(): void {
    this.carregarContadores();
    this.carregarLinhaDoTempo();
  }

  // Método para carregar os contadores de funcionários, convites aceitos e não aceitos e respostas
  carregarContadores(): void {
    this.businessUsersService.obterFuncionarios().subscribe(
      (businessUsers) => {
        this.businessuserCount = businessUsers.length;
        this.invitationAcceptedCount = businessUsers.filter(
          (user) => user.invitationAccepted
        ).length;
        this.invitationNoAcceptedCount = businessUsers.filter(
          (user) => !user.invitationAccepted
        ).length;
        this.answersCount = businessUsers.reduce(
          (total, user) => total + user.answers.length,
          0
        );
      },
      (error) => console.error('Erro ao carregar funcionários:', error)
    );
  }

  // Método para carregar a linha do tempo
  carregarLinhaDoTempo(): void {
    this.timelineService.getTimeline().subscribe(
      (timeline) => {
        this.timeline = timeline.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      },
      (error) => {
        console.error('Erro ao carregar linha do tempo:', error);
      }
    );
  }

  // Método para adicionar um item à linha do tempo
  adicionarItemLinhaDoTempo(): void {
    const newItem = {
      date: new Date().toISOString(),
      description: 'Nova alteração',
    };

    this.timelineService.createTimeline(newItem).subscribe(
      (response) => {
        console.log('Item da linha do tempo criado:', response);
        this.carregarLinhaDoTempo();
      },
      (error) => console.error('Erro ao criar item da linha do tempo:', error)
    );
  }

  // Método para atualizar um item da linha do tempo
  atualizarItemLinhaDoTempo(id: number): void {
    const updatedItem = {
      description: 'Descrição atualizada',
    };

    this.timelineService.updateTimeline(id, updatedItem).subscribe(
      (response) => {
        console.log('Item da linha do tempo atualizado:', response);
        this.carregarLinhaDoTempo();
      },
      (error) =>
        console.error('Erro ao atualizar item da linha do tempo:', error)
    );
  }
}
