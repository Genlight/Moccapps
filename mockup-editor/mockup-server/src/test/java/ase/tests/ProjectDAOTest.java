package ase.tests;

import ase.DAO.DAOException;
import ase.DAO.ProjectDAO;
import ase.DAO.UserDAO;
import ase.DTO.Project;
import ase.springboot.Application;
import org.junit.*;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.SqlGroup;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.testcontainers.containers.PostgreSQLContainer;

import java.util.List;

import static org.junit.Assert.*;

public class ProjectDAOTest extends AbstractDAOTest {

    @Autowired
    private ProjectDAO projectDAO;

    private static final Logger logger = LoggerFactory.getLogger(ProjectDAOTest.class);

    @Test
    public void createProjectWithValidData() throws DAOException {
        Project project=testData.project3;
        Project createdProject=projectDAO.create(project);
        assertEquals("The returned Project has to be equal to the created one", project, createdProject);
        assertEquals("The returned Project has to be the same as the persisted one", createdProject,projectDAO.findById(createdProject.getId()));
     }

    @Test (expected = DAOException.class)
    public void createProjectWithInvalidData() throws DAOException{
    projectDAO.create(null);
    }

    @Test
    public void deleteProjectWithValidData() throws DAOException{
    assertEquals("The returned Project has to be deleted",true,projectDAO.delete(1));
    assertNull(projectDAO.findById(1));
    }

    @Test(expected = DAOException.class)
    public void deleteProjectWithInvalidData() throws DAOException{
        projectDAO.delete(-1);
    }

    @Test
    public void findProjectByIdWithValidData() throws DAOException{
        assertEquals("The returned Project equals the one provided by the id",testData.createdProject1,projectDAO.findById(1));
    }

    @Test
    public void findAllProjects() throws DAOException{
        List<Project> projects=projectDAO.findAll();
        for(Project project: projects){
            logger.info(project.toString());
        }
        if(!(projects.contains(testData.createdProject1)&&projects.contains(testData.createdProject2))){
            fail();
        }
    }
}
