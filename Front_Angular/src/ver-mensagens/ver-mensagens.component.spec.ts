import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerMensagensComponent } from './ver-mensagens.component';

describe('VerMensagensComponent', () => {
  let component: VerMensagensComponent;
  let fixture: ComponentFixture<VerMensagensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerMensagensComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerMensagensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
