import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroCliente02Component } from './cadastro-cliente02.component';

describe('CadastroCliente02Component', () => {
  let component: CadastroCliente02Component;
  let fixture: ComponentFixture<CadastroCliente02Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroCliente02Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadastroCliente02Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
