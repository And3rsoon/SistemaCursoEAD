import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadSubareasComponent } from './cad-subareas.component';

describe('CadSubareasComponent', () => {
  let component: CadSubareasComponent;
  let fixture: ComponentFixture<CadSubareasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadSubareasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadSubareasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
