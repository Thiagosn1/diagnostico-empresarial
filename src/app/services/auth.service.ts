import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /* setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  } */

  secretKey = 'b@5e64Gh8Jk1Lm9Qr3TuVwXyZ'; // Mantenha esta chave segura e privada

  setToken(token: string): void {
    const encryptedToken = CryptoJS.AES.encrypt(token, this.secretKey).toString();
    localStorage.setItem('authToken', encryptedToken);
  }

  getToken(): string | null {
    const encryptedToken = localStorage.getItem('authToken');
    if (encryptedToken) {
      const bytes = CryptoJS.AES.decrypt(encryptedToken, this.secretKey);
      const originalToken = bytes.toString(CryptoJS.enc.Utf8);
      return originalToken;
    }
    return null;
  }
}
