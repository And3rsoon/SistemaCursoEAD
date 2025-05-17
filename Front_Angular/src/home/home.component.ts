import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TokenkeyService } from '../services/tokenkey.service';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef,ComponentFactoryResolver  } from '@angular/core';
import { HorarioComponent } from '../horario/horario.component';
import { CadastroComponent } from '../cadastro/cadastro.component';
import { CadProfessorComponent } from '../cad-professor/cad-professor.component';
import { CadMateriaComponent } from '../cad-materia/cad-materia.component';
import { ComponentRef } from '@angular/core';
import { InformationComponent } from '../information/information.component';
import { CadAulaComponent } from '../cad-aula/cad-aula.component';
import { CadInformacionComponent } from '../cad-informacion/cad-informacion.component';
import { Input,Output , EventEmitter} from '@angular/core';
import { PlanosComponent } from '../planos/planos.component';
import { GerenciarPlanosComponent } from '../gerenciar-planos/gerenciar-planos.component';
import { CadAreaComponent } from '../cad-area/cad-area.component';
import { CadSubareasComponent } from '../cad-subareas/cad-subareas.component';
import { CadCursoComponent } from '../cad-curso/cad-curso.component';
import { CadAlunoMateriaComponent } from '../cad-aluno-materia/cad-aluno-materia.component';
import { MeusCursosComponent } from '../meus-cursos/meus-cursos.component';
import { InicioCursosComponent } from '../inicio-cursos/inicio-cursos.component';
import { MensagemComponent } from '../mensagem/mensagem.component';
import { VerMensagensComponent } from '../ver-mensagens/ver-mensagens.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,HorarioComponent,CadastroComponent,CadProfessorComponent,CadMateriaComponent,CadAulaComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})


export class HomeComponent  implements OnInit, OnDestroy {

   // Perfil é recebido dinamicamente
   @Output() acaoSelecionada = new EventEmitter<string>();
   @ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;
    user:any='';
    name:any='';


  constructor(private tokenService:TokenkeyService,private route:Router){}

  ngAfterViewInit() {
    const componenteRef: ComponentRef<InformationComponent> = this.container.createComponent(InformationComponent);
  }
  
  ngOnInit(): void {
    this.user=sessionStorage.getItem('role');
    this.name=sessionStorage.getItem('nome');
    // Atualizar a hora a cada segundo
    this.intervalId = setInterval(() => {
      this.currentDateTime = new Date().toLocaleString();
    }, 1000);
  }
  
  ngOnDestroy(): void {
    // Limpa o intervalo ao destruir o componente para evitar vazamento de memória
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  

 

  private intervalId: any;
  title = 'home';
  currentDateTime: string = new Date().toLocaleString();
  rodapercontent='';

  objectKeys = Object.keys;

  
  
 // Mapa de menus por perfil
 buttoms: {
  [key: string]: string[] | { [key: string]: string[] }
} = {
  'aluno': {
    'Perfil': ['Meus Dados'],
    'Cursos': ['matricula', 'Meus Cursos'],
    'Mensagem': ['Mensagens'],

  },
  'professor': {'Cursos':['Meus Cursos','Cadastrar Aula'], 'Mensagem': ['Enviar Mensagem','Mensagens']},
  'Administrador': {
    'Funcionário': ['Cadastrar', 'Histórico'],
    'Cursos': ['Cadastrar Área', 'Cadastrar sub-Área','Cadastrar Curso','Cadastrar Aula'],
    'Mensagem': ['Enviar Mensagem','Mensagens'],
    'Planos':['Cadastrar Plano','Gerenciar Planos'],
    'Relatório': ['Movimentações']
  }
};

getCategorias(): string[] {
  const menu = this.buttoms[this.user];
  return Array.isArray(menu) ? menu : Object.keys(menu);
}

getAcoes(categoria: string): string[] {
  const menu = this.buttoms[this.user];
  if (Array.isArray(menu)) {
    return [];
  }
  return menu[categoria] || [];
}

executarAcao(categoria: string, acao: string) {
  if(categoria==='Cursos'){
    if (acao === 'Cadastrar Área') {
      this.container.clear();
      this.container.createComponent(CadAreaComponent);
    } 
    if (acao === 'Cadastrar sub-Área') {
      this.container.clear();
      this.container.createComponent(CadSubareasComponent);
    }
    
    if (acao === 'Cadastrar Curso') {
      this.container.clear();
      this.container.createComponent(CadCursoComponent);
    }
    if (acao === 'Cadastrar Aula') {
      this.container.clear();
      this.container.createComponent(CadAulaComponent);
    }
     if (acao === 'matricula') {
      this.container.clear();
      this.container.createComponent(CadAlunoMateriaComponent);
    }
    if (acao === 'Meus Cursos') {
      this.container.clear();
      this.container.createComponent(MeusCursosComponent);
    }   
  }

  if(categoria==='Mensagem'){
    if (acao === 'Enviar Mensagem') {
      this.container.clear();
      this.container.createComponent(MensagemComponent);
    } 
    if (acao === 'Mensagens') {
      this.container.clear();
      this.container.createComponent(VerMensagensComponent);
    }   
  }

  if(categoria==='Funcionário'){
      if (acao === 'Cadastrar') {
        this.container.clear();
        this.container.createComponent(CadProfessorComponent);
      }
      if (acao === 'Histórico') {
        this.container.clear();
        this.container.createComponent(InformationComponent);
      }
  } 

  if(categoria==='Planos'){
    if (acao === 'Cadastrar Plano') {
      this.container.clear();
      this.container.createComponent(PlanosComponent);
    }
    if (acao === 'Gerenciar Planos') {
      this.container.clear();
      this.container.createComponent(GerenciarPlanosComponent);
      
    }
  }

  if(categoria==='Relatório'){
    if (acao === 'Movimentações') {
      this.container.clear();
      this.container.createComponent(InformationComponent);
    }
  }


} 
   
logOut(){
          this.tokenService.deleteToken();
          this.route.navigate(['entrar']);
          alert("Logout realizado!");
  }
}

