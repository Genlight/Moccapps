import { TestBed } from '@angular/core/testing';

import { FabricmodifyService } from './fabricmodify.service';

describe('FabricserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FabricmodifyService = TestBed.get(FabricmodifyService);
    expect(service).toBeTruthy();
  });
});
