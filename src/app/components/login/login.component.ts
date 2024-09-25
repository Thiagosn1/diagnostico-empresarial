import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmailService } from '../../services/email.service';
import { HttpErrorResponse } from '@angular/common/http';

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

  validarEmail() {
    const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    if (!re.test(this.email)) {
      this.emailError = 'Por favor, insira um email válido.';
      setTimeout(() => {
        this.emailError = '';
      }, 2000);
      return false;
    } else {
      this.emailError = '';
      return true;
    }
  }

  enviarEmail() {
    if (this.validarEmail()) {
      this.emailSuccess = 'Enviando código para o email...';
      this.emailService.enviarEmail(this.email).subscribe({
        next: (response) => {
          console.log('Resposta da API:', response);
          this.emailSuccess = 'Código enviado com sucesso!';
          setTimeout(() => {
            this.emailSuccess = '';
            this.router.navigate(['/token']);
          }, 2000);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao enviar email:', error);
          this.emailSuccess = '';
          if (error.status === 0) {
            this.emailError =
              'Não foi possível conectar ao servidor. Por favor, verifique sua conexão.';
          } else {
            this.emailError = `Erro ao enviar o código. Por favor, tente novamente. (${error.status})`;
          }
          setTimeout(() => {
            this.emailError = '';
          }, 5000);
        },
      });
    }
  }
}
