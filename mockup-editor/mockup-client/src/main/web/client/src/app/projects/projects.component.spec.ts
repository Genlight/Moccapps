import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectsComponent } from './projects.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CreateProjectModalComponent } from './create-project-modal/create-project-modal.component';
import { CollaboratorPipe } from '../shared/pipes/collaborator.pipe';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ProjectsComponent,
        FaIconComponent,
        CreateProjectModalComponent,
        CollaboratorPipe
      ],
      imports: [
        FormsModule,
        RouterTestingModule,
        HttpClientModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
