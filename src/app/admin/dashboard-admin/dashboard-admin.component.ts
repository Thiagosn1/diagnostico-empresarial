import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmailService } from 'src/app/services/email.service';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css'],
})
export class DashboardAdminComponent implements OnInit {
  public email: string = '';

  constructor(private emailService: EmailService, private router: Router) {}

  ngOnInit(): void {
    this.emailService.buscarEmail().subscribe({
      next: (data) => {
        if (data) {
          this.email = data.email;
        } else {
          this.router.navigate(['/admin/login']);
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
