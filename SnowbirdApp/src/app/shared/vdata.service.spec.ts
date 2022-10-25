import { TestBed } from '@angular/core/testing';

import { VdataService } from './vdata.service';

describe('VdataService', () => {
    let service: VdataService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(VdataService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
