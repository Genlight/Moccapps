package ase.tests;

import ase.DTO.Project;
import ase.service.ProjectService;
import ase.service.impl.ProjectServiceImpl;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static org.junit.Assert.fail;
import static org.junit.jupiter.api.Assertions.assertEquals;
/**
 * @author Matthias Deimel
 */
@Ignore //does not work because the project service gets mocked for other testcases
public class ProjectServiceTest extends AbstractDAOTest{

    @Autowired
    ProjectService projectService;

    @Test
    public void createValidProject(){
        assertEquals(true,projectService.createProject(testData.project3));
    }

    @Test
    public void updateValidProject(){
        assertEquals(true,projectService.updateProject(testData.createdProject1));
    }

    @Test
    public void deleteValidProject(){
        assertEquals(true,projectService.deleteProject(2));
    }

    @Test
    public void findProjectByUserId(){
        List<Project> projects=projectService.findProjectByUserId(2);
        if(!(projects.contains(testData.createdProject1)&&projects.contains(testData.createdProject2))){
            fail();
        }
    }
}
