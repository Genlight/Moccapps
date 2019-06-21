package ase.tests.RESTServiceTests;

import ase.DTO.Comment;
import ase.service.CommentService;
import ase.service.InvitationService;
import ase.springboot.Application;
import ase.springboot.controller.CommentRESTService;
import ase.springboot.controller.InvitationRESTService;
import ase.tests.TestData;
import com.fasterxml.jackson.databind.ObjectMapper;
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

import java.util.ArrayList;
import java.util.Arrays;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ContextConfiguration(classes = {CommentRESTServiceTest.Config.class})
@RunWith(SpringJUnit4ClassRunner.class)
@ActiveProfiles("test")
@WebMvcTest(CommentRESTServiceTest.class)
@AutoConfigureMockMvc(secure = false)
@WebAppConfiguration
public class CommentRESTServiceTest {

    private static TestData testData;
    @Autowired
    private MockMvc mvc;
    @Autowired
    private CommentService commentService;

    @Autowired
    private CommentRESTService commentRESTService;

    @BeforeClass
    public static void setupTestData() {
        testData = new TestData();
        testData.init();
    }

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        this.mvc = MockMvcBuilders.standaloneSetup(commentRESTService).build();
    }

    @Test
    public void getCommentsForValidPage() throws Exception {
        Comment comment = testData.createdComment1;
        given(commentService.findCommentsForPage(comment.getPage_id())).willReturn(new ArrayList<>(Arrays.asList(comment)));

        ArrayList<Comment> temp = new ArrayList<>();
        temp.add(comment);
        ObjectMapper objectMapper1 = new ObjectMapper();
        String json = objectMapper1.writeValueAsString(temp);

        mvc.perform(get("/page/"+comment.getPage_id()+"/comments")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string(json));

    }

    @Configuration
    @Import(Application.class)
    protected static class Config {

        @Bean
        @Primary
        public CommentService commentService() {
            return Mockito.mock(CommentService.class);
        }

    }
}
