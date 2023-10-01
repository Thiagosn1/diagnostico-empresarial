import {Component} from '@angular/core';

@Component({
  selector: 'app-funcionario',
  templateUrl: './funcionario.component.html',
  styleUrls: ['./funcionario.component.css']
})
export class FuncionarioComponent {

  columnsToDisplay = ['email', 'status', 'actions'];
  funcionarios = [
    { email: 'funcionario1@email.com', status: 'Cadastrado' },
    { email: 'funcionario2@email.com', status: 'Não encontrado' },
    { email: 'funcionario3@email.com', status: 'Cadastrado' },
    { email: 'funcionario4@email.com', status: 'Não encontrado' },
    { email: 'funcionario5@email.com', status: 'Cadastrado' },
    { email: 'funcionario6@email.com', status: 'Não encontrado' },
    { email: 'funcionario7@email.com', status: 'Cadastrado' },
    { email: 'funcionario8@email.com', status: 'Não encontrado' }
  ];
  email = '';
}
