import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgIf, NgFor, NgForOf } from '@angular/common';
import { TokenkeyService } from '../services/tokenkey.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-inicio-cursos',
  templateUrl: './inicio-cursos.component.html',
  styleUrls: ['./inicio-cursos.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, NgForOf, FormsModule]
})
export class InicioCursosComponent implements OnInit {
  atividades: any[] = [];
  conteudoSelecionado: any = null;
  user: any = '';
  name: any = '';
  title = 'home';
  cursoMatriculadoId!: number;
  idCurso!: number;
  currentDateTime: string = new Date().toLocaleString();
  private intervalId: any;
  porcentagem: any = 0;
  mensagens: any[] = [];
  mensagem: string = '';
  respostaAtividade: string = '';
  atividadeAtual: any;
  safeUrl!: SafeResourceUrl;

  constructor(
    private socketService: SocketService,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private tokenService: TokenkeyService,
    private route: Router,
    private route2: ActivatedRoute
  ) {}

  ngOnDestroy(): void {
  clearInterval(this.intervalId);
}

  ngOnInit(): void {
    this.user = sessionStorage.getItem('role');
    this.name = sessionStorage.getItem('nome');

    // Atualizar a hora a cada segundo
    this.intervalId = setInterval(() => {
      this.currentDateTime = new Date().toLocaleString();
    }, 1000);

    // Converte param para number e armazena
    this.cursoMatriculadoId = Number(this.route2.snapshot.paramMap.get('idCursos'));

    this.getidCursoMatriculado(Number(sessionStorage.getItem('id')))
      .subscribe((data: any[]) => {
        if (data.length > 0) {
          this.idCurso = data[0].idCursos;
          this.socketService.joinCurso(this.name, this.idCurso);
        }
        alert("eu fui reinicializado");
});

      
    this.getAtividadesPorCursoMatriculado(this.cursoMatriculadoId)
      .subscribe((data: any[]) => {
        this.atividades = data;
      });

    this.atualizarProgressoCurso(this.cursoMatriculadoId);

    //this.socketService.joinCurso(Number(sessionStorage.getItem('id')), this.idCurso);

    this.socketService.receberMensagem().subscribe((msg) => {
      this.mensagens.push(msg);
      
    });
  }

  getAtividadesPorCursoMatriculado(idCursosMatriculado: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/atividades/${idCursosMatriculado}`);
  }

  getidCursoMatriculado(id: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/cursoMatriculado/${id}`);
  }

  logOut() {
    this.tokenService.deleteToken();
    this.route.navigate(['home']);
    alert('Logout realizado!');
  }

  finalizarAtividade(): void {
    if (!this.atividadeAtual || !this.atividadeAtual.id) return;

    this.http.put(
      `http://localhost:3000/atividades-realizadas/${this.atividadeAtual.id}`, {}
    ).subscribe({
      next: () => {
        console.log('Atividade finalizada!');
        this.atividadeAtual.status = 'concluida';
        this.atualizarProgressoCurso(this.cursoMatriculadoId);
      },
      error: () => console.error('Erro ao finalizar atividade.')
    });
  }

  atualizarProgressoCurso(idCursosMatriculado: number): void {
    this.http.put(`http://localhost:3000/api/atualizar-porcentagem/${idCursosMatriculado}`, {})
      .subscribe({
        next: (res: any) => { this.porcentagem = res.porcentagem.toFixed(2); },
        error: () => console.error('Erro ao atualizar progresso do curso.')
      });
  }

  finalizarAposLeitura(): void {
    setTimeout(() => {
      this.finalizarAtividade();
    }, 10000);
  }

  enviarResposta(): void {
    if (!this.respostaAtividade.trim()) {
      alert('Por favor, escreva sua resposta.');
      return;
    }

    const payload = {
      idAtividade: this.atividadeAtual.id,
      resposta: this.respostaAtividade,
      idUsuario: sessionStorage.getItem('id'),
      status: 'concluida',
      data: new Date()
    };

    this.http.post('http://localhost:3000/respostas', payload)
      .subscribe({
        next: () => {
          alert('Resposta enviada!');
          this.respostaAtividade = '';
          this.conteudoSelecionado = null;
          this.atividadeAtual.status = 'concluida';
        },
        error: () => alert('Erro ao enviar resposta.')
      });
  }

  iniciarAtividade(atividade: any): void {
    this.conteudoSelecionado = atividade.conteudo;
    this.atividadeAtual = atividade;

    if (this.conteudoSelecionado.tipo === 'pdf') {
      const googleViewerUrl = 'https://docs.google.com/gview?url=' + encodeURIComponent(this.conteudoSelecionado.urlConteudo) + '&embedded=true';
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(googleViewerUrl);
    }
    if (this.conteudoSelecionado.tipo === 'vídeo') {
      const videoId = this.getYouTubeVideoId(this.conteudoSelecionado.urlConteudo);
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    }
  }

  getYouTubeVideoId(url: string): string | null {
    const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  }

  enviar(): void {
    if (this.mensagem.trim()) {
      this.socketService.enviarMensagem({
        idUsuarioRemetente: Number(sessionStorage.getItem('id')),
        idCurso: this.idCurso,
        mensagem: this.mensagem
      });
      this.mensagem = '';
    }
  }
}