import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { CardsComponent } from './components/home/components/cards/cards.component';
import { ContentComponent } from './components/home/components/content/content.component';
import { FooterComponent } from './components/home/components/footer/footer.component';
import { HeaderComponent } from './components/home/components/header/header.component';
import { SliderComponent } from './components/home/components/slider/slider.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './components/login/login.component';
import { TokenComponent } from './components/token/token.component';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgChartsModule } from 'ng2-charts';
import { InfoComponent } from './components/info/info.component';
import { FormComponent } from './components/form/form.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CadastroEmpresaComponent } from './components/cadastro-empresa/cadastro-empresa.component';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DashboardAdminComponent } from './admin/dashboard-admin/dashboard-admin.component';
import { UsuariosComponent } from './admin/usuarios/usuarios.component';
import { QuestoesComponent } from './admin/questoes/questoes.component';
import { CategoriasComponent } from './admin/categorias/categorias.component';
import { DashHomeComponent } from './admin/dash-home/dash-home.component';
import { EmpresasComponent } from './admin/empresas/empresas.component';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmpresaComponent } from './components/empresa/empresa.component';
import { RelatorioComponent } from './components/relatorio/relatorio.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CardsComponent,
    ContentComponent,
    FooterComponent,
    HeaderComponent,
    SliderComponent,
    LoginComponent,
    TokenComponent,
    InfoComponent,
    FormComponent,
    CadastroEmpresaComponent,
    DashboardAdminComponent,
    UsuariosComponent,
    QuestoesComponent,
    CategoriasComponent,
    DashHomeComponent,
    EmpresasComponent,
    EmpresaComponent,
    RelatorioComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    NgOptimizedImage,
    RouterLink,
    MatDialogModule,
    MatCardModule,
    RouterOutlet,
    MatInputModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    NgChartsModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    NgChartsModule,
    MatTableModule,
    MatDialogModule,
    FormsModule,
    HttpClientModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
