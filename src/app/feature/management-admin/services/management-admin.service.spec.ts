import { TestBed } from '@angular/core/testing';

import { ManagementAdminService } from './management-admin.service';

describe('ManagementAdminService', () => {
  let service: ManagementAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagementAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
