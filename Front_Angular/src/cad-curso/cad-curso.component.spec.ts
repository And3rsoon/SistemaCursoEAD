import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadCursoComponent } from './cad-curso.component';

describe('CadCursoComponent', () => {
  let component: CadCursoComponent;
  let fixture: ComponentFixture<CadCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadCursoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
