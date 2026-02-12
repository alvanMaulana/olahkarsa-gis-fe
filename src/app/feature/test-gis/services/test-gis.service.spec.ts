import { TestBed } from '@angular/core/testing';

import { TestGisService } from './test-gis.service';

describe('TestGisService', () => {
  let service: TestGisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestGisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
