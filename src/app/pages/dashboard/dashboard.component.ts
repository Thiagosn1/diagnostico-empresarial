import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  cadastroMenuVisible = false;
  arrowRotation = 270;

  constructor() {}

  ngOnInit(): void {}

  toggleCadastroMenu(): void {
    this.cadastroMenuVisible = !this.cadastroMenuVisible;
    this.arrowRotation = this.arrowRotation === 270 ? 0 : 270;
  }
}
