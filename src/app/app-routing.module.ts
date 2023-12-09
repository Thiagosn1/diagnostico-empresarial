import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { TokenComponent } from './components/token/token.component';
import { HomeDashComponent } from './components/dashboard/components/home-dash/home-dash.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InfoComponent } from './components/info/info.component';
import { FormComponent } from './components/form/form.component';
import { CadastroEmpresaComponent } from './components/cadastro-empresa/cadastro-empresa.component';
import { DashboardAdminComponent } from './admin/dashboard-admin/dashboard-admin.component';
import { UsuariosComponent } from './admin/usuarios/usuarios.component';
import { QuestoesComponent } from './admin/questoes/questoes.component';
import { CategoriasComponent } from './admin/categorias/categorias.component';
import { DashHomeComponent } from './admin/dash-home/dash-home.component';
import { EmpresasComponent } from './admin/empresas/empresas.component';
import { EmpresaComponent } from './components/dashboard/components/empresa/empresa.component';
import { RelatorioComponent } from './components/relatorio/relatorio.component';

const routes: Routes = [
  // Rotas para usuário comum
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'token', component: TokenComponent },
  { path: 'cadastro', component: CadastroEmpresaComponent },
  { path: 'info', component: InfoComponent },
  { path: 'formulario', component: FormComponent },
  { path: 'relatorio', component: RelatorioComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', component: HomeDashComponent },
      { path: 'home', component: HomeDashComponent },
      { path: 'empresa', component: EmpresaComponent },
      { path: 'info', component: InfoComponent },
      { path: 'relatorio', component: RelatorioComponent },
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
          { path: '', component: DashHomeComponent },
          { path: 'usuarios', component: UsuariosComponent },
          { path: 'empresas', component: EmpresasComponent },
          { path: 'categorias', component: CategoriasComponent },
          { path: 'questoes', component: QuestoesComponent },
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
