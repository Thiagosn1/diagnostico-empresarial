import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { TimelineService } from 'src/app/services/timeline.service';
import { Form } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';
import { BusinessesService } from 'src/app/services/businesses.service';

@Component({
  selector: 'app-dash-home',
  templateUrl: './dash-home.component.html',
  styleUrls: ['./dash-home.component.css'],
})
export class DashHomeComponent implements OnInit {
  userCount: number = 0;
  categoryCount: number = 0;
  questionCount: number = 0;
  businessesCount: number = 0;
  timeline: any[] = [];
  displayedColumns: string[] = ['date', 'description'];

  constructor(
    private userService: UserService,
    private businessesService: BusinessesService,
    private formService: FormService,
    private timelineService: TimelineService
  ) {}

  ngOnInit(): void {
    this.carregarContadores();
    this.carregarLinhaDoTempo();
  }

  // Método para carregar os contadores de usuários, categorias e questões
  carregarContadores(): void {
    this.userService.obterUsuarios().subscribe(
      (users) => (this.userCount = users.length),
      (error) => console.error('Erro ao carregar usuários:', error)
    );

    this.businessesService.obterEmpresas().subscribe(
      (business) => (this.businessesCount = business.length),
      (error) => console.error('Erro ao carregar empresas:', error)
    );

    this.formService.getData().subscribe(
      (categories) => {
        this.categoryCount = categories.length;
        this.questionCount = categories.reduce(
          (sum, category) => sum + category.questions.length,
          0
        );
      },
      (error) => console.error('Erro ao carregar categorias e questões:', error)
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
