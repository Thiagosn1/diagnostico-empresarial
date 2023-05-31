import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './pages/home/home.component';
import {CardsComponent} from "./pages/home/components/cards/cards.component";
import {ContentComponent} from "./pages/home/components/content/content.component";
import {FooterComponent} from "./pages/home/components/footer/footer.component";
import {HeaderComponent} from "./pages/home/components/header/header.component";
import {SliderComponent} from "./pages/home/components/slider/slider.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {NgOptimizedImage} from "@angular/common";
import {RouterLink, RouterOutlet} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {AppRoutingModule} from "./app-routing.module";
import { LoginComponent } from './pages/login/login.component';
import { TokenComponent } from './pages/login/components/token/token.component';
import {MatInputModule} from "@angular/material/input";
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import { EmpresaComponent } from './pages/dashboard/components/cadastro/empresa/empresa.component';
import { FuncionarioComponent } from './pages/dashboard/components/cadastro/funcionario/funcionario.component';
import { RelatorioComponent } from './pages/dashboard/components/relatorio/relatorio.component';
import { HomeDashComponent } from './pages/dashboard/components/home-dash/home-dash.component';
import {MatButtonModule} from "@angular/material/button";
import {NgChartsModule} from "ng2-charts";
import { InfoComponent } from './pages/info/info.component';
import { FormComponent } from './pages/form/form.component';

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
    DashboardComponent,
    EmpresaComponent,
    FuncionarioComponent,
    RelatorioComponent,
    HomeDashComponent,
    InfoComponent,
    FormComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    NgOptimizedImage,
    RouterLink,
    MatCardModule,
    RouterOutlet,
    MatInputModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    NgChartsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
