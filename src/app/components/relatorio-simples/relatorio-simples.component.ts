import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { AnswerService } from 'src/app/services/answers.service';
import { QuantidadePessoasService } from 'src/app/services/quantidade.pessoas.service';

@Component({
  selector: 'app-relatorio-simples',
  templateUrl: './relatorio-simples.component.html',
  styleUrls: ['./relatorio-simples.component.css'],
})
export class RelatorioSimplesComponent implements OnInit {
  quantidadePessoas: number = 0;
  mostrarBotaoOrcamento: boolean = false;
  mostrarBotaoGestor: boolean = false;

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

  public radarChartLabels: string[] = [
    'Administrativo',
    'Comercial',
    'Marketing',
    'Financeiro',
    'Compras',
    'Jurídico',
    'Recursos Humanos',
    'Operações',
  ];

  public radarChartData: ChartData<'radar'> = {
    labels: this.radarChartLabels,
    datasets: [
      {
        data: [80, 100, 70, 75, 100, 60, 100, 100],
        label: 'Diagnóstico Empresarial',
      },
    ],
  };
  public radarChartType: ChartType = 'radar';

  constructor(
    private qtdPessoasService: QuantidadePessoasService,
    private answerService: AnswerService
  ) {}

  ngOnInit() {
    this.answerService.buscarRespostas().subscribe((respostas) => {
      this.answerService.buscarCategorias().subscribe((categorias) => {
        this.answerService.buscarQuestoes().subscribe((questoes) => {
          this.processarDados(respostas, categorias, questoes);
        });
      });
    });

    this.qtdPessoasService.quantidadePessoas$.subscribe((qtd) => {
      this.quantidadePessoas = Number(qtd);
      this.atualizarVisibilidadeBotoes();
    });
  }

  processarDados(respostas: any, categorias: any, questoes: any) {
    // Atualize radarChartLabels com os nomes das categorias
    this.radarChartLabels = categorias.map((categoria: any) => categoria.name);

    // Inicialize um novo array para armazenar os dados do gráfico
    const newRadarChartData: ChartData<'radar'> = {
      labels: this.radarChartLabels,
      datasets: [
        {
          data: [],
          label: 'Diagnóstico Empresarial',
        },
      ],
    };

    // Preencha o array com os dados das respostas
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
        // Calcule a soma dos valores das respostas para cada categoria
        const sum = respostasCategoria.reduce(
          (a: number, b: any) => a + b.value,
          0
        );
        const average = sum / questoesCategoria.length;
        newRadarChartData.datasets[0].data.push(average);
      } else {
        // Se não houver respostas para uma categoria, adicione um valor padrão (por exemplo, 0)
        newRadarChartData.datasets[0].data.push(0);
      }
    }

    // Atualize radarChartData com os novos dados
    this.radarChartData = newRadarChartData;
  }

  atualizarVisibilidadeBotoes() {
    this.mostrarBotaoOrcamento = this.quantidadePessoas === 1;
    this.mostrarBotaoGestor = this.quantidadePessoas > 1;
  }
}
