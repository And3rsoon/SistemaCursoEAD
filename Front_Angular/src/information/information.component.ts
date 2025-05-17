import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidacaoService } from '../services/validacao.service';
import { consultaService } from '../services/consulta';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-information',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './information.component.html',
  styleUrl: './information.component.css'
})
export class InformationComponent {

  formulario: FormGroup;

  constructor(private validacao: ValidacaoService, private consultaService: consultaService) { 
    this.formulario = new FormGroup({
      idMateria: new FormControl('', Validators.required),
      dataInicio: new FormControl('', Validators.required),
      dataTermino: new FormControl('', Validators.required),
      aviso: new FormControl('Validators.maxLength(8)')
    });
  }

  onSubmit() {
    if (this.formulario.valid) {
      // Pegando todos os valores do formulário
     
  
     
     
    }
  }



}
