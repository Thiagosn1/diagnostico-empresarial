import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { TimelineService } from 'src/app/services/timeline.service';
import { FormService } from 'src/app/services/form.service';
import { BusinessesService } from 'src/app/services/businesses.service';

@Component({
  selector: 'app-dash-home',
  templateUrl: './dash-home.component.html',
  styleUrls: ['./dash-home.component.css'],
})
export class DashHomeComponent implements OnInit {
  contagemUsuarios: number = 0;
  contagemCategorias: number = 0;
  contagemPerguntas: number = 0;
  contagemEmpresas: number = 0;
  linhaDoTempo: any[] = [];
  colunasExibidas: string[] = ['date', 'description'];

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

  carregarContadores(): void {
    this.userService.obterUsuarios().subscribe({
      next: (users) => (this.contagemUsuarios = users.length),
      error: (error) => console.error('Erro ao carregar usuários:', error),
    });

    this.businessesService.obterEmpresas().subscribe({
      next: (business) => (this.contagemEmpresas = business.length),
      error: (error) => console.error('Erro ao carregar empresas:', error),
    });

    this.formService.getData().subscribe({
      next: (categories) => {
        this.contagemCategorias = categories.length;
        this.contagemPerguntas = categories.reduce(
          (sum, category) => sum + category.questions.length,
          0
        );
      },
      error: (error) =>
        console.error('Erro ao carregar categorias e questões:', error),
    });
  }

  carregarLinhaDoTempo(): void {
    this.timelineService.getTimeline().subscribe({
      next: (linhaDoTempo) => {
        this.linhaDoTempo = linhaDoTempo.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
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

    this.timelineService.createTimeline(newItem).subscribe({
      next: (response) => {
        console.log('Item da linha do tempo criado:', response);
        this.carregarLinhaDoTempo();
      },
      error: (error) =>
        console.error('Erro ao criar item da linha do tempo:', error),
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
      error: (error) =>
        console.error('Erro ao atualizar item da linha do tempo:', error),
    });
  }
}
