import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { format } from 'date-fns';
import { BusinessesService } from 'src/app/services/businesses.service';
import { TimelineService } from 'src/app/services/timeline.service';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css'],
})
export class EmpresasComponent implements OnInit {
  displayedColumns: string[] = ['nome', 'cnpj', 'acao'];
  dataSource = new MatTableDataSource();

  constructor(
    private businessesService: BusinessesService,
    private timelineService: TimelineService
  ) {}

  ngOnInit(): void {
    this.carregarEmpresas();
  }

  // Carrega as empresas
  carregarEmpresas(): void {
    this.businessesService.obterEmpresas().subscribe(
      (data) => {
        console.log('Empresas carregadas:', data);
        this.dataSource.data = data;
        this.dataSource._updateChangeSubscription();
      },
      (error) => {
        console.error('Erro ao carregar empresas:', error);
      }
    );
  }

  // Aplica o filtro na tabela
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Atualiza uma empresa
  atualizarEmpresa(empresa: any): void {
    this.businessesService.atualizarEmpresa(empresa.id, empresa).subscribe(
      () => {
        console.log('Empresa atualizada:', empresa);
        const descricao = `A empresa ${empresa.name} foi atualizada`;
        this.salvarAlteracaoNaTimeline(descricao);
        this.carregarEmpresas();
      },
      (error) => console.error('Erro ao atualizar empresa:', error)
    );
  }

  // Exclui a empresa
  excluirEmpresa(empresa: any): void {
    this.businessesService.excluirEmpresa(empresa.id).subscribe(
      () => {
        console.log('Empresa excluída:', empresa);
        const descricao = `A empresa ${empresa.name} foi excluída`;
        this.salvarAlteracaoNaTimeline(descricao);
        this.carregarEmpresas();
      },
      (error) => console.error('Erro ao excluir empresa:', error)
    );
  }

  // Salva a alteração na linha do tempo
  salvarAlteracaoNaTimeline(descricao: string): void {
    const date = format(new Date(), 'dd-MM-yyyy HH:mm');
    const newItem = {
      date: date,
      description: descricao,
    };

    this.timelineService.createTimeline(newItem).subscribe(
      (response) => {
        console.log('Alteração salva na linha do tempo:', response);
      },
      (error) =>
        console.error('Erro ao salvar alteração na linha do tempo:', error)
    );
  }
}
