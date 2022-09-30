import { TestBed } from '@angular/core/testing';

import { UdataService } from './udata.service';

describe('UdataService', () => {
    let service: UdataService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(UdataService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
