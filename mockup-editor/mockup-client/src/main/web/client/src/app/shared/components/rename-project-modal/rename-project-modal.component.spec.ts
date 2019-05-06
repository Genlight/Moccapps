import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameProjectModalComponent } from './rename-project-modal.component';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

describe('RenameProjectModalComponent', () => {
  let component: RenameProjectModalComponent;
  let fixture: ComponentFixture<RenameProjectModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenameProjectModalComponent],
      imports: [FormsModule, NgbModule, HttpClientModule],
      providers: [NgbActiveModal]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenameProjectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
