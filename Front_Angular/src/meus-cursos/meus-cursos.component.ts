import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-meus-cursos',
  standalone: true,
  imports: [NgFor],
  templateUrl: './meus-cursos.component.html',
  styleUrl: './meus-cursos.component.css'
})
export class MeusCursosComponent implements OnInit {
  cursosMatriculados: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const idUsuario = sessionStorage.getItem('id');
    if (idUsuario) {
      this.http.get<any[]>(`http://localhost:3000/api/cursos-matriculados/${idUsuario}`)
        .subscribe({
          next: data => this.cursosMatriculados = data,
          error: err => console.error('Erro ao buscar cursos matriculados:', err)
        });
    }
  }

  continuarCurso(idCurso: number): void {
    this.router.navigate(['/cursos', idCurso]);
  }
}