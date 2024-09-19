import { Component, HostListener, OnInit } from '@angular/core';
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
  ehVisualizacaoMobile: boolean = false;

  constructor(private emailService: EmailService, private router: Router) {}

  ngOnInit(): void {
    this.buscarEmail();
    this.verificarTamanhoTela();
    const menuAbertoStorage = localStorage.getItem('menuAberto');
    this.menuAberto = this.ehVisualizacaoMobile
      ? false
      : menuAbertoStorage === null
      ? true
      : menuAbertoStorage === 'true';
  }

  @HostListener('window:resize', ['$event'])
  aoRedimensionar() {
    this.verificarTamanhoTela();
  }

  definirEstadoInicialMenu(): void {
    const menuAbertoStorage = localStorage.getItem('menuAberto');
    if (this.ehVisualizacaoMobile) {
      this.menuAberto = false;
    } else {
      this.menuAberto =
        menuAbertoStorage === null ? true : menuAbertoStorage === 'true';
    }
  }

  verificarTamanhoTela() {
    const larguraAnterior = this.ehVisualizacaoMobile;
    this.ehVisualizacaoMobile = window.innerWidth < 768;

    if (!larguraAnterior && this.ehVisualizacaoMobile) {
      this.menuAberto = false;
    } else if (larguraAnterior && !this.ehVisualizacaoMobile) {
      this.menuAberto = true;
    }
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
    if (!this.ehVisualizacaoMobile) {
      this.menuAberto = !this.menuAberto;
      localStorage.setItem('menuAberto', this.menuAberto.toString());
    }
  }
}
