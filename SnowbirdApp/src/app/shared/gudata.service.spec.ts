import { TestBed } from '@angular/core/testing';

import { GudataService } from './gudata.service';

describe('GudataService', () => {
  let service: GudataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GudataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
