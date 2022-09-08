import { TestBed } from '@angular/core/testing';

import { CpdataService } from './cpdata.service';

describe('CpdataService', () => {
  let service: CpdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CpdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
