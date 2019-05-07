package ase.tests.RESTServiceTests;

import ase.DTO.Invitation;
import ase.message.request.Invitation.InvitationActionForm;
import ase.service.InvitationService;
import ase.springboot.Application;
import ase.springboot.controller.InvitationRESTService;
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
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.testcontainers.shaded.com.fasterxml.jackson.databind.ObjectMapper;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ContextConfiguration(classes = {InvitationRESTServiceTest.Config.class})
@RunWith(SpringJUnit4ClassRunner.class)
@ActiveProfiles("test")
@WebMvcTest(InvitationRESTService.class)
@AutoConfigureMockMvc(secure = false)
@WebAppConfiguration
public class InvitationRESTServiceTest {

    private static TestData testData;
    @Autowired
    private MockMvc mvc;
    @Autowired
    private InvitationService invitationService;

    @Autowired
    private InvitationRESTService invitationRESTService;

    @BeforeClass
    public static void setupTestData() {
        testData = new TestData();
        testData.init();
    }

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        this.mvc = MockMvcBuilders.standaloneSetup(invitationRESTService).build();
    }

    @Test
    public void deleteValidInvitation() throws Exception {
        given(invitationService.delete(testData.createdInvitation1)).willReturn(true);
        given(invitationService.getInvitationById(testData.createdInvitation1.getId())).willReturn(testData.createdInvitation1);


        mvc.perform(delete("/project/invite/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("{\"message\":\"success\"}"));
    }

    @Test
    public void updateValidInvitation() throws Exception {
        Invitation invitation = testData.createdInvitation1;
        given(invitationService.getInvitationById(testData.createdInvitation1.getId())).willReturn(testData.createdInvitation1);

        ObjectMapper objectMapper = new ObjectMapper();
        InvitationActionForm actionForm = new InvitationActionForm(invitation.getId(), "accept");
        String json = objectMapper.writeValueAsString(actionForm);

        given(invitationService.acceptInvitation(invitation)).willReturn(true);

        mvc.perform(put("/project/invite/1")
                .content(json)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("{\"message\":\"Success\"}"));

    }

/*
    @Test
    public void createInvitation() throws Exception {
        Invitation invitation = testData.createdInvitation1;
        given(invitationService.getInvitationById(testData.createdInvitation1.getId())).willReturn(testData.createdInvitation1);

        List<String> userEmailList = new ArrayList<>();
        userEmailList.add(testData.user3.getEmail());
        userEmailList.add(testData.createdUser2.getEmail());


        InvitationForm invitationForm = new InvitationForm(invitation.getProject_id(), userEmailList);

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(invitationForm);

        given(invitationService.create(invitationForm)).willReturn(true);

        mvc.perform(post("/project/invite")
                .content(json)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("{\"message\":\"Success\"}"));

    }*/
    /*

    @Test
    public void createValidProject() throws Exception{
        Project project=testData.project3;
        ObjectMapper objectMapper=new ObjectMapper();

        List<User> userList=new ArrayList<>();
        userList.add(testData.createdUser1);
        userList.add(testData.createdUser2);

        ProjectForm projectForm=new ProjectForm();
        projectForm.setProjectname(project.getProjectname());
        projectForm.setUsers(userList);
        String json=objectMapper.writeValueAsString(projectForm);

        given(projectService.createProject(project)).willReturn(true);

        mvc.perform(post("/project")
                .content(json)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("{\"message\":\"success\"}"));
    }*/

    @Configuration
    @Import(Application.class)
    protected static class Config {

        @Bean
        @Primary
        public InvitationService invitationService() {
            return Mockito.mock(InvitationService.class);
        }

    }


}
