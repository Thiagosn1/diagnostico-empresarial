import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  emailError = '';
  emailSuccess = '';

  constructor(private router: Router, private emailService: EmailService) {}

  // Método para validar o email
  validarEmail() {
    const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    if (!re.test(this.email)) {
      this.emailError = 'Por favor, insira um email válido.';
      setTimeout(() => {
        this.emailError = '';
      }, 2000);
    } else {
      this.emailError = '';
    }
  }

  // Método para enviar o email
  enviarEmail() {
    this.validarEmail();
    if (!this.emailError) {
      this.emailSuccess = 'Enviando código para o email...';
      this.emailService.enviarEmail(this.email).subscribe(
        (response) => {
          console.log(response);
          setTimeout(() => {
            this.emailSuccess = '';
            if (this.router.url.includes('/admin')) {
              this.router.navigate(['/admin/token']);
            } else {
              this.router.navigate(['/token']);
            }
          }, 2000);
        },
        (error) => {
          console.error(error);
          this.emailSuccess = '';
        }
      );
    }
  }
}
