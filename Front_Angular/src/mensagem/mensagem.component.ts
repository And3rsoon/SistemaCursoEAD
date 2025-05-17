import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-mensagem',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './mensagem.component.html',
  styleUrl: './mensagem.component.css'
})
export class MensagemComponent implements OnInit {
  userRole:any = '';
  userId:any ='';
  cursos: any[] = [];
  destinatario: string = '';
  mensagem: string = '';
  idCurso: number = 0;
  status: string = 'pendente';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.userRole=sessionStorage.getItem('role');
    this.userId=Number(sessionStorage.getItem('id'));
    if (this.userRole === 'Administrador') {
      this.http.get<any[]>('http://localhost:3000/cursos-ativos').subscribe(data => this.cursos = data);
    } else {
      this.http.get<any[]>(`http://localhost:3000/cursos-professor/${this.userId}`).subscribe(data => this.cursos = data);
    }
  }

  enviarMensagem(): void {
    const payload = {
      idUsuario: this.userId,
      idCurso: this.idCurso,
      destinatario: this.destinatario,
      mensagem: this.mensagem,
      status: this.status
    };

    this.http.post('http://localhost:3000/mensagem', payload).subscribe({
      next: () =>{alert('Mensagem enviada com sucesso!')
          this.mensagem='';

      },
      error: () => alert('Erro ao enviar mensagem.')
    });
  }
}