import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidacaoService } from '../services/validacao.service';
import { consultaService } from '../services/consulta';
@Component({
  selector: 'app-cad-turma',
  standalone: true,
  imports: [],
  templateUrl: './cad-turma.component.html',
  styleUrl: './cad-turma.component.css'
})
export class CadTurmaComponent {
  formulario: FormGroup;
  mensagem: string = '';

  constructor(
    private validacao: ValidacaoService,
    private consultaService: consultaService
  ) {
    this.formulario = new FormGroup({
      dataInicio: new FormControl('', Validators.required),
      dataTermino: new FormControl('', Validators.required),
      idCurso: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      status: new FormControl('ativo') // valor padrão
    });
  }

  onSubmit() {
    if (this.formulario.valid) {
      this.consultaService.cadastrarTurma(this.formulario.value).subscribe({
        next: (response: any) => {
          this.mensagem = response.message;
          this.formulario.reset();
        },
        error: (error: any) => {
          this.mensagem = 'Erro ao cadastrar turma!';
          console.error('Erro na requisição:', error);
        }
      });
    } else {
      this.mensagem = 'Formulário inválido!';
    }
  }
}