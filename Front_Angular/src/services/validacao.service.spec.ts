import { TestBed } from '@angular/core/testing';

import { ValidacaoService } from '../services/validacao.service';

describe('ValidacaoService', () => {
  let service: ValidacaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidacaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
