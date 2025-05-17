import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms'; 
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { consultaService } from '../services/consulta';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-listar-planos',
  templateUrl: './gerenciar-planos.component.html',
  styleUrls: ['./gerenciar-planos.component.css'],
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
})
export class GerenciarPlanosComponent implements OnInit {
  planos: any[] = [];
  editandoId: number | null = null;
  formulario!: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buscarPlanos();

    this.formulario = this.fb.group({
      tipo: [''],
      duracao: [''],
      valor: ['']
    });
  }

 buscarPlanos(): void {
  this.http.get<{ [key: string]: { valor: number; duracao: number } }>('http://localhost:3000/api/buscar-planos')
    .subscribe({
      next: (data) => {
        // Transformar objeto em array
        this.planos = Object.entries(data).map(([tipo, valores]) => ({
          tipo,
          ...valores
        }));
      },
      error: (err) => console.error('Erro ao buscar planos:', err)
    });
}


  excluirPlano(id: number): void {
    if (confirm('Tem certeza que deseja excluir este plano?')) {
      this.http.delete(`http://localhost:3000/planos/${id}`)
        .subscribe(() => this.buscarPlanos());
    }
  }

  ativarEdicao(plano: any): void {
    this.editandoId = plano.idPlano;
    this.formulario.patchValue(plano);
  }

  atualizarPlano(): void {
    const dados = this.formulario.value;
    this.http.put(`http://localhost:3000/planos/${this.editandoId}`, dados)
      .subscribe(() => {
        this.editandoId = null;
        this.buscarPlanos();
      });
  }

  cancelarEdicao(): void {
    this.editandoId = null;
  }
}
