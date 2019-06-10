import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVersionModalComponent } from './create-version-modal.component';

describe('CreateVersionModalComponent', () => {
  let component: CreateVersionModalComponent;
  let fixture: ComponentFixture<CreateVersionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateVersionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVersionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
