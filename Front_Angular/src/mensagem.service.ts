import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MensagemService {
  constructor(private http: HttpClient) {}

  getMensagens(idUsuario: number, role: string) {
    return this.http.post<any[]>('http://localhost:3000/mensagens', { idUsuario, role });
  }

  marcarComoLida(idMensagem: number) {
    return this.http.put(`http://localhost:3000/mensagem/${idMensagem}`, {});
  }
}