import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EmailService } from '../../services/email.service';
import { HttpResponse } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { BusinessesService } from 'src/app/services/businesses.service';
import { AnswerService } from 'src/app/services/answers.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-token-form',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css'],
})
export class TokenComponent implements OnInit {
  @ViewChild('input1') firstInput!: ElementRef;
  token: string[] = Array(6).fill('');
  tokenError = '';
  tokenSuccess = '';

  constructor(
    private router: Router,
    private emailService: EmailService,
    private userService: UserService,
    private authService: AuthService,
    private businessesService: BusinessesService,
    private answersService: AnswerService
  ) {}

  ngOnInit() {
    if (!this.emailService.email) {
      this.router.navigate(['/login']);
    }
  }

  enviarToken() {
    if (this.token.some((t) => t.length !== 1)) {
      this.tokenError =
        'Código inválido, verifique se você digitou corretamente ou solicite um novo código.';
      return;
    }
    const tokenStr = this.token.join('');
    this.emailService.enviarToken(tokenStr).subscribe({
      next: (response: HttpResponse<any>) => {
        const authHeader = response.headers.get('Authorization');
        if (authHeader !== null) {
          this.authService.setToken(authHeader);
          this.userService.obterUsuario().subscribe({
            next: (usuario: any) => {
              if (usuario.authority === 'ROOT') {
                this.router.navigate(['/admin/dashboard']);
              } else if (usuario.authority === 'DEFAULT') {
                this.businessesService.obterEmpresas().subscribe({
                  next: (empresas) => {
                    if (empresas.length > 0) {
                      this.router.navigate(['/gestao-empresa']);
                    } else {
                      this.answersService.buscarBusinessUserId().subscribe({
                        next: (businessUserId) => {
                          if (businessUserId) {
                            this.router.navigate(['/info']);
                          } else {
                            this.router.navigate(['/cadastro']);
                          }
                        },
                        error: (error) => {
                          console.error(
                            'Erro ao buscar o businessUserId:',
                            error
                          );
                          this.router.navigate(['/cadastro']);
                        },
                      });
                    }
                  },
                  error: (error) => {
                    if (error.error.title === 'Negócio não encontrado') {
                      this.answersService.buscarBusinessUserId().subscribe({
                        next: (businessUserId) => {
                          if (businessUserId) {
                            this.router.navigate(['/info']);
                          } else {
                            this.router.navigate(['/cadastro']);
                          }
                        },
                        error: (error) => {
                          console.error(
                            'Erro ao buscar o businessUserId:',
                            error
                          );
                          this.router.navigate(['/cadastro']);
                        },
                      });
                    }
                  },
                });
              }
            },
            error: (error) => {
              console.error('Erro ao obter o usuário:', error);
            },
          });
        }
      },
      error: (error) => {
        console.error(error);
        if (
          error.error.title === 'Falha ao autenticar usuario' ||
          error.error.title === 'Seu Código expirou' ||
          error.error.title === 'Seu c�digo expirou'
        ) {
          this.tokenError =
            'Código inválido, verifique se você digitou corretamente ou solicite um novo código.';
          setTimeout(() => {
            this.tokenError = '';
          }, 2000);
          this.token = Array(6).fill('');
          this.firstInput.nativeElement.focus();
          return;
        }
      },
    });
  }

  reenviarToken() {
    this.tokenSuccess = 'Reenviando código para o email...';
    setTimeout(() => {
      this.tokenSuccess = '';
    }, 2000);

    this.emailService.reenviarToken().subscribe({
      next: () => {},
      error: (error) => {
        console.error(error);
      },
    });
  }

  temEmail(): boolean {
    return !!this.emailService.email;
  }

  focarProximo(evento: KeyboardEvent, proximoInput?: HTMLInputElement) {
    const input = evento.target as HTMLInputElement;
    if (input.value.length === 1 && proximoInput) {
      proximoInput.focus();
    }
    if (this.token.every((t) => t.length === 1)) {
      this.enviarToken();
    }
  }

  colarToken(event: ClipboardEvent) {
    if (event.clipboardData) {
      let pastedText = event.clipboardData.getData('text');
      if (pastedText.length === 6) {
        this.token = pastedText.split('');
        event.preventDefault();
      }
    }
  }
}
