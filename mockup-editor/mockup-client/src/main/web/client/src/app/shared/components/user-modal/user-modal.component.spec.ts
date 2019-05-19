import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModal, NgbModalRef, NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../models/User';
import { UserinfoService } from '../../userinfo.service';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserModalComponent } from './user-modal.component';
import { AuthService } from '../../../auth/auth.service';
import { AuthLogoutInfo } from '../../../auth/logout-info';

describe('UserModalComponent', () => {
  let component: UserModalComponent;
  let fixture: ComponentFixture<UserModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserModalComponent ],
      imports: [ HttpClientModule,
      FormsModule,
      RouterTestingModule,
      NgbModule
    ],
    providers:  [NgbActiveModal, UserinfoService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
