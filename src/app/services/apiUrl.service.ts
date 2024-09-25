import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiUrlService {
  private localApiUrl = 'http://localhost:4200/api/';
  private prodApiUrl = '15.228.13.33:8080/';
  private currentApiUrl: string;

  constructor() {
    this.currentApiUrl = this.determineInitialApiUrl();
  }

  private determineInitialApiUrl(): string {
    // isDevMode() é uma função do Angular que retorna true se estiver em modo de desenvolvimento
    return isDevMode() ? this.localApiUrl : this.prodApiUrl;
  }

  getApiUrl(): string {
    return this.currentApiUrl;
  }

  toggleApiUrl(): void {
    this.currentApiUrl =
      this.currentApiUrl === this.localApiUrl
        ? this.prodApiUrl
        : this.localApiUrl;
    console.log(`API URL alterada para: ${this.currentApiUrl}`);
  }

  setApiUrl(url: string): void {
    if (url === this.localApiUrl || url === this.prodApiUrl) {
      this.currentApiUrl = url;
      console.log(`API URL definida para: ${this.currentApiUrl}`);
    } else {
      console.error('URL inválida. Use localApiUrl ou prodApiUrl.');
    }
  }

  getFullApiUrl(endpoint: string): string {
    // Não adiciona o protocolo para a URL de produção
    return `${this.currentApiUrl}${endpoint}`;
  }
}
