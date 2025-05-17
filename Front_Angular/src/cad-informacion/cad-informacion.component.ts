import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidacaoService } from '../services/validacao.service';
import { consultaService } from '../services/consulta';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-cad-informacion',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './cad-informacion.component.html',
  styleUrl: './cad-informacion.component.css'
})
export class CadInformacionComponent implements OnInit {

  formulario: FormGroup;
  materias: any[] = [];

  constructor(private validacao: ValidacaoService, private consultaService: consultaService) {
    this.formulario = new FormGroup({
      idMateria: new FormControl('', Validators.required),
      dataInicio: new FormControl('', Validators.required),
      dataTermino: new FormControl('', Validators.required),
      aviso: new FormControl('ativo', Validators.required),
      geral: new FormControl(false)
    });
  }

  ngOnInit(): void {
    this.carregarMaterias();
  }

  carregarMaterias() {
    this.consultaService.getMaterias().subscribe({
      next: (res) => {
        this.materias = res;
      },
      error: (err) => {
        console.error('Erro ao carregar matérias:', err);
      }
    });
  }

  onSubmit() {
    if (this.formulario.invalid) return;

    const id_usuario = sessionStorage.getItem('id');
    const form = this.formulario.value;

    const payload = {
      id_usuario: id_usuario,
      idMateria: form.geral ? null : form.idMateria,
      dataInicio: form.dataInicio,
      dataTermino: form.dataTermino,
      aviso: form.aviso,
      geral: form.geral
    };

    this.consultaService.cadastrarAviso(payload).subscribe({
      next: () => alert('Aviso cadastradado com sucesso!'),
      error: () => alert('Erro ao cadastrar Aviso')
    });
  }

  toggleGeral() {
    const geral = this.formulario.get('geral')?.value;
    if (geral) {
      this.formulario.get('idMateria')?.disable();
    } else {
      this.formulario.get('idMateria')?.enable();
    }
  }
}