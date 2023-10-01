import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  emailError = '';

  constructor(
    private router: Router,
    private emailService: EmailService,
    private route: ActivatedRoute
  ) {}

  validarEmail() {
    const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    if (!re.test(this.email)) {
      this.emailError = 'Por favor, insira um e-mail válido.';
      setTimeout(() => {
        this.emailError = '';
      }, 2000);
    } else {
      this.emailError = '';
    }
  }

  enviarEmail() {
    this.validarEmail();
    if (!this.emailError) {
      this.emailService.enviarEmail(this.email).subscribe(
        (response) => {
          console.log(response);
          // Verifique se a URL atual contém '/admin'
          if (this.router.url.includes('/admin')) {
            // Se a URL atual contém '/admin', navegue para '/admin/token'
            this.router.navigate(['/admin/token']);
          } else {
            // Caso contrário, navegue para '/token'
            this.router.navigate(['/token']);
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }
}
