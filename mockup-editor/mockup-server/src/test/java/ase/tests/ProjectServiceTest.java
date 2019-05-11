package ase.tests;

import ase.DTO.Project;
import ase.service.ProjectService;
import ase.service.impl.ProjectServiceImpl;
import ase.springboot.Application;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.SqlGroup;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.fail;
import static org.junit.jupiter.api.Assertions.assertEquals;
/**
 * @author Matthias Deimel
 */
//@Ignore //does not work because the project service gets mocked for other testcases
@RunWith(SpringRunner.class)
@SpringBootTest
@ContextConfiguration(classes = {ProjectServiceTest.Config.class})
@ActiveProfiles("test")
@SqlGroup({
        @Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD, scripts = {"classpath:schema.sql", "classpath:insertTestData.sql"}),
        @Sql(executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD, scripts = "classpath:deleteData.sql")
})
public class ProjectServiceTest {


    @Autowired
    protected static TestData testData;

    @BeforeClass
    public static void setupTestData() {
        testData = new TestData();
        testData.init();
    }

    @Autowired
    ProjectService projectService;

    @Test
    public void createValidProject(){
        assertNotNull(projectService);
        assertNotNull(testData);
        Project temp = testData.project3;
        temp.setId(3);
        assertEquals(temp, projectService.createProject(testData.project3));
    }

    @Test
    public void deleteValidProject(){
        assertNotNull(projectService.getProjectById(2));
        assertEquals(true,projectService.deleteProject(2));
    }

    @Test
    public void updateValidProject() {
        assertEquals(true, projectService.updateProject(testData.createdProject1));
    }

    @Configuration
    @Import(Application.class)
    protected static class Config {

        @Bean
        public ProjectService projectService() {
            return new ProjectServiceImpl();
        }

    }

    @Test
    public void findProjectByUserId(){
        List<Project> projects=projectService.findProjectByUserId(2);
        if(!(projects.contains(testData.createdProject1)&&projects.contains(testData.createdProject2))){
            fail();
        }
    }
}
