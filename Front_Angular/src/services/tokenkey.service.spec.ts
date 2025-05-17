import { TestBed } from '@angular/core/testing';

import { TokenkeyService } from '../../services/tokenkey.service';

describe('TokenkeyService', () => {
  let service: TokenkeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenkeyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
