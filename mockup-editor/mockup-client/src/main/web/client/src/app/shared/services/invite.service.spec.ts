import { TestBed } from '@angular/core/testing';

import { InviteService } from './invite.service';
import { HttpClientModule } from '@angular/common/http';

describe('InviteService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule]
  }));

  it('should be created', () => {
    const service: InviteService = TestBed.get(InviteService);
    expect(service).toBeTruthy();
  });
});
