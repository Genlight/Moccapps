import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizepanelComponent } from './customizepanel.component';

describe('CustomizepanelComponent', () => {
  let component: CustomizepanelComponent;
  let fixture: ComponentFixture<CustomizepanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomizepanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizepanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
