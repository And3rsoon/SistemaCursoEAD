import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { consultaService } from '../services/consulta';

@Component({
  selector: 'app-horario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './horario.component.html',
  styleUrl: './horario.component.css'
})
export class HorarioComponent implements OnInit {
  private service = inject(consultaService);
  turmas: string[] = []; // vai guardar os nomes das turmas
  turmaSelecionada: string = '';

  role: string = '';
  codigo: any = sessionStorage.getItem('id');
  token: string = 'asdasasfass'; 

  data: { 
    [key: string]: { 
      materia: string, 
      hora_inicio: string, 
      hora_termino: string, 
      sala: string, 
      unidade: string 
    }[] 
  } = {};

  currentTime: string = new Date().toLocaleString();
  currentYear: number = new Date().getFullYear();
  sidebarButtons: string[] = ["Página 1", "Página 2", "Página 3", "Página 4", "Página 5"];

  mes: string[] = [
    'janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];
  
  mesSelecionado: string = this.mes[new Date().getMonth()];

  weekDays = this.generateWeekDays();

  ngOnInit(): void {
    this.pesquisar();
  }

  generateWeekDays() {
    let days = [];
    for (let i = 1; i <= 7; i++) {
      const date = new Date(2025, 3, i);
      days.push({ date: date.toLocaleDateString('pt-BR') });
    }
    return days;
  }

  pesquisar() {
    const id = this.codigo;
    this.role = sessionStorage.getItem('role') || '';
  
    if (!id || !this.token) {
      console.warn("ID ou token não informado.");
      return;
    }
  
    if (this.role === 'professor') {
      this.service.getAulasPorProfessor(id).subscribe({
        next: (aulas) => {
          this.data = {};
          this.turmas = []; // limpa antes de popular
          const mesIndex = this.mes.indexOf(this.mesSelecionado);
    
          aulas.forEach((aula: any) => {
            const data = new Date(aula.data_inicio);
            const dataFormatada = data.toLocaleDateString('pt-BR');
    
            //Adiciona turma se ainda não estiver no array
            if (!this.turmas.includes(aula.turma)) {
              this.turmas.push(aula.turma);
            }
    
            // Filtro por mês e por turma (se selecionada)
            if (
              data.getMonth() === mesIndex &&
              (this.turmaSelecionada === '' || aula.turma === this.turmaSelecionada)
            ) {
              if (!this.data[dataFormatada]) {
                this.data[dataFormatada] = [];
              }
    
              this.data[dataFormatada].push({
                materia: aula.materia,
                hora_inicio: aula.hora_inicio || '08:00',
                hora_termino: aula.hora_termino || '10:00',
                sala: aula.sala || 'A1',
                unidade: aula.unidade || 'Unidade Principal'
              });
            }
          });
        },
        error: (err) => {
          console.error("Erro ao buscar aulas do professor:", err);
        }
      });
    } else {
      this.service.buscarAulasPorAluno(id, this.token).subscribe({
        next: (aulas) => {
          this.data = {};
          const mesIndex = this.mes.indexOf(this.mesSelecionado);
  
          aulas.forEach((aula: any) => {
            const data = new Date(aula.data);
            const dataFormatada = data.toLocaleDateString('pt-BR');
  
            if (data.getMonth() === mesIndex) {
              if (!this.data[dataFormatada]) {
                this.data[dataFormatada] = [];
              }
  
              this.data[dataFormatada].push({
                materia: aula.materia,
                hora_inicio: aula.hora_inicio,
                hora_termino: aula.hora_termino,
                sala: aula.sala,
                unidade: aula.unidade
              });
            }
          });
        },
        error: (err) => {
          console.error("Erro ao buscar aulas do aluno:", err);
        }
      });
    }
  }

  baixar() {
    this.service.gerarPdf(this.data).subscribe({
      next: (res: Blob) => {
        const blob = new Blob([res], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'horario.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: err => {
        console.error('Erro ao gerar PDF:', err);
      }
    });
  }
}
