import { Component, OnInit } from '@angular/core';
import { EmailService } from 'src/app/services/email.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  public email: string = '';

  constructor(private emailService: EmailService) {}

  ngOnInit(): void {
    this.emailService.buscarEmail().subscribe(
      (data) => {
        if (data) {
          this.email = data.email;
        }
      },
      (error) => {
        console.error('Erro ao buscar o email:', error);
      }
    );
  }

  // Método para limpar o localStorage e deslogar o usuário
  onLogout(): void {
    localStorage.clear();
  }
}
