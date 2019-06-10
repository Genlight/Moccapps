import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarGroupsComponent } from './toolbar-groups.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';

describe('ToolbarGroupsComponent', () => {
  let component: ToolbarGroupsComponent;
  let fixture: ComponentFixture<ToolbarGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolbarGroupsComponent, FaIconComponent ],
      imports: [ HttpClientModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
