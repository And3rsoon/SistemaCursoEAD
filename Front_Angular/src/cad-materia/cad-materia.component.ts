import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidacaoService } from '../services/validacao.service';
import { consultaService } from '../services/consulta';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-cad-materia',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './cad-materia.component.html',
  styleUrl: './cad-materia.component.css'
})
export class CadMateriaComponent {
  formulario: FormGroup;
  mensagem: string = '';

  constructor(private validacao: ValidacaoService, private consultaService: consultaService) { 
    this.formulario = new FormGroup({
      nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
      idCurso: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      cargaHoraria: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      semestre: new FormControl('', Validators.required),
      conteudo: new FormControl('', Validators.required),
    });
  }
  
  onSubmit() {
    if (this.formulario.valid) {
      this.consultaService.cadastrarMateria(this.formulario.value).subscribe({
        next: (response: any) => {
          this.mensagem = response.message;
          this.formulario.reset();
        },
        error: (error: any) => {
          this.mensagem = 'Erro ao cadastrar matéria!';
          console.error('Erro na requisição:', error);
        }
      });
    } else {
      this.mensagem = 'Formulário inválido!';
    }
  }

}
