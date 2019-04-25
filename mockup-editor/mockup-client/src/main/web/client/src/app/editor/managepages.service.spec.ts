import { TestBed } from '@angular/core/testing';

import { ManagePagesService } from './managepages.service';

describe('ManagePagesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManagePagesService = TestBed.get(ManagePagesService);
    expect(service).toBeTruthy();
  });
});
