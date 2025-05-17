import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadMateriaComponent } from './cad-materia.component';

describe('CadMateriaComponent', () => {
  let component: CadMateriaComponent;
  let fixture: ComponentFixture<CadMateriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadMateriaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadMateriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
