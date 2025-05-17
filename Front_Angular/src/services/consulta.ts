import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class consultaService {

  constructor(private http: HttpClient) { }


verificarUsuario(cpf: string, email: string): Observable<any> {
  return this.http.post<any>('http://localhost:3000/api/verificar-usuario', { cpf, email });
}

getPlanos(): Observable<{ [key: string]: { valor: number; duracao: number } }> {
  return this.http.get<{ [key: string]: { valor: number; duracao: number } }>('http://localhost:3000/api/buscar-planos');
}



  //-------------------------------------------------------------------

  buscarAulasPorAluno(idAluno: number, token: string): Observable<any> {
    const headers = new HttpHeaders()
      .set('Authorization', `${token}`)
      .set('Content-Type', 'application/json');
  
    const url = `http://localhost:3000/api/aulas-por-aluno/${idAluno}`;
    return this.http.get<any>(url, { headers });
  }

  cadastrarAluno(dadosAluno: any): Observable<any> { // Agora recebe os valores do form
    return this.http.post('http://localhost:3000/api/aluno', dadosAluno);
  }

cadastrarFuncionario(dadosFuncionario: any): Observable<any> {
  return this.http.post('http://localhost:3000/api/funcionario', dadosFuncionario);
}

cadastrarCurso(dadosCurso: any): Observable<any> {
  return this.http.post('http://localhost:3000/api/curso', dadosCurso);
}

cadastrarMateria(dados: any): Observable<any> {
  return this.http.post('http://localhost:3000/api/cadastrarMateria', dados);
}

cadastrarAula(dados: any): Observable<any> {
  return this.http.post('http://localhost:3000/api/aula', dados);
}


cadastrarTurma(dadosTurma: any): Observable<any> {
  return this.http.post('http://localhost:3000/api/turma', dadosTurma);
}


cadastrarHorario(dados: any): Observable<any> {
  return this.http.post('http://localhost:3000/api/horario', dados);
}

getDataFimAula(idAula: number): Observable<any> {
  return this.http.get(`http://localhost:3000/api/aula/${idAula}/data-fim`);
}

getNomeMateriaPorId(id: number) {
  return this.http.get<any>(`http://localhost:3000/materia/nome/${id}`);
}

getNomeAlunoPorId(id: number) {
  return this.http.get<any>(`http://localhost:3000/aluno/nome/${id}`);
}

cadastrarMateriaMatriculada(data: any) {
  return this.http.post<any>(`http://localhost:3000/matricula`, data);
}

getCursos(): Observable<any[]> {
  return this.http.get<any[]>('http://localhost:3000/api/buscarcursos');
}

gerarPdf(data: any): Observable<Blob> {
  return this.http.post('http://localhost:3000/api/gerar-pdf', data, { responseType: 'blob' });
}

getTurmas() {
  return this.http.get<any[]>('http://localhost:3000/api/turmas'); // Endpoint para buscar turmas
}

getProfessores() {
  return this.http.get<any[]>('http://localhost:3000/api/professores'); // Endpoint para buscar usuários com role professor e status ativo
}
getMaterias() {
  return this.http.get<any[]>('http://localhost:3000/api/materias'); // Endpoint para buscar matérias
}

getAulasPorProfessor(id: string) {
  return this.http.get<any[]>(`http://localhost:3000/aulas/professor/${id}`);
}
cadastrarAviso(dados: any) {
  return this.http.post('http://localhost:3000/cadAviso', dados);
}
}
