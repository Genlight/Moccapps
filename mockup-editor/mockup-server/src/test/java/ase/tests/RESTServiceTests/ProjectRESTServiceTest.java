package ase.tests.RESTServiceTests;

import ase.service.InvitationService;
import ase.service.ProjectService;
import ase.springboot.Application;
import ase.springboot.controller.ProjectRESTService;
import ase.tests.TestData;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


/**
 * @author Matthias Deimel
 */
@ContextConfiguration(classes = {ProjectRESTServiceTest.Config.class})
@RunWith(SpringJUnit4ClassRunner.class)
@ActiveProfiles("test")
@WebMvcTest(ProjectRESTServiceTest.class)
@AutoConfigureMockMvc(secure = false)
@WebAppConfiguration
public class ProjectRESTServiceTest {
    @Autowired
    private MockMvc mvc;
    private static TestData testData;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private InvitationService invitationService;

    @Autowired
    private ProjectRESTService projectRESTService;

    @BeforeClass
    public static void setupTestData() {
        testData = new TestData();
        testData.init();
    }

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        this.mvc = MockMvcBuilders.standaloneSetup(projectRESTService).build();
    }

    @Test
    public void deleteValidProject() throws Exception{

        given(projectService.deleteProject(1)).willReturn(true);

        mvc.perform(delete("/project/1"))
            .andExpect(status().isOk())
            .andExpect(content().string("{\"message\":\"success\"}"));
    }

    @Configuration
    @Import(Application.class)
    protected static class Config {

        @Bean
        @Primary
        public ProjectService projectService() {
            return Mockito.mock(ProjectService.class);
        }

        @Bean
        public InvitationService inviteService() {
            return Mockito.mock(InvitationService.class);
        }

    }
}
