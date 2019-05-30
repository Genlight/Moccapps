package ase.tests.RESTServiceTests;

import ase.DTO.Page;
import ase.message.request.PageForm;
import ase.service.PageService;
import ase.springboot.Application;
import ase.springboot.controller.PageRESTService;
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

import java.util.ArrayList;
import java.util.List;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ContextConfiguration(classes = {PageRESTServiceTest.Config.class})
@RunWith(SpringJUnit4ClassRunner.class)
@ActiveProfiles("test")
@WebMvcTest(PageRESTService.class)
@AutoConfigureMockMvc(secure = false)
@WebAppConfiguration
public class PageRESTServiceTest {

    private static TestData testData;
    @Autowired
    private MockMvc mvc;
    @Autowired
    private PageService pageService;

    @Autowired
    private PageRESTService PageRESTService;

    @BeforeClass
    public static void setupTestData() {
        testData = new TestData();
        testData.init();
    }

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        this.mvc = MockMvcBuilders.standaloneSetup(PageRESTService).build();
    }


    @Test
    public void deleteValidPage() throws Exception {
        given(pageService.delete(testData.createdPage1)).willReturn(true);
        given(pageService.getPageById(testData.createdPage1.getId())).willReturn(testData.createdPage1);


        mvc.perform(delete("/page/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("{\"message\":\"Success\"}"));
    }

    @Test
    public void updateValidInvitation() throws Exception {
        Page page = testData.createdPage1;
        given(pageService.getPageById(testData.createdPage1.getId())).willReturn(testData.createdPage1);

        ObjectMapper objectMapper = new ObjectMapper();
        PageForm pageForm = new PageForm( page.getPage_name(),
                page.getHeight(),
                page.getWidth(),
                page.getPage_order(),page.getProject_id(),page.getPage_data());
        String json = objectMapper.writeValueAsString(pageForm);

        given(pageService.update(page)).willReturn(true);

        mvc.perform(put("/page/1")
                .content(json)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("{\"message\":\"Success\"}"));

    }

    @Test
    public void createValidInvitation() throws Exception {
        Page page = testData.page3;
        page.setId(3);
        given(pageService.create(testData.page3)).willReturn(page);

        ObjectMapper objectMapper = new ObjectMapper();
        PageForm pageForm = new PageForm(
                page.getPage_name(),
                page.getHeight(),
                page.getWidth(),
                page.getPage_order(),page.getProject_id(),page.getPage_data());
        String json = objectMapper.writeValueAsString(pageForm);

        ObjectMapper objectMapper1 = new ObjectMapper();
        String json1 = objectMapper1.writeValueAsString(page);



        mvc.perform(post("/page")
                .content(json)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string(json1));

    }

    @Test
    public void getValidPage() throws Exception {
        Page page = testData.createdPage1;
        given(pageService.getPageById(testData.createdPage1.getId())).willReturn(testData.createdPage1);

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(page);

        mvc.perform(get("/page/1"))
                .andExpect(status().isOk())
                .andExpect(content().string(json));

    }

    @Test
    public void getProjectPages() throws Exception {

        List<Page> pages = new ArrayList<>();
        pages.add(testData.createdPage1);
        pages.add(testData.createdPage2);

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(pages);

        given(pageService.getAllPagesForProject(1)).willReturn(pages);

        mvc.perform(get("/project/1/pages"))
                .andExpect(status().isOk())
                .andExpect(content().string(json));

    }


    @Configuration
    @Import(Application.class)
    protected static class Config {

        @Bean
        @Primary
        public PageService pageService() {
            return Mockito.mock(PageService.class);
        }

    }
}
