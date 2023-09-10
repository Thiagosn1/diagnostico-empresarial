import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {EmailService} from "../../services/email.service";

@Component({
    selector:'app-login',
    templateUrl:'./login.component.html',
    styleUrls:['./login.component.css'],
})
export class LoginComponent {
    email = '';
    emailError = '';

    constructor(private router: Router, private emailService: EmailService) {} // Injete o EmailService

    validarEmail() {
        const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
        if (!re.test(this.email)) {
            this.emailError = 'Por favor, insira um e-mail válido.';
        } else {
            this.emailError = '';
        }
    }

    sendEmail() {
        this.validarEmail();
        if (!this.emailError) {
            this.emailService.email = this.email; // Armazene o e-mail no serviço
            console.log({ email: this.email });
            this.router.navigate(['/token']);
        }
    }

    /*sendEmail() {
        this.validarEmail();
        if (!this.emailError) {
            const url = 'http://localhost:3000/api'; // URL da API
            this.http.post(url, { email: this.email }).subscribe(resposta => {
                console.log(resposta);
                this.router.navigate(['/token']);
            });
        }
    }*/
}
