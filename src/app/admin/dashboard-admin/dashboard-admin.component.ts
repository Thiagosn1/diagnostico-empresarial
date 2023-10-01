import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css'],
})
export class DashboardAdminComponent implements OnInit {
  cadastroMenuVisible = false;
  arrowRotation = 270;

  constructor() {}

  ngOnInit(): void {}

  toggleCadastroMenu(): void {
    this.cadastroMenuVisible = !this.cadastroMenuVisible;
    this.arrowRotation = this.arrowRotation === 270 ? 0 : 270;
  }
}
