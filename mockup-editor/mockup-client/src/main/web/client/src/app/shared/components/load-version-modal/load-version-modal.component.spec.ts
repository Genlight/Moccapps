import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadVersionModalComponent } from './load-version-modal.component';

describe('LoadVersionModalComponent', () => {
  let component: LoadVersionModalComponent;
  let fixture: ComponentFixture<LoadVersionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadVersionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadVersionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
