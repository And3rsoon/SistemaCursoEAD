import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadAreaComponent } from './cad-area.component';

describe('CadAreaComponent', () => {
  let component: CadAreaComponent;
  let fixture: ComponentFixture<CadAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadAreaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
