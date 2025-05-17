import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})


export class ValidacaoService {

  body?:object;
  resposta:any;
  constructor(private http: HttpClient) { }
  

  validar(token: any): Observable<any> {
    const httpheader = new HttpHeaders()
      .set('Authorization', `${token}`)
      .set('Content-Type', 'application/json');
  
    const options = {
      headers: httpheader,
      observe: 'response' as const  // <- necessário para acessar status
    };
  
    return this.http.get<any>('http://localhost:3000/user/autenticar', options);
  }

  realizarLogin(nome: string, password: string): Observable<any> {
    return this.http.post<any>(
      'http://localhost:3000/api/usuario/login',
      { user: nome, password: password },
      { observe: 'response' }
    );
  }

}
