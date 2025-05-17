import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadInformacionComponent } from './cad-informacion.component';

describe('CadInformacionComponent', () => {
  let component: CadInformacionComponent;
  let fixture: ComponentFixture<CadInformacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadInformacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadInformacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
