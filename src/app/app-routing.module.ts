import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { TokenComponent } from './components/login/components/token/token.component';
import { FuncionarioComponent } from './components/dashboard/components/cadastro/funcionario/funcionario.component';
import { RelatorioComponent } from './components/dashboard/components/relatorio/relatorio.component';
import { HomeDashComponent } from './components/dashboard/components/home-dash/home-dash.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InfoComponent } from './components/info/info.component';
import { FormComponent } from './components/form/form.component';
import {CadastroEmpresaComponent} from "./components/cadastro-empresa/cadastro-empresa.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'token', component: TokenComponent },
  { path: 'cadastro', component: CadastroEmpresaComponent},
  { path: 'info', component: InfoComponent },
  { path: 'form', component: FormComponent },
  {
    path: 'dashboard', component: DashboardComponent,
    children: [
      { path: '', component: HomeDashComponent },
      { path: 'home', component: HomeDashComponent },
      { path: 'funcionario', component: FuncionarioComponent },
      { path: 'relatorio', component: RelatorioComponent },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
