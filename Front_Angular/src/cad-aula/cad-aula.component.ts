import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidacaoService } from '../services/validacao.service';
import { consultaService } from '../services/consulta';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-cad-aula',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './cad-aula.component.html',
  styleUrl: './cad-aula.component.css'
})
export class CadAulaComponent  implements OnInit {
  formulario!: FormGroup;
  cursos: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      idCursos: ['', Validators.required],
      descricao: ['', [Validators.required, Validators.maxLength(100)]],
      tipo: ['', Validators.required],
      urlConteudo: ['', [Validators.required, Validators.maxLength(255)]],
      cargaHoraria: ['', [Validators.required, Validators.min(1)]],
    });

    this.buscarCursosAtivos();
  }

  buscarCursosAtivos(): void {
    this.http.get<any[]>('http://localhost:3000/api/cursos-ativos')
      .subscribe({
        next: (data) => this.cursos = data,
        error: (err) => console.error('Erro ao buscar cursos:', err)
      });
  }

  cadastrarConteudo(): void {
    if (this.formulario.invalid) return;

    this.http.post('http://localhost:3000/api/conteudos', this.formulario.value)
      .subscribe({
        next: () => {
          alert('Conteúdo cadastrado com sucesso!');
          this.formulario.reset();
        },
        error: (err) => {
          console.error('Erro ao cadastrar conteúdo:', err);
          alert('Erro ao cadastrar conteúdo');
        }
      });
  }
}