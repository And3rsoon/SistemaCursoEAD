import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-todos-cursos',
  standalone: true,
  imports: [NgFor,NgIf],
  templateUrl: './todos-cursos.component.html',
  styleUrl: './todos-cursos.component.css'
})
export class TodosCursosComponent {
    cursos = [
    {
      nome: 'Curso de Autismo',
      imagem: 'assets/autismo.jpg',
      horario: 'De 10h a 18h',
      acesso: 'Acesso Gratuito',
      estrelas: 5
    },
    {
      nome: 'Curso de Chefia e Liderança',
      imagem: 'assets/lideranca.jpg',
      horario: 'De 10h a 18h',
      acesso: 'Acesso Gratuito',
      estrelas: 5
    },
    {
      nome: 'Curso de Informática Básica',
      imagem: 'assets/informatica.jpg',
      horario: 'De 10h a 18h',
      acesso: 'Acesso Gratuito',
      estrelas: 5
    },
    // Adicione mais cursos conforme necessário
  ];

  categorias = [
    { nome: 'Todos Cursos', quantidade: 311 },
    { nome: 'Administração', quantidade: 28 },
    { nome: 'Artes', quantidade: 4 },
    { nome: 'Assistência Social', quantidade: 7 },
    { nome: 'Biologia', quantidade: 4 },
    { nome: 'Comunicação e Marketing', quantidade: 5 },
    { nome: 'Direito', quantidade: 7 },
    { nome: 'Economia e Finanças', quantidade: 5 },
    { nome: 'Educação', quantidade: 32 },
    { nome: 'Esporte', quantidade: 5 },
    { nome: 'Estética', quantidade: 9 },
    { nome: 'Farmácia', quantidade: 4 },
    { nome: 'Idiomas', quantidade: 4 },
    { nome: 'Indústria e Construção', quantidade: 31 },
    { nome: 'Informática e TI', quantidade: 15 }
  ];

}
