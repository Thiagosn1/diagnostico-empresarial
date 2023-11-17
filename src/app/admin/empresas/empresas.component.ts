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
  displayedColumns: string[] = ['id', 'nome', 'cnpj', 'managerId', 'acao'];
  dataSource = new MatTableDataSource();
  editingBusinessId: number | null = null;

  constructor(
    private businessesService: BusinessesService,
    private timelineService: TimelineService
  ) {}

  ngOnInit(): void {
    this.carregarEmpresas();
  }

  // Método para carregar as empresas
  carregarEmpresas(): void {
    this.businessesService.obterEmpresas().subscribe(
      (data) => {
        this.dataSource.data = data;
        this.dataSource._updateChangeSubscription();
      },
      (error) => {
        console.error('Erro ao carregar empresas:', error);
      }
    );
  }

  // Método para aplicar o filtro na tabela conforme o usuário digita
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Método para alternar entre o modo de edição e visualização ao clicar nos botões Renomear/Confirmar
  toggleEditing(business: any): void {
    if (this.editingBusinessId === business.id) {
      this.atualizarEmpresa(business);
      this.editingBusinessId = null;
    } else {
      this.editingBusinessId = business.id;
    }
  }

  // Método para atualizar a empresa
  atualizarEmpresa(empresa: any): void {
    this.businessesService.atualizarEmpresa(empresa.id, empresa).subscribe(
      () => {
        const descricao = `A empresa ${empresa.name} foi atualizada`;
        this.salvarAlteracaoNaTimeline(descricao);
        this.carregarEmpresas();
      },
      (error) => console.error('Erro ao atualizar empresa:', error)
    );
  }

  // Método para excluir a empresa
  excluirEmpresa(empresa: any): void {
    this.businessesService.excluirEmpresa(empresa.id).subscribe(
      () => {
        const descricao = `A empresa ${empresa.name} foi excluída`;
        this.salvarAlteracaoNaTimeline(descricao);
        this.carregarEmpresas();
      },
      (error) => console.error('Erro ao excluir empresa:', error)
    );
  }

  // Método para salvar a alteração na linha do tempo
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
