import { TestBed } from '@angular/core/testing';

import { FabricserviceService } from './fabricmodify.service';

describe('FabricserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FabricserviceService = TestBed.get(FabricserviceService);
    expect(service).toBeTruthy();
  });
});
