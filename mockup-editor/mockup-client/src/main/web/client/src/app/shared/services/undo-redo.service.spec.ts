import { TestBed } from '@angular/core/testing';

import { UndoRedoService } from './undo-redo.service';
import { HttpClientModule } from '@angular/common/http';

describe('UndoRedoService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientModule ]
  }));

  it('should be created', () => {
    const service: UndoRedoService = TestBed.get(UndoRedoService);
    expect(service).toBeTruthy();
  });
});
