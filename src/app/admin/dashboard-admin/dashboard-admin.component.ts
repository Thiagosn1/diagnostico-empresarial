import { Component, OnInit } from '@angular/core';
import { EmailService } from 'src/app/services/email.service';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css'],
})
export class DashboardAdminComponent implements OnInit {
  cadastroMenuVisible = false;
  arrowRotation = 270;
  public email: string = '';

  constructor(private emailService: EmailService) {}

  ngOnInit(): void {
    this.email = this.emailService.email;
  }  

  toggleCadastroMenu(): void {
    this.cadastroMenuVisible = !this.cadastroMenuVisible;
    this.arrowRotation = this.arrowRotation === 270 ? 0 : 270;
  }
}
