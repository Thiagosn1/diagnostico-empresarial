import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmailService } from '../../services/email.service';
import { HttpResponse } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-token-form',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css'],
})
export class TokenComponent {
  token = '';
  tokenError = '';
  tokenSuccess = '';

  constructor(
    private router: Router,
    private emailService: EmailService,
    private authService: AuthService
  ) {}

  validarToken() {
    const isValid = this.token.length === 6;

    if (!isValid) {
      this.tokenError =
        'Código inválido, verifique se você digitou corretamente ou solicite um novo código.';
      setTimeout(() => {
        this.tokenError = '';
      }, 2000);
    } else {
      this.tokenError = '';
    }
  }

  /* enviarToken() {
    this.validarToken();
    if (!this.tokenError) {
      this.emailService.enviarToken(this.token).subscribe(
        (response) => {
          console.log(response);
          if (this.router.url.includes('/admin')) {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/cadastro']);
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }
  } */

  enviarToken() {
    this.validarToken();
    if (!this.tokenError) {
      this.emailService.enviarToken(this.token).subscribe(
        (response: HttpResponse<any>) => {
          console.log(response);
          const authHeader = response.headers.get('Authorization');
          if (authHeader !== null) {
            this.authService.setToken(authHeader);
            console.log('Authorization:', authHeader);
          } else {
            console.error('Authorization header not found');
          }
          if (this.router.url.includes('/admin')) {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/cadastro']);
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  // Função para lidar com o reenvio do código
  reenviarToken() {
    this.tokenSuccess = 'Reenviando código para o email...';
    setTimeout(() => {
      this.tokenSuccess = '';
    }, 2000);

    this.emailService.reenviarToken().subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.error(error);
      }
    );
  }
  // Verifica se o e-mail está presente no serviço
  hasEmail(): boolean {
    return !!this.emailService.email;
  }
}
