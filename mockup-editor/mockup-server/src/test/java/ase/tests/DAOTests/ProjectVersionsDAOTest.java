package ase.tests.DAOTests;

import ase.DAO.DAOException;
import ase.DAO.ProjectVersionDAO;
import ase.DTO.Project;
import ase.DTO.ProjectVersion;
import org.junit.Assert;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;

public class ProjectVersionsDAOTest extends AbstractDAOTest {

    @Autowired
    private ProjectVersionDAO projectVersionDAO;

    private static final Logger logger = LoggerFactory.getLogger(ProjectVersionsDAOTest.class);

    @Test
    public void createProjectVersionWithValidData() throws DAOException {
        Project project=testData.createdProject2;
        ProjectVersion createdProject= projectVersionDAO.create(project,testData.projectVersion2.getVersionName());
        ProjectVersion projectVersion1 = new ProjectVersion();
        projectVersion1.setId(2);
        projectVersion1.setProjectId(project.getId());
        projectVersion1.setVersionName(testData.projectVersion2.getVersionName());
        projectVersion1.setLastModified(testData.createdProject2.getLastModified());
        assertEquals("The returned Project has to be equal to the created one", projectVersion1, createdProject);
     }

    @Test (expected = DAOException.class)
    public void createProjectVersionWithInvalidData() throws DAOException{
    projectVersionDAO.create(null,null);
    }

    @Test
    public void deleteProjectVersionWithValidData() throws DAOException{
    assertEquals("The returned Project has to be deleted",true, projectVersionDAO.delete(1));
    assertNull(projectVersionDAO.findById(1));
    }

    @Test(expected = DAOException.class)
    public void deleteProjectVersionWithInvalidData() throws DAOException{
        projectVersionDAO.delete(-1);
    }

    @Test
    public void findProjectVersionByIdWithValidData() throws DAOException{
        Assert.assertEquals("The returned Project equals the one provided by the id", testData.createdProjectVersion1, projectVersionDAO.findById(testData.createdProjectVersion1.getId()));
    }

    @Test
    public void findProjectVersionByIdWithUnavailableData() throws DAOException{
        Assert.assertNull(projectVersionDAO.findById(5));
    }

    @Test
    public void findProjectVersionByTagWithValidData() throws DAOException{
        Assert.assertEquals("The returned Project equals the one provided by the id", testData.createdProjectVersion1, projectVersionDAO.findByVersionTag(testData.createdProjectVersion1.getVersionName()));
    }

    @Test
    public void findProjectVersionByProjectIdWithValidData() throws DAOException{
        List<ProjectVersion> projectVersions = new ArrayList<>();
        projectVersions.add(testData.createdProjectVersion1);
        Assert.assertEquals("The returned Project equals the one provided by the id", projectVersions, projectVersionDAO.findByProjectId(testData.createdProjectVersion1.getProjectId()));
    }

    @Test
    public void findAllProjectVersions() throws DAOException{
        List<ProjectVersion> projects= projectVersionDAO.findAll();
        for(ProjectVersion projectVersion: projects){
            logger.info(projectVersion.toString());
        }
        if(!(projects.contains(testData.createdProjectVersion1))){
            fail();
        }
    }
}
