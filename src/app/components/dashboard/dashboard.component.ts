import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmailService } from 'src/app/services/email.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  public email: string = '';

  constructor(private emailService: EmailService, private router: Router) {}

  ngOnInit(): void {
    this.emailService.buscarEmail().subscribe({
      next: (data) => {
        if (data) {
          this.email = data.email;
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        console.error('Erro ao buscar o email:', error);
      },
    });
  }

  deslogar(): void {
    localStorage.clear();
  }
}
