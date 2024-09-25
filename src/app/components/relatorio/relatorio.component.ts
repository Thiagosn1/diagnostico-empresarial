import { Component, Inject, OnInit } from '@angular/core';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Business } from 'src/app/models/form.model';
import { AnswerService } from 'src/app/services/answers.service';
import { BusinessesService } from 'src/app/services/businesses.service';

@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.css'],
})
export class RelatorioComponent implements OnInit {
  larguraTela: number;
  mostrarBotaoGerenciar = false;
  public radarChartType: ChartType = 'radar';
  public radarChartLabels: string[] = [];

  public radarChartData: ChartData<'radar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Diagnóstico Empresarial',
      },
    ],
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
    public dialogRef: MatDialogRef<RelatorioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private answerService: AnswerService,
    private router: Router,
    private businessesService: BusinessesService,
    private viewportRuler: ViewportRuler
  ) {
    this.larguraTela = this.viewportRuler.getViewportSize().width;
  }

  ngOnInit() {
    const business = this.data.business;
    this.buscarCategorias(business);
  }

  buscarCategorias(business: any): void {
    this.answerService.buscarCategorias().subscribe({
      next: (categorias) => {
        if (categorias) {
          this.radarChartLabels = categorias.map(
            (categoria: any) => categoria.name
          );
          this.buscarQuestoes(business.id, categorias);
        } else {
          this.radarChartLabels = [];
          console.error('Nenhuma categoria encontrada');
        }
      },
      error: (error) => {
        console.error('Erro ao buscar categorias:', error);
      },
    });
  }

  buscarQuestoes(businessId: any, categorias: any): void {
    this.answerService.buscarQuestoes().subscribe((questoes) => {
      this.calcularMediaRespostas(businessId, categorias, questoes);
    });
  }

  fecharModal(): void {
    this.dialogRef.close();
  }

  processarDados(respostas: any, categorias: any, questoes: any) {
    this.radarChartLabels = categorias.map((categoria: any) => categoria.name);

    const newData: number[] = [];
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
        newData.push(average);
      } else {
        newData.push(0);
      }
    }

    this.radarChartData.labels = this.radarChartLabels;
    this.radarChartData.datasets[0].data = newData;
  }

  calcularMediaRespostas(businessId: number, categorias: any, questoes: any) {
    this.businessesService.obterEmpresas().subscribe((empresas) => {
      let empresasParaProcessar;

      if (this.router.url.includes('/gestao-empresa')) {
        empresasParaProcessar = [empresas[0]];
      } else {
        empresasParaProcessar = empresas.filter(
          (empresa: Business) => empresa.id === businessId
        );
      }

      empresasParaProcessar.forEach((empresa: Business) => {
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
              somaCategoria += sum;
              totalRespostasCategoria += respostasCategoria.length;
            }
          }

          if (totalRespostasCategoria > 0) {
            const mediaRespostas = somaCategoria / totalRespostasCategoria;
            newRadarChartData.datasets[0].data.push(mediaRespostas);
          } else {
            newRadarChartData.datasets[0].data.push(0);
          }
        }

        this.radarChartData = newRadarChartData;
      });
    });
  }

  checarRota(): boolean {
    return this.router.url === '/gestao-empresa';
  }

  checarRotaAdmin(): boolean {
    return this.router.url === '/admin/dashboard/empresas';
  }
}
