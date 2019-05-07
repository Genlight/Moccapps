package ase.tests.RESTServiceTests;

import ase.DTO.Project;
import ase.DTO.User;
import ase.Security.UserDetails;
import ase.message.request.Invitation.InvitationForm;
import ase.message.request.ProjectForm;
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
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.testcontainers.shaded.com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


/**
 * @author Matthias Deimel
 */
@ContextConfiguration(classes = Application.class)
@RunWith(SpringJUnit4ClassRunner.class)
@ActiveProfiles("test")
@WebMvcTest(ProjectRESTService.class)
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

    @Test
    public void updateValidProject()throws Exception{
        Project project=testData.createdProject1;
        ObjectMapper objectMapper=new ObjectMapper();

        List<User> userList=new ArrayList<>();
        userList.add(testData.createdUser1);
        userList.add(testData.createdUser2);

        ProjectForm projectForm=new ProjectForm();
        projectForm.setId(project.getId());
        projectForm.setProjectname(project.getProjectname());
        projectForm.setUsers(userList);
        String json=objectMapper.writeValueAsString(projectForm);

        given(projectService.updateProject(project)).willReturn(true);

        mvc.perform(put("/project/1")
            .content(json)
            .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("{\"message\":\"success\"}"));

    }

    //TODO: TEST IF THIS WORKS AFTER MERGE
    @Test
    public void createValidProject() throws Exception{
  /**      UserDetails userDetails = new UserDetails(1, testData.createdUser1.getEmail(), testData.createdUser1.getPassword());
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, "");

        SecurityContextHolder.getContext().setAuthentication(auth);


        Project project=testData.project3;
        project.setId(3);
        ObjectMapper objectMapper=new ObjectMapper();

        List<User> userList=new ArrayList<>();
        userList.add(testData.createdUser1);
        userList.add(testData.createdUser2);

        List<String> userEmailList = new ArrayList<>();
        userEmailList.add(testData.createdUser1.getEmail());
        userEmailList.add(testData.createdUser2.getEmail());


        ProjectForm projectForm=new ProjectForm();
        projectForm.setProjectname(project.getProjectname());
        projectForm.setUsers(userList);
        projectForm.setInvitations(userEmailList);
        String json=objectMapper.writeValueAsString(projectForm);


        InvitationForm invitationForm = new InvitationForm();
        invitationForm.setProjectID(project.getId());
        invitationForm.setInvitorID(userDetails.getUsername());
        invitationForm.setInviteeEmailList(projectForm.getInvitations());

        given(projectService.createProject(project)).willReturn(project);
        given(invitationService.create(invitationForm)).willReturn(true);

        mvc.perform(post("/project")
                .content(json)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("{\"message\":\"success\"}"));*/

    }

    @TestConfiguration
    protected static class Config {

        @Bean
        public ProjectService projectService() {
            return Mockito.mock(ProjectService.class);
        }

        @Bean
        public InvitationService inviteService() {
            return Mockito.mock(InvitationService.class);
        }

    }
}
