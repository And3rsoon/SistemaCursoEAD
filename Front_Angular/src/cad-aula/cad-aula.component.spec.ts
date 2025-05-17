import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadAulaComponent } from './cad-aula.component';

describe('CadAulaComponent', () => {
  let component: CadAulaComponent;
  let fixture: ComponentFixture<CadAulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadAulaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadAulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
