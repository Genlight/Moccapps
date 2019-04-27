import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarextensionComponent } from './toolbarextension.component';

describe('ToolbarextensionComponent', () => {
  let component: ToolbarextensionComponent;
  let fixture: ComponentFixture<ToolbarextensionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolbarextensionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarextensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
