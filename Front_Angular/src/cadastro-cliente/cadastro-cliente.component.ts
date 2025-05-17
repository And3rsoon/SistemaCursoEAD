import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { consultaService } from '../services/consulta';

@Component({
  selector: 'app-cadastro-cliente',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './cadastro-cliente.component.html',
  styleUrl: './cadastro-cliente.component.css'
})
export class CadastroClienteComponent {
  mensagemErro: string = '';
  nome: string = '';
  email: string = '';
  ofertas: boolean = true;
  cpf:string = '';


  
  constructor(private router: Router,private consulta:consultaService) {}

  cadastrar(form: NgForm) {
  if (!form.valid) {
    this.mensagemErro = 'Por favor, preencha todos os campos obrigatórios.';
    return;
  }

  this.consulta.verificarUsuario(this.cpf, this.email).subscribe(res => {
    if (res.existente) {
      this.mensagemErro = 'Usuário com este CPF ou e-mail já existe.';
    } else {
      sessionStorage.setItem('nome',this.nome);
      sessionStorage.setItem('email',this.email);
      sessionStorage.setItem('cpf',this.cpf);
      sessionStorage.setItem('permissao','true');
      this.router.navigate(['/cadastro2']);
    }
  }, err => {
    this.mensagemErro = 'Erro ao verificar usuário.';
    console.error(err);
  });
  }
  entrar(){

    this.router.navigate(['/entrar']);
    this.router.createUrlTree
    

  }

  cadastro(){
      this.router.navigate(['/cadastro']);

  }

}
