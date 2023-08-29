import {Component, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-funcionario',
  templateUrl: './funcionario.component.html',
  styleUrls: ['./funcionario.component.css']
})
export class FuncionarioComponent {
  @ViewChild('convidarFuncionarioDialog') convidarFuncionarioDialog!: TemplateRef<any>;

  columnsToDisplay = ['email', 'status', 'actions'];
  employees = [
    { email: 'funcionario1@email.com', status: 'Cadastrado' },
    { email: 'funcionario2@email.com', status: 'Não encontrado' },
    { email: 'funcionario3@email.com', status: 'Cadastrado' },
    { email: 'funcionario4@email.com', status: 'Não encontrado' },
    { email: 'funcionario5@email.com', status: 'Cadastrado' },
    { email: 'funcionario6@email.comthgthfhfdfdgf', status: 'Não encontrado' },
    { email: 'funcionario7@email.com', status: 'Cadastrado' },
    { email: 'funcionario8@email.com', status: 'Não encontrado' }
  ];
  email = '';

  constructor(public dialog: MatDialog) {}

  openConvidarFuncionarioDialog() {
    const dialogRef = this.dialog.open(this.convidarFuncionarioDialog, {
      width: '500px', height: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      // Adicione aqui o código para manipular o resultado do diálogo
    });
  }

  onNoClick(): void {
    this.dialog.closeAll();
  }
}
