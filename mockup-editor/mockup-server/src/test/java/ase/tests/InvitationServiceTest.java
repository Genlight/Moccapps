package ase.tests;

import ase.DTO.Invitation;
import ase.message.request.Invitation.InvitationForm;
import ase.service.InvitationService;
import ase.service.impl.InvitationServiceImpl;
import ase.springboot.Application;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.SqlGroup;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;

@RunWith(SpringRunner.class)
@SpringBootTest
@ContextConfiguration(classes = {InvitationServiceTest.Config.class})
@ActiveProfiles("test")
@SqlGroup({
        @Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD, scripts = {"classpath:schema.sql", "classpath:insertTestData.sql"}),
        @Sql(executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD, scripts = "classpath:deleteData.sql")
})
public class InvitationServiceTest {


    private static final Logger logger = LoggerFactory.getLogger(InvitationServiceTest.class);

    @Autowired
    protected static TestData testData;
    @Autowired
    InvitationService invitationService;

    @BeforeClass
    public static void setupTestData() {
        testData = new TestData();
        testData.init();
    }

    @Test
    public void createValidInvitation() {
        assertNotNull(invitationService);
        assertNotNull(testData);

        List<String> userEmailList = new ArrayList<>();
        userEmailList.add(testData.createdUser1.getEmail());
        userEmailList.add(testData.createdUser2.getEmail());

        InvitationForm invitationForm = new InvitationForm(testData.createdProject2.getId(), userEmailList);

        assertEquals(true, invitationService.create(invitationForm, testData.createdUser1.getEmail()));
    }


    @Test
    public void updateCreateInvitation() {
        assertNotNull(invitationService);
        assertNotNull(testData);

        Invitation invitation = testData.invitation2;
        List<String> userEmailList = new ArrayList<>();
        userEmailList.add(testData.createdUser1.getEmail());
        userEmailList.add(testData.createdUser2.getEmail());

        InvitationForm invitationForm = new InvitationForm(invitation.getProject_id(), userEmailList);

        List<Invitation> invitations = invitationService.getAllInvitationsForProject(testData.createdProject2);

        assertEquals(true, invitations.isEmpty());

        assertEquals(true, invitationService.update(invitationForm, testData.createdUser1.getEmail()));

        invitations = invitationService.getAllInvitationsForProject(testData.createdProject2);

        assertEquals(2, invitations.size());
    }

    @Test
    public void updateRemoveInvitation() {
        assertNotNull(invitationService);
        assertNotNull(testData);

        Invitation invitation = testData.invitation2;
        List<String> userEmailList = new ArrayList<>();
        userEmailList.add(testData.createdUser1.getEmail());
        userEmailList.add(testData.createdUser2.getEmail());

        InvitationForm invitationForm = new InvitationForm(invitation.getProject_id(), userEmailList);

        List<Invitation> invitations = invitationService.getAllInvitationsForProject(testData.createdProject2);

        assertEquals(true, invitations.isEmpty());

        assertEquals(true, invitationService.update(invitationForm, testData.createdUser1.getEmail()));

        invitations = invitationService.getAllInvitationsForProject(testData.createdProject2);

        assertEquals(2, invitations.size());

        userEmailList = new ArrayList<>();
        userEmailList.add(testData.createdUser1.getEmail());

        invitationForm = new InvitationForm(invitation.getProject_id(), userEmailList);

        assertEquals(true, invitationService.update(invitationForm, testData.createdUser1.getEmail()));

        invitations = invitationService.getAllInvitationsForProject(testData.createdProject2);

        assertEquals(1, invitations.size());


    }


    @Configuration
    @Import(Application.class)
    protected static class Config {

        @Bean
        @Primary
        public InvitationService invitationService() {
            return new InvitationServiceImpl();
        }

    }

}
