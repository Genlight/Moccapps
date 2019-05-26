import { TestBed } from '@angular/core/testing';

import { ManagePagesService } from './managepages.service';
import { HttpClientModule } from '@angular/common/http';

describe('ManagePagesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule
    ]
  }));

  it('should be created', () => {
    const service: ManagePagesService = TestBed.get(ManagePagesService);
    expect(service).toBeTruthy();
  });
});
