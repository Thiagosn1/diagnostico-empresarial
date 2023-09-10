import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {EmailService} from "../../../../services/email.service";

@Component({
  selector: 'app-token-form',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css'],
})
export class TokenComponent {
  token = '';
  tokenError = '';

  constructor(private router: Router, private emailService: EmailService) {} // Injete o EmailService

  validarToken() {
    // Substitua esta linha pela sua lógica de validação de token
    const isValid = this.token.length === 6;

    if (!isValid) {
      this.tokenError = 'Por favor, insira um token válido.';
    } else {
      this.tokenError = '';
    }
  }

  submitToken() {
    this.validarToken();
    if (!this.tokenError) {
      console.log({ email: this.emailService.email, loginCode: this.token }); // Use o e-mail do serviço
      this.router.navigate(['/cadastro']);
    }
  }
}
