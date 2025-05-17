import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgIf } from '@angular/common';
import { NgFor } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Router } from '@angular/router';
import { consultaService } from '../services/consulta';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-cadastro-cliente02',
  standalone: true,
  imports: [HttpClientModule,FormsModule,NgIf,NgFor,NgxMaskDirective,CommonModule],
  providers: [provideNgxMask()],
  templateUrl: './cadastro-cliente02.component.html',
  styleUrl: './cadastro-cliente02.component.css'
})
export class CadastroCliente02Component implements OnInit{



planos: { [key: string]: { valor: number; duracao: number } } = {};
cliente = {
  nome: sessionStorage.getItem('nome'),
  dataNascimento: '',
  email: sessionStorage.getItem('email'),
  telefone: '',
  cpf: sessionStorage.getItem('cpf'),
  senha:'',
  confirmSenha:'',
  cep: '',
  rua: '',
  bairro: '',
  cidade: '',
  estado: '',
  numero: '',
  formaPagamento: '',
  parcelas: '',
  nomeTitular: '',
  numeroCartao: '',
  codSeguranca: '',
  validade: '',
  cpfTitular: '',
  plano:'',
};


  formasPagamento: string[] = ['Débito', 'Crédito', 'Boleto', 'Pix'];
  parcelas: number[] = Array.from({ length: 12 }, (_, i) => i + 1);

  constructor(private http: HttpClient,private router: Router,private consulta:consultaService) {}
  
  ngOnInit(): void {
      if(sessionStorage.getItem('permissao')!='true'){
            alert("Não é possível acessar essa página diretamente!");
            this.router.navigate(['/cadastro']);


      }

      this.consulta.getPlanos().subscribe({
    next: (dados) => {
      this.planos = dados;
    },
    error: (err) => {
      console.error('Erro ao carregar os planos:', err);
    }
  });
  }
 

  

  buscarCep() {
    const cep = this.cliente.cep.replace(/\D/g, '');
    if (cep.length !== 8) return;

    this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).subscribe(
      data => {
        if (data.erro) {
          alert('CEP não encontrado.');
          return;
        }

        this.cliente.rua = data.logradouro;
        this.cliente.bairro = data.bairro;
        this.cliente.cidade = data.localidade;
        this.cliente.estado = data.uf;
      },
      error => {
        alert('Erro ao buscar CEP.');
      }
    );
  }

  verificarFormaPagamento() {
  if (this.cliente.formaPagamento !== 'Crédito') {
    this.cliente.parcelas = '1';
  }
}

  cadastrarCliente() {
    this.http.post('http://localhost:3000/cadastrar-cliente', this.cliente)
    .subscribe({
      next: () => {
        alert('Cadastro realizado com sucesso!');
        this.router.navigate(['/entrar']);
      },
      error: err => {
        console.error('Erro ao cadastrar:', err);
        alert('Erro ao cadastrar o cliente.');
      }
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
