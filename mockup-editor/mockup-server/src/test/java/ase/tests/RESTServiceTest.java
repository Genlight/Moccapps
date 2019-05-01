package ase.tests;

import ase.DTO.User;
import ase.message.response.JwtResponse;
import ase.service.UserService;
import ase.springboot.Application;
import ase.springboot.controller.RESTService;
import org.json.JSONObject;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ContextConfiguration(classes = Application.class)
@RunWith(SpringJUnit4ClassRunner.class)
@ActiveProfiles("test")
@WebMvcTest(RESTService.class)
@AutoConfigureMockMvc(secure = false)
@WebAppConfiguration
public class RESTServiceTest {

    @Autowired
    private MockMvc mvc;
    private static TestData testData;


    @BeforeClass
    public static void setupTestData() {
        testData = new TestData();
        testData.init();
    }

    @Autowired
    PasswordEncoder encoder;
    @Autowired
    private UserService userService;

    @Autowired
    private RESTService restService;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        this.mvc = MockMvcBuilders.standaloneSetup(restService).build();
    }

    @Test
    public void registerUserWithValidData() throws Exception {

        //User user = testData.createdUser1;
        User user = testData.user3;
        JSONObject testUser = new JSONObject();
        testUser.put("username", user.getUsername());
        testUser.put("email", user.getEmail());
        testUser.put("password", user.getPassword());

        user.setId(-1);

        //doReturn(true).when(userService).register(user);
        given(userService.register(user)).willReturn(true);

        mvc.perform(post("/register")
                //.with(csrf())
                .content(testUser.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string(new JSONObject().put("message", "User registered successfully!").toString()));

    }


    private static final Logger logger = LoggerFactory.getLogger(RESTServiceTest.class);

    @Test
    public void registerUserWithMissingData() throws Exception {

        User user = testData.createdUser1;
        JSONObject testUser = new JSONObject();
        testUser.put("username", user.getUsername());
        testUser.put("password", user.getPassword());

        given(userService.register(user)).willReturn(true);

        mvc.perform(post("/register")
                .with(csrf())
                .content(testUser.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());

    }

    @Test
    public void registerUserWithInvalidData() throws Exception {

        User user = testData.createdUser1;
        JSONObject testUser = new JSONObject();
        testUser.put("username", user.getUsername());
        testUser.put("email", user.getEmail());
        testUser.put("password", user.getPassword());

        given(userService.register(user)).willReturn(false);

        mvc.perform(post("/register")
                .with(csrf())
                .content(testUser.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(new JSONObject().put("message", "Something else went wrong").toString()));

    }

    @Test
    public void loginUserWithValidData() throws Exception {
        User user = testData.createdUser1;
        JSONObject testUser = new JSONObject();
        testUser.put("username", user.getEmail());
        testUser.put("password", user.getPassword());

        JSONObject testAnswer = new JSONObject();
        testAnswer.put("username", user.getUsername());
        testAnswer.put("email", user.getEmail());
        testAnswer.put("tokenType", "Bearer");
        testAnswer.put("accessToken", "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhc2QxIiwiaWF0IjoxNTU2NTgwMTIxLCJleHAiOjE1NTY1OTgxMjF9.kIM6BC_s8C0RoiZ3FaaxDZcffM28yNPo-of8G3q1fgZxE0j9CcT2aRfm6hX5Qc690qd55xS6RHAuHeae2T6GDA");

        JwtResponse jwtResponse
                = new JwtResponse("eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhc2QxIiwiaWF0IjoxNTU2NTgwMTIxLCJleHAiOjE1NTY1OTgxMjF9.kIM6BC_s8C0RoiZ3FaaxDZcffM28yNPo-of8G3q1fgZxE0j9CcT2aRfm6hX5Qc690qd55xS6RHAuHeae2T6GDA"
                , user.getUsername(), user.getEmail());


        given(userService.login(user.getEmail(), user.getPassword())).willReturn(jwtResponse);

        mvc.perform(post("/login")
                .with(csrf())
                .content(testUser.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().json(testAnswer.toString()));
    }

    @Test
    public void logoutUserWithValidData() throws Exception {
        User user = testData.createdUser1;
        JSONObject testUser = new JSONObject();
        testUser.put("email", user.getEmail());

        given(userService.logout(user.getEmail())).willReturn(true);

        mvc.perform(post("/logout")
                .with(csrf())
                .content(testUser.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }

    @TestConfiguration
    protected static class Config {

        @Bean
        public UserService userService() {
            return Mockito.mock(UserService.class);
        }

    }
}
