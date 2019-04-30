import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserModalComponent } from './manage-user-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

describe('ManageUserModalComponent', () => {
  let component: ManageUserModalComponent;
  let fixture: ComponentFixture<ManageUserModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ManageUserModalComponent,
        FaIconComponent
      ],
      imports: [
        HttpClientModule,
        FormsModule,
        RouterTestingModule,
        NgbModule
      ],
      providers: [
        NgbActiveModal
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
