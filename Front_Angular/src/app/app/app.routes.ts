import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainFormComponent } from '../../main-form/main-form.component';
import { HomeComponent } from '../../home/home.component';
import { authGuard } from './authGuard';
import { guardValidation } from './guardValidation';
import { PagInicioComponent } from '../../pag-inicio/pag-inicio.component';
import { TodosCursosComponent } from '../../todos-cursos/todos-cursos.component';
import { CadastroClienteComponent } from '../../cadastro-cliente/cadastro-cliente.component';
import { CadastroCliente02Component } from '../../cadastro-cliente02/cadastro-cliente02.component';
import { InicioCursosComponent } from '../../inicio-cursos/inicio-cursos.component';

export const routes: Routes = [

  
  { path: '', redirectTo: 'begining', pathMatch: 'full' },
  { path: 'begining', component: PagInicioComponent},
  { path: 'entrar', component: MainFormComponent},
  { path: 'cadastro', component: CadastroClienteComponent},
  { path: 'cadastro2', component: CadastroCliente02Component},
  { path: 'todosCursos', component: TodosCursosComponent},
  { path: 'inicio', component: HomeComponent,canActivate:[guardValidation]},
  {path: 'cursos/:idCursos', component: InicioCursosComponent,canActivate:[guardValidation]},
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

