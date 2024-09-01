import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmailService } from 'src/app/services/email.service';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css'],
})
export class DashboardAdminComponent implements OnInit {
  email: string = '';
  menuAberto: boolean = true;

  constructor(private emailService: EmailService, private router: Router) {}

  ngOnInit(): void {
    this.buscarEmail();
    this.menuAberto = localStorage.getItem('menuAberto') === 'true';
  }

  buscarEmail(): void {
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

  toggleMenu(): void {
    this.menuAberto = !this.menuAberto;
    localStorage.setItem('menuAberto', this.menuAberto.toString());
  }
}
