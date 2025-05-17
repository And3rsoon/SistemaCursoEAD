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
  templateUrl: './cad-professor.component.html',
  styleUrls: ['./cad-professor.component.css'],
})

export class CadProfessorComponent implements OnInit {
  formulario!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      nome: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.minLength(11)]],
      senha: ['', [Validators.required, Validators.minLength(8)]],
      role: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: [''],
      cep: [''],
      estado: [''],
      cidade: [''],
      bairro: [''],
      rua: [''],
      status: ['ativo']
    });
  }

  buscarEndereco(): void {
    const cep = this.formulario.get('cep')?.value;

    if (cep && cep.length === 8) {
      this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`)
        .subscribe({
          next: (data) => {
            if (data.erro) {
              alert('CEP não encontrado!');
              return;
            }

            this.formulario.patchValue({
              rua: data.logradouro,
              bairro: data.bairro,
              cidade: data.localidade,
              estado: data.uf
            });
          },
          error: (err) => {
            console.error('Erro ao buscar endereço:', err);
            alert('Erro ao buscar endereço.');
          }
        });
    }
  }

  cadastrarFuncionario(): void {
    const funcionario = this.formulario.value;

    this.http.post('http://localhost:3000/cadastrar-funcionario', funcionario)
      .subscribe({
        next: () => {
          alert('Funcionário cadastrado com sucesso!');
          this.router.navigate(['/home']);
        },
        error: err => {
          console.error('Erro ao cadastrar:', err);
          alert('Erro ao cadastrar o funcionário.');
        }
      });
  }

  onSubmit(): void {
    if (this.formulario.valid) {
      this.cadastrarFuncionario();
    }
  }
}
