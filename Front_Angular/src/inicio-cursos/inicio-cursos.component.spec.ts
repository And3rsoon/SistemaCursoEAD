import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioCursosComponent } from './inicio-cursos.component';

describe('InicioCursosComponent', () => {
  let component: InicioCursosComponent;
  let fixture: ComponentFixture<InicioCursosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioCursosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InicioCursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
