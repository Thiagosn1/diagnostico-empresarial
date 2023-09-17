import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { FormResponseService } from 'src/app/services/form.response.service';
import { QuantidadePessoasService } from 'src/app/services/quantidade.pessoas.service';

@Component({
  selector: 'app-relatorio-simples',
  templateUrl: './relatorio-simples.component.html',
  styleUrls: ['./relatorio-simples.component.css']
})
export class RelatorioSimplesComponent implements OnInit {
  quantidadePessoas: number = 0;

  public radarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      r: {
        min: 0,
        max: 10,
        ticks: {
          stepSize: 1
        }
      }
    }
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

  constructor(private formResponseService: FormResponseService, private qtdPessoasService: QuantidadePessoasService) {}

  ngOnInit() {
    this.formResponseService.currentResponse.subscribe(response => {
      this.updateRadarChartData(response);
    });
    this.qtdPessoasService.quantidadePessoas$.subscribe(qtd => {
      console.log('Received new quantidadePessoas:', qtd);
      this.quantidadePessoas = qtd;
    });    
  }

  updateRadarChartData(response: any) {
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
    for (const category of this.radarChartLabels) {
      const answers = response[category];
      if (answers) {
        // Calcule a média das respostas para cada categoria
        const average = answers.reduce((a: number, b: number) => a + b, 0) / answers.length;
        newRadarChartData.datasets[0].data.push(average);
      } else {
        // Se não houver respostas para uma categoria, adicione um valor padrão (por exemplo, 0)
        newRadarChartData.datasets[0].data.push(0);
      }
    }

    // Atualize radarChartData com os novos dados
    this.radarChartData = newRadarChartData;
  }
}
