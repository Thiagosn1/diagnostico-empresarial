import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmailService } from '../../services/email.service';
import { HttpResponse } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { BusinessesService } from 'src/app/services/businesses.service';

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
    private authService: AuthService,
    private businessesService: BusinessesService
  ) {}

  // Método para enviar o token
  enviarToken() {
    if (this.token.length !== 6) {
      this.tokenError =
        'Código inválido, verifique se você digitou corretamente ou solicite um novo código.';
    } else {
      this.emailService.enviarToken(this.token).subscribe(
        (response: HttpResponse<any>) => {
          console.log(response);
          const authHeader = response.headers.get('Authorization');
          if (authHeader !== null) {
            this.authService.setToken(authHeader);
            console.log('Authorization:', authHeader);
            this.businessesService.obterEmpresas().subscribe((empresas) => {
              if (empresas.length > 0) {
                this.router.navigate(['/dashboard']);
              } else {
                this.router.navigate(['/cadastro']);
              }
            });
          }
        },
        (error) => {
          console.error(error);
          if (
            error.error.title === 'Falha ao autenticar usuario' ||
            error.error.title === 'Seu Código expirou' ||
            error.error.title === 'Seu c�digo expirou'
          ) {
            this.tokenError = error.error.title;
          }
        }
      );
    }
  }

  // Método para reenviar o token
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
