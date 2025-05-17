import { Component, OnInit } from '@angular/core';
import { MensagemService } from '../mensagem.service';
import { CommonModule, DatePipe, NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-ver-mensagens',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, DatePipe],
  templateUrl: './ver-mensagens.component.html',
  styleUrl: './ver-mensagens.component.css'
})
export class VerMensagensComponent implements OnInit {
  mensagens: any[] = [];
  idUsuario: any;
  role: any ;

  constructor(private mensagemService: MensagemService) {}

  ngOnInit() {
    this.idUsuario = Number(sessionStorage.getItem('id'));
    this.role = String(sessionStorage.getItem('role'));
    this.mensagemService.getMensagens(this.idUsuario, this.role).subscribe(data => {
      this.mensagens = data;
    });
  }

  marcarComoLida(msg: any) {
    if (msg.status === 'pendente') {
      this.mensagemService.marcarComoLida(msg.idMensagem).subscribe(() => {
        msg.status = 'lida';
      });
    }
  }
}