import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule,FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { consultaService } from '../services/consulta';

import { BrowserModule } from '@angular/platform-browser'
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cad-aluno-materia',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './cad-aluno-materia.component.html',
  styleUrl: './cad-aluno-materia.component.css'
})
export class CadAlunoMateriaComponent implements OnInit {
  cursos: any[] = [];
  idUsuario: number = Number(sessionStorage.getItem('id'));

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.buscarCursos();
  }

  buscarCursos(): void {
    this.http.get<any[]>('http://localhost:3000/api/cursos-completo')
      .subscribe({
        next: (data) => this.cursos = data,
        error: (err) => console.error('Erro ao buscar cursos:', err)
      });
  }

  matricular(cursoId: number): void {
    const matricula = {
      idUsuario: this.idUsuario,
      idCursos: cursoId,
      status: 'ativo',
      porcentagem: 0
    };

    this.http.post('http://localhost:3000/api/matricular-curso', matricula)
      .subscribe({
        next: () => alert('Matrícula realizada com sucesso!'),
        error: (err) => {
          console.error('Erro ao realizar matrícula:', err);
          alert('Erro ao realizar matrícula.');
        }
      });
  }
}