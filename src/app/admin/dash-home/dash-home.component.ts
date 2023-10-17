import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-dash-home',
  templateUrl: './dash-home.component.html',
  styleUrls: ['./dash-home.component.css'],
})
export class DashHomeComponent implements OnInit {
  userCount: number = 0;
  categoryCount: number = 0;
  questionCount: number = 0;

  constructor(
    private userService: UserService,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    this.loadCounts();
  }

  loadCounts(): void {
    this.userService.obterUsuarios().subscribe(
      (users) => (this.userCount = users.length),
      (error) => console.error('Erro ao carregar usuários:', error)
    );

    this.formService.getData().subscribe(
      (categories) => {
        this.categoryCount = categories.length;
        this.questionCount = categories.reduce(
          (sum, category) => sum + category.questions.length,
          0
        );
      },
      (error) => console.error('Erro ao carregar categorias e questões:', error)
    );
  }
}
