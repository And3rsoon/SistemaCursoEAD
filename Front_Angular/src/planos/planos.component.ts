import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms'; 
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { consultaService } from '../services/consulta';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-cadastro-cliente',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './planos.component.html',
  styleUrl: './planos.component.css'
})

export class PlanosComponent implements OnInit {
  formulario!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
  this.formulario = this.fb.group({
    tipo: ['', Validators.required],
    duracao: ['', Validators.required],
    valor: ['', Validators.required]
  });
}


  cadastrarPlanos(): void {
  const plano = this.formulario.value;

  this.http.post('http://localhost:3000/cadastrar-plano', plano)
    .subscribe({
      next: () => {
        alert('Plano cadastrado com sucesso!');
        this.router.navigate(['/home']); 
      },
      error: err => {
        console.error('Erro ao cadastrar plano:', err);
        alert('Erro ao cadastrar o plano.');
      }
    });
}

  onSubmit(): void {
  if (this.formulario.valid) {
    this.cadastrarPlanos();
  }
}

}
