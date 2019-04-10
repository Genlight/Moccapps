package ase.tests;

import ase.DTO.User;
import ase.service.UserService;
import ase.springboot.Application;
import ase.springboot.controller.RESTService;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ContextConfiguration(classes = Application.class)
@RunWith(SpringJUnit4ClassRunner.class)
@ActiveProfiles("test")
@WebMvcTest(RESTService.class)
@AutoConfigureMockMvc(secure = false)
public class RESTServiceTest {

    @Autowired
    private MockMvc mvc;
    private static TestData testData;
    // private RESTService restService;


    @BeforeClass
    public static void setupTestData() {
        testData = new TestData();
        testData.init();
    }

    @MockBean
    private UserService userService;

    private static final Logger logger = LoggerFactory.getLogger(RESTServiceTest.class);

    @Test
    public void registerUserWithValidData() throws Exception {

        User user = testData.user1;

        given(userService.register(user)).willReturn(true);

        mvc.perform(post("/api/v1/register")
                .with(csrf())
                .param("email", user.getEmail())
                .param("username", user.getUsername())
                .param("password", user.getPassword())
                .contentType(MediaType.TEXT_PLAIN))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

    }

    @Test
    public void registerUserWithMissingData() throws Exception {

        User user = testData.user1;

        given(userService.register(user)).willReturn(true);

        mvc.perform(post("/api/v1/register")
                .with(csrf())
                .param("email", user.getEmail())
                .contentType(MediaType.TEXT_PLAIN))
                .andExpect(status().isBadRequest());

    }

    @Test
    public void registerUserWithInvalidData() throws Exception {

        User user = testData.user1;

        given(userService.register(user)).willReturn(false);

        mvc.perform(post("/api/v1/register")
                .with(csrf())
                .param("email", user.getEmail())
                .param("username", user.getUsername())
                .param("password", user.getPassword())
                .contentType(MediaType.TEXT_PLAIN))
                .andExpect(status().isOk())
                .andExpect(content().string("false"));

    }

    @Test
    public void loginUserWithValidData() throws Exception {
        User user = testData.user1;

        given(userService.login(user.getEmail(), user.getPassword())).willReturn(true);

        mvc.perform(post("/api/v1/login")
                .with(csrf())
                .param("email", user.getEmail())
                .param("password", user.getPassword())
                .contentType(MediaType.TEXT_PLAIN))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }


    @Test
    public void loginUserWithInvalidData() throws Exception {
        User user = testData.user1;

        given(userService.login(user.getEmail(), user.getPassword())).willReturn(false);

        mvc.perform(post("/api/v1/login")
                .with(csrf())
                .param("email", user.getEmail())
                .param("password", user.getPassword())
                .contentType(MediaType.TEXT_PLAIN))
                .andExpect(status().isOk())
                .andExpect(content().string("false"));
    }

    @Test
    public void logoutUserWithValidData() throws Exception {
        User user = testData.user1;

        given(userService.logout(user.getEmail())).willReturn(false);

        mvc.perform(post("/api/v1/logout")
                .with(csrf())
                .param("email", user.getEmail())
                .contentType(MediaType.TEXT_PLAIN))
                .andExpect(status().isOk())
                .andExpect(content().string("false"));
    }
}
