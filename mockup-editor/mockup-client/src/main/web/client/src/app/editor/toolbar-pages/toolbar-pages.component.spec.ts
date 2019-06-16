import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarPagesComponent } from './toolbar-pages.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { PageListItemComponent } from './page-list-item/page-list-item.component';

describe('ToolbarPagesComponent', () => {
  let component: ToolbarPagesComponent;
  let fixture: ComponentFixture<ToolbarPagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolbarPagesComponent, FaIconComponent, PageListItemComponent ],
      imports: [ HttpClientModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
