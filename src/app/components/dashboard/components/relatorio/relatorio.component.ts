import { Component } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.css'],
})
export class RelatorioComponent {
  public radarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
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
}