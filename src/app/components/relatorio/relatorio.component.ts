import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { AnswerService } from 'src/app/services/answers.service';
import { BusinessesService } from 'src/app/services/businesses.service';

@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.css'],
})
export class RelatorioComponent implements OnInit {
  public radarChartType: ChartType = 'radar';
  public radarChartLabels: string[] = [];

  public radarChartData: ChartData<'radar'> = {
    labels: [],
    datasets: [],
  };

  public radarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      r: {
        min: 0,
        max: 10,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  constructor(
    private answerService: AnswerService,
    private router: Router,
    private businessesService: BusinessesService
  ) {}

  ngOnInit() {
    this.answerService.buscarCategorias().subscribe((categorias) => {
      this.radarChartLabels = categorias.map(
        (categoria: any) => categoria.name
      );
      this.answerService.buscarQuestoes().subscribe((questoes) => {
        if (this.router.url.includes('/dashboard/relatorio')) {
          this.calcularMediaRespostas(categorias, questoes);
        } else {
          this.answerService.buscarRespostas().subscribe((respostas) => {
            this.processarDados(respostas, categorias, questoes);
          });
        }
      });
    });
  }

  processarDados(respostas: any, categorias: any, questoes: any) {
    this.radarChartLabels = categorias.map((categoria: any) => categoria.name);

    const newRadarChartData: ChartData<'radar'> = {
      labels: this.radarChartLabels,
      datasets: [
        {
          data: [],
          label: 'Diagnóstico Empresarial',
        },
      ],
    };

    for (const categoria of categorias) {
      const questoesCategoria = questoes.filter(
        (questao: any) => questao.categoryId === categoria.id
      );
      const respostasCategoria = respostas.filter((resposta: any) =>
        questoesCategoria.some(
          (questao: any) => questao.id === resposta.questionId
        )
      );
      if (respostasCategoria.length > 0) {
        const sum = respostasCategoria.reduce(
          (a: number, b: any) => a + b.value,
          0
        );
        const average = sum / questoesCategoria.length;
        newRadarChartData.datasets[0].data.push(average);
      } else {
        newRadarChartData.datasets[0].data.push(0);
      }
    }

    this.radarChartData = newRadarChartData;
  }

  calcularMediaRespostas(categorias: any, questoes: any): void {
    this.businessesService.obterEmpresas().subscribe((empresas) => {
      if (empresas.length > 0) {
        const empresa = empresas[0];
        const newRadarChartData: ChartData<'radar'> = {
          labels: this.radarChartLabels,
          datasets: [
            {
              data: [],
              label: 'Diagnóstico Empresarial',
            },
          ],
        };

        for (const categoria of categorias) {
          let somaCategoria = 0;
          let totalRespostasCategoria = 0;

          for (const businessUser of empresa.businessUsers) {
            const respostasCategoria = businessUser.answers.filter(
              (resposta: any) =>
                questoes.find(
                  (questao: any) => questao.id === resposta.questionId
                ).categoryId === categoria.id
            );
            if (respostasCategoria.length > 0) {
              const sum = respostasCategoria.reduce(
                (a: number, b: any) => a + b.value,
                0
              );
              const mediaRespostasUsuario = sum / respostasCategoria.length;
              console.log('Usuário: ', businessUser.userEmail);
              console.log('Soma das respostas do usuário: ', sum);
              console.log(
                'Média das respostas do usuário: ',
                mediaRespostasUsuario
              );
              somaCategoria += sum;
              totalRespostasCategoria += respostasCategoria.length;
            }
          }

          if (totalRespostasCategoria > 0) {
            const mediaRespostas = somaCategoria / totalRespostasCategoria;
            console.log('Categoria: ', categoria.name);
            console.log('Soma das respostas: ', somaCategoria);
            console.log('Total de respostas: ', totalRespostasCategoria);
            console.log('Média das respostas: ', mediaRespostas);
            console.log('-------------------------');
            newRadarChartData.datasets[0].data.push(mediaRespostas);
          } else {
            newRadarChartData.datasets[0].data.push(0);
          }
        }

        this.radarChartData = newRadarChartData;
      }
    });
  }

  checarRota(): boolean {
    return this.router.url === '/dashboard/relatorio';
  }
}
