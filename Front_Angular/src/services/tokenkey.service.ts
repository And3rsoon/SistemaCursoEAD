import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenkeyService {

  constructor() { }

  deleteToken():void{
    
    sessionStorage.removeItem('token');

  }
  setToken(token: string) {
    sessionStorage.setItem("token",token);
  }

  getToken(): string | null {
    return sessionStorage.getItem("token");
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}

