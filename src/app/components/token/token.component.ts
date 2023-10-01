import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-token-form',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css'],
})
export class TokenComponent {
  token = '';
  tokenError = '';

  constructor(private router: Router, private emailService: EmailService, private route: ActivatedRoute) {}

  validarToken() {
    const isValid = this.token.length === 6;

    if (!isValid) {
      this.tokenError =
        'Código inválido, verifique se você digitou corretamente ou solicite um novo código.';
      setTimeout(() => {
        this.tokenError = '';
      }, 3000);
    } else {
      this.tokenError = '';
    }
  }

  enviarToken() {
    this.validarToken();
    if (!this.tokenError) {
      this.emailService.enviarToken(this.token).subscribe(
        (response) => {
          console.log(response);
          // Verifique se a URL atual contém '/admin'
          if (this.router.url.includes('/admin')) {
            // Se a URL atual contém '/admin', navegue para o dashboard do admin
            this.router.navigate(['/admin/dashboard']);
          } else {
            // Caso contrário, navegue para '/cadastro'
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