import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { TokenComponent } from './components/token/token.component';
import { FuncionarioComponent } from './components/dashboard/components/cadastro/funcionario/funcionario.component';
import { RelatorioComponent } from './components/dashboard/components/relatorio/relatorio.component';
import { HomeDashComponent } from './components/dashboard/components/home-dash/home-dash.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InfoComponent } from './components/info/info.component';
import { FormComponent } from './components/form/form.component';
import { CadastroEmpresaComponent } from './components/cadastro-empresa/cadastro-empresa.component';
import { RelatorioSimplesComponent } from './components/relatorio-simples/relatorio-simples.component';
import { DashboardAdminComponent } from './admin/dashboard-admin/dashboard-admin.component';

const routes: Routes = [
  // Rotas para usuário comum
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'token', component: TokenComponent },
  { path: 'cadastro', component: CadastroEmpresaComponent },
  { path: 'info', component: InfoComponent },
  { path: 'formulario', component: FormComponent },
  { path: 'relatorio', component: RelatorioSimplesComponent },

  // Rotas para gestor
  {
    path: 'gestor',
    children: [
      { path: '', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'token', component: TokenComponent },
      { path: 'cadastro', component: CadastroEmpresaComponent },
      { path: 'info', component: InfoComponent },
      { path: 'formulario', component: FormComponent },
      { path: 'relatorio', component: RelatorioSimplesComponent },
      {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
          { path: '', component: HomeDashComponent },
          { path: 'home', component: HomeDashComponent },
          { path: 'funcionario', component: FuncionarioComponent },
          { path: 'relatorio', component: RelatorioComponent },
        ],
      },
    ],
  },

  // Rotas para admin
  {
    path: 'admin',
    redirectTo: '/admin/login',
    pathMatch: 'full',
  },
  {
    path: 'admin',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'token', component: TokenComponent },
      {
        path: 'dashboard',
        component: DashboardAdminComponent,
        children: [
          { path: '', component: HomeDashComponent },
          { path: 'home', component: HomeDashComponent },
          { path: 'funcionario', component: FuncionarioComponent },
          { path: 'relatorio', component: RelatorioComponent },
        ],
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
