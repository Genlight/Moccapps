import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProjectModalComponent } from './create-project-modal.component';
import { FormsModule } from '@angular/forms';

describe('CreateProjectModalComponent', () => {
  let component: CreateProjectModalComponent;
  let fixture: ComponentFixture<CreateProjectModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateProjectModalComponent ],
      imports: [
        FormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProjectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
