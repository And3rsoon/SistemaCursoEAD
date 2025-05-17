import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosCursosComponent } from './todos-cursos.component';

describe('TodosCursosComponent', () => {
  let component: TodosCursosComponent;
  let fixture: ComponentFixture<TodosCursosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodosCursosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TodosCursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
