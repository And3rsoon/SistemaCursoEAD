import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, shareReplay, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private readonly url = 'http://localhost:3000';
  private mensagemSubject = new Subject<any>();
  private jaRegistrado = false;

  constructor() {
    this.socket = io(this.url, { transports: ['websocket', 'polling'] });
  }

  joinCurso(idUsuario: any, idCurso: number) {
    this.socket.emit('joinCurso', { idUsuario, idCurso });
  }

  enviarMensagem(dados: any) {
    this.socket.emit('mensagem', dados);
  }

  receberMensagem(): Observable<any> {
    if (!this.jaRegistrado) {
      this.socket.on('novaMensagem', (data) => {
        this.mensagemSubject.next(data);
      });
      this.jaRegistrado = true;
    }
    return this.mensagemSubject.asObservable();
  }
}