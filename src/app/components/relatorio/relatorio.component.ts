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
    private answerService: AnswerService,
    private router: Router,
    private businessesService: BusinessesService
  ) {}

  ngOnInit() {
    this.answerService.buscarCategorias().subscribe((categorias) => {
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

  calcularMediaRespostas(categorias: any, questoes: any): void {
    this.businessesService.obterEmpresas().subscribe((empresas) => {
      if (empresas.length > 0) {
        const empresa = empresas[0]; // Pegue a primeira empresa
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
              (resposta: any) => questoes.find((questao: any) => questao.id === resposta.questionId).categoryId === categoria.id
            );
            if (respostasCategoria.length > 0) {
              const sum = respostasCategoria.reduce((a: number, b: any) => a + b.value, 0);
              const mediaRespostasUsuario = sum / respostasCategoria.length;
              console.log('Usuário: ', businessUser.userEmail); // Adicione esta linha
              console.log('Soma das respostas do usuário: ', sum); // Adicione esta linha
              console.log('Média das respostas do usuário: ', mediaRespostasUsuario); // Adicione esta linha
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
  
        // Atualize radarChartData com os novos dados
        this.radarChartData = newRadarChartData;
      }
    });
  }

  isInfoRoute(): boolean {
    return this.router.url === '/dashboard/relatorio';
  }
}
