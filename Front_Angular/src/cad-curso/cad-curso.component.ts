import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidacaoService } from '../services/validacao.service';
import { consultaService } from '../services/consulta';
import { HttpClient } from '@angular/common/http';

  
  @Component({
    selector: 'app-cad-curso',
    standalone: true,
    imports: [ReactiveFormsModule, FormsModule, CommonModule],
    templateUrl: './cad-curso.component.html',
    styleUrl: './cad-curso.component.css'
  })
  export class CadCursoComponent implements OnInit {
  formulario!: FormGroup;
  areas: any[] = [];
  subareas: any[] = [];
  professores: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      nome: ['', Validators.required],
      cargaHoraria: ['', [Validators.required, Validators.min(1)]],
      idAreaCursos: ['', Validators.required],
      idSubArea: ['', Validators.required],
      idUsuario: ['', Validators.required], // Agora selecionável
      status: ['ativo']
    });

    this.buscarAreas();
    this.buscarProfessores();
  }

  buscarAreas(): void {
    this.http.get<any[]>('http://localhost:3000/api/areas')
      .subscribe({
        next: (data) => this.areas = data,
        error: (err) => console.error('Erro ao buscar áreas:', err)
      });
  }

  buscarSubareas(): void {
    const idArea = this.formulario.get('idAreaCursos')?.value;
    if (!idArea) return;

    this.http.get<any[]>(`http://localhost:3000/api/subareas/por-area/${idArea}`)
      .subscribe({
        next: (data) => this.subareas = data,
        error: (err) => console.error('Erro ao buscar subáreas:', err)
      });
  }

  buscarProfessores(): void {
    this.http.get<any[]>('http://localhost:3000/api/professores')
      .subscribe({
        next: (data) => this.professores = data,
        error: (err) => console.error('Erro ao buscar professores:', err)
      });
  }

  cadastrarCurso(): void {
    if (this.formulario.invalid) return;

    this.http.post('http://localhost:3000/api/cursos', this.formulario.value)
      .subscribe({
        next: () => {
          alert('Curso cadastrado com sucesso!');
          this.formulario.reset();
        },
        error: (err) => {
          console.error('Erro ao cadastrar curso:', err);
          alert('Erro ao cadastrar curso');
        }
      });
  }
}
