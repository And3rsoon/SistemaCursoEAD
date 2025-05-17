import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cad-subareas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cad-subareas.component.html',
  styleUrl: './cad-subareas.component.css'
})
export class CadSubareasComponent implements OnInit {
  formulario!: FormGroup;
  areas: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      idAreaCursos: ['', Validators.required],
      nome: ['', Validators.required]
    });

    this.buscarAreas();
  }

  buscarAreas(): void {
    this.http.get<any[]>('http://localhost:3000/api/areas')
      .subscribe({
        next: (data) => this.areas = data,
        error: (err) => console.error('Erro ao buscar áreas:', err)
      });
  }

  cadastrarSubarea(): void {
    if (this.formulario.invalid) return;

    const subarea = this.formulario.value;
    this.http.post('http://localhost:3000/api/subareas', subarea)
      .subscribe({
        next: () => {
          alert('Subárea cadastrada com sucesso!');
          this.formulario.reset();
        },
        error: (err) => {
          console.error('Erro ao cadastrar subárea:', err);
          alert('Erro ao cadastrar subárea');
        }
      });
  }
}
