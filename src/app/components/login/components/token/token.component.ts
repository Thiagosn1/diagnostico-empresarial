import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmailService } from '../../../../services/email.service';

@Component({
  selector: 'app-token-form',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css'],
})
export class TokenComponent {
  token = '';
  tokenError = '';

  constructor(private router: Router, private emailService: EmailService) {}

  validarToken() {
    const isValid = this.token.length === 6;

    if (!isValid) {
      this.tokenError =
        'Token inválido, verifique se você digitou corretamente ou solicite um novo token.';
    } else {
      this.tokenError = '';
    }
  }

  submitToken() {
    this.validarToken();
    if (!this.tokenError) {
      this.emailService.submitToken(this.token).subscribe(
        (response) => {
          console.log(response);
          this.router.navigate(['/cadastro']);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }
}
