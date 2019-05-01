import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteProjectModalComponent } from './delete-project-modal.component';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HttpClient } from '@angular/common/http';

describe('DeleteProjectModalComponent', () => {
  let component: DeleteProjectModalComponent;
  let fixture: ComponentFixture<DeleteProjectModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        DeleteProjectModalComponent,
      ],
      imports: [
        HttpClientModule,
        NgbModule
      ],
      providers: [
        NgbActiveModal
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteProjectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
