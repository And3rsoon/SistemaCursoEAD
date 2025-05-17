import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadAlunoMateriaComponent } from './cad-aluno-materia.component';

describe('CadAlunoMateriaComponent', () => {
  let component: CadAlunoMateriaComponent;
  let fixture: ComponentFixture<CadAlunoMateriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadAlunoMateriaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadAlunoMateriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
