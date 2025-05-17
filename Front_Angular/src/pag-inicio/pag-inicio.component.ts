import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { NgIf } from '@angular/common';
import { Route } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-pag-inicio',
  standalone: true,
  imports: [NgFor,NgIf],
  templateUrl: './pag-inicio.component.html',
  styleUrl: './pag-inicio.component.css'
})
export class PagInicioComponent {


  constructor(private router: Router) {}
  cursos = [
    {
      nome: 'CLP para Iniciantes',
      duracao: '2 horas',
      avaliacao: 5.0,
      imagem: 'assets/clp.jpg'
    },
    {
      nome: 'IHM para Iniciantes',
      duracao: '2 horas',
      avaliacao: 5.0,
      imagem: 'assets/ihm.jpg'
    },
    {
      nome: 'Inversor de Frequência para Iniciantes',
      duracao: '2 horas',
      avaliacao: 5.0,
      imagem: 'assets/inversor.jpg'
    },
    {
      nome: 'Servo Acionamento para Iniciantes',
      duracao: '2 horas',
      avaliacao: 5.0,
      imagem: 'assets/servo.jpg'
    },
    {
      nome: 'Dispositivos de Baixa Tensão para Iniciantes',
      duracao: '2 horas',
      avaliacao: 5.0,
      imagem: 'assets/baixa.jpg'
    },
    {
      nome: 'Gerenciamento e Medição de Energia para Iniciantes',
      duracao: '2 horas',
      avaliacao: 5.0,
      imagem: 'assets/energia.jpg'
    }
  ];


  planos = [
    {
      nome: 'Plano Básico',
      publico: 'Para você',
      icone: '👤 Individual',
      preco: 'A partir de R$39,99/mês',
      botao: 'Solicitar',
      beneficios: [
        'Acesso diversos cursos conceituados',
        'Preparação para certificação',
        'Roteiros de práticas',
        'avaliações de aprendizagens',
        'Grupos de whatsapp fechados'
      ]
    },
    {
      nome: 'Plano Empreendedor',
      publico: 'Para Empreendedor',
      icone: '👤 Individual',
      preco: 'R$100,00/mês por usuário',
      botao: 'Solicitar',
      beneficios: [
        'Acesso diversos cursos conceituados',
        'Preparação para certificação',
        'Roteiros de práticos',
        'avaliações de aprendizagens',
        'mentorias online',
        'acesso aos eventos promovidos pela plataforma',
        'cursos de capacitação de forma gratuita',
        'Relatórios de análise'
      ]
    },
    {
      nome: 'Plano Startup',
      publico: 'Para startup',
      icone: '🏢 ate 5 pessoas',
      contato: 'Entre em contato com a equipe de vendas',
      botao: 'Solicitar',
      beneficios: [
        'Acesso diversos cursos conceituados',
        'Preparação para certificação',
        'Roteiros de práticos',
        'avaliações de aprendizagens',
        'mentorias online com professores especialistas',
        'acesso aos eventos promovidos pela plataforma',
        'cursos de capacitação de forma gratuita',
        'Relatórios de análise',
        'Participação em modelagem de negócios',
        'encubação e aceleração dos empreendimentos com opção de parceria',
        'acompanhamento pelos especialistas',
        'recebimento de feedbacks constantes do negócio e das oportunidades'
      ]
    }
  ];


  faqs = [
    {
      pergunta: 'Para quem é a EADCursos.com ?',
      resposta: 'A EADCursos.com é para pessoas interessadas em aprender tecnologia, programação, design, negócios e muito mais.',
      aberto: false
    },
    {
      pergunta: 'Quais são as formas de pagamento?',
      resposta: 'Você pode pagar com cartão de crédito,débito, boleto ou Pix, dependendo da oferta.',
      aberto: false
    },
    {
      pergunta: 'Não gostei, posso cancelar?',
      resposta: 'Sim! Você pode cancelar dentro do prazo de garantia ou conforme os termos do plano.',
      aberto: false
    },
    {
      pergunta: 'Ainda tenho dúvidas, como faço?',
      resposta: 'Você pode entrar em contato com nosso suporte através do e-mail ou chat no site.',
      aberto: false
    }
  ];

  toggleFaq(index: number) {
    this.faqs[index].aberto = !this.faqs[index].aberto;
  }


  testimonials = [
    {
      nome: 'Anderson Henrique Santos',
      texto: 'Ótimo treinamento, muito bem explicado',
      nota: 4
    },
    {
      nome: 'Bruno Yada',
      texto: 'Ótimo treinamento',
      nota: 5
    },
    {
      nome: 'ADRIANO SILVEIRA DE SOUZA',
      texto: 'bom',
      nota: 5
    }
  ];

  currentIndex = 0;

  previous() {
    this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
  }


  entrar(){

    this.router.navigate(['/entrar']);
    

  }

  cadastro(){
      this.router.navigate(['/cadastro']);

  }

verTodos(){
    this.router.navigate(['/todosCursos']);

}

}
