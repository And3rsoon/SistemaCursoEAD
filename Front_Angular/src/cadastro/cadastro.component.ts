import { Component, output } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidacaoService } from '../services/validacao.service';
import { consultaService } from '../services/consulta';
import { Output,EventEmitter } from '@angular/core';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule], 
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  @Output() botaoClicado = new EventEmitter<void>();
  formulario: FormGroup;
  mensagem: string = '';
  cursos: any[] = [];

  constructor(private validacao: ValidacaoService, private consultaService: consultaService) { 
    this.formulario = new FormGroup({
      nome: new FormControl('', [Validators.minLength(8), Validators.required]),
      idade: new FormControl('', Validators.required),
      user: new FormControl('', [Validators.minLength(8), Validators.required, Validators.maxLength(8)]),
      password: new FormControl('', [Validators.minLength(8), Validators.required, Validators.maxLength(8)]),
      curso_id:  new FormControl(['', Validators.required])
      
    });
  }

  ngOnInit() {

    this.carregarCursos();
  }


  carregarCursos() {
    this.consultaService.getCursos().subscribe({
      next: (data: any[]) => {
        this.cursos = data;
        this.mensagem = 'Cursos carregados com sucesso!';
      },
      error: (error: any) => {
        this.mensagem = 'Erro ao carregar cursos!';
        console.error('Erro na requisição:', error);
      }
    });
  }


  onSubmit() {
    if (this.formulario.valid) {
      this.consultaService.cadastrarAluno(this.formulario.value).subscribe({
        next: (response: any) => {
          this.mensagem = response.message;
          this.formulario.reset();
        },
        error: (error: any) => {
          this.mensagem = 'Erro ao cadastrar aluno!';
          console.error('Erro na requisição:', error);
        }
      });
    } else {
      this.mensagem = 'Formulário inválido!';
    }
  }
}
