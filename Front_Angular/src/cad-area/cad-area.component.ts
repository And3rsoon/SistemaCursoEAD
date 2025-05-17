import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-cad-area',
  standalone: true,
  imports: [HttpClientModule,FormsModule,NgIf,NgFor,NgxMaskDirective,CommonModule,ReactiveFormsModule,],
  templateUrl: './cad-area.component.html',
  styleUrl: './cad-area.component.css'
})
export class CadAreaComponent {

formulario: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.formulario = this.fb.group({
      nome: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.formulario.valid) {
      this.http.post('http://localhost:3000/api/adicionar-area', this.formulario.value)
        .subscribe({
          next: () => {
            alert('Área adicionada com sucesso!');
            this.router.navigate(['/listar-areas']);
          },
          error: (err) => {
            console.error('Erro ao adicionar área:', err);
            alert('Erro ao adicionar a área.');
          }
        });
    }
  }
}

