import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';
import { LoginComponent } from './pages/login/login.component';
import { TokenComponent } from './pages/login/components/token/token.component';
import { FuncionarioComponent } from './pages/dashboard/components/cadastro/funcionario/funcionario.component';
import { RelatorioComponent } from './pages/dashboard/components/relatorio/relatorio.component';
import { HomeDashComponent } from './pages/dashboard/components/home-dash/home-dash.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InfoComponent } from './pages/info/info.component';
import { FormComponent } from './pages/form/form.component';
import {CadastroEmpresaComponent} from "./pages/cadastro-empresa/cadastro-empresa.component";

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
