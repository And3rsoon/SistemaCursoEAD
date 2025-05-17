import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarPlanosComponent } from './gerenciar-planos.component';

describe('GerenciarPlanosComponent', () => {
  let component: GerenciarPlanosComponent;
  let fixture: ComponentFixture<GerenciarPlanosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarPlanosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GerenciarPlanosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
