package ase.tests;

import ase.DAO.UserDAO;
import ase.DTO.User;
import ase.Security.UserDetails;
import ase.service.UserService;
import ase.service.impl.UserServiceImpl;
import ase.springboot.Application;
import org.json.JSONObject;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.SqlGroup;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.testcontainers.containers.PostgreSQLContainer;

import static junit.framework.TestCase.assertTrue;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ContextConfiguration(classes = Application.class)
@SpringBootTest(classes = TestRdbsConfiguration.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@RunWith(SpringJUnit4ClassRunner.class)
@ActiveProfiles("test")
@AutoConfigureMockMvc()
@SqlGroup({
        @Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD, scripts = "classpath:schema.sql"),
        @Sql(executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD, scripts = "classpath:deleteData.sql")
})
public class RestDBIntegrationTest {

    @Autowired
    private MockMvc mvc;
    private static TestData testData;
    @Autowired
    private UserService userService;
    @Autowired
    private UserDAO userDAO;
    @Autowired
    private WebApplicationContext context;

    @BeforeClass
    public static void setupTestData() {
        testData = new TestData();
        testData.init();
    }

    @Before
    public void setup() {
        mvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    @ClassRule
    public static PostgreSQLContainer postgresContainer = new PostgreSQLContainer()
            .withDatabaseName("test")
            .withPassword("test")
            .withUsername("test");

    private static final Logger logger = LoggerFactory.getLogger(RestDBIntegrationTest.class);

    @Test
    public void registerUserWithValidData() throws Exception {

        User user = testData.createdUser1;
        JSONObject testUser = new JSONObject();
        testUser.put("username", user.getUsername());
        testUser.put("email", user.getEmail());
        testUser.put("password", user.getPassword());

        mvc.perform(post("/register")
                .content(testUser.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("{\"message\":\"User registered successfully!\"}"));

        User user1 = userDAO.findByEmail(user.getEmail());
        user1.toString();
        logger.error(user1.toString());
        assertEquals(user,user1);

        assertEquals(UserDetails.build(user1), UserDetails.build(user));

    }

    @Test
    public void registerRegisterUserWithValidData() throws Exception {

        User user = testData.createdUser1;
        JSONObject testUser = new JSONObject();
        testUser.put("username", user.getUsername());
        testUser.put("email", user.getEmail());
        testUser.put("password", user.getPassword());

        mvc.perform(post("/register")
                .with(csrf())
                .content(testUser.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("{\"message\":\"User registered successfully!\"}"));

        User user1 = userDAO.findByEmail(user.getEmail());
        assertEquals(user,user1);

        mvc.perform(post("/register")
                .with(csrf())
                .content(testUser.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());


    }

    @Test
    public void registerLoginUserWithValidData() throws Exception {
        User user = testData.createdUser1;
        JSONObject testUser = new JSONObject();
        testUser.put("username", user.getUsername());
        testUser.put("email", user.getEmail());
        testUser.put("password", user.getPassword());

        mvc.perform(post("/register")
                .content(testUser.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("{\"message\":\"User registered successfully!\"}"));

        User user1 = userDAO.findByEmail(user.getEmail());
        assertEquals(user,user1);
        logger.error(user1.toString());

        testUser = new JSONObject();
        testUser.put("username", user.getEmail());
        testUser.put("password", user.getPassword());

        mvc.perform(post("/login")
                .content(testUser.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());


        assertTrue(userService.isLoggedIn(user.getEmail()));

        userService.logout(user.getEmail());

    }

    @Test
    public void registerLogoutUserWithValidData() throws Exception {
        User user = testData.createdUser1;
        JSONObject testUser = new JSONObject();
        testUser.put("username", user.getUsername());
        testUser.put("email", user.getEmail());
        testUser.put("password", user.getPassword());

        mvc.perform(post("/register")
                .with(csrf())
                .content(testUser.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("{\"message\":\"User registered successfully!\"}"));

        User user1 = userDAO.findByEmail(user.getEmail());
        assertEquals(user,user1);

        testUser = new JSONObject();
        testUser.put("email", user.getEmail());

        mvc.perform(post("/logout")
                .content(testUser.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(value = "spring")
    public void loginUserWithInvalidData() throws Exception {
        User user = testData.createdUser1;
        JSONObject testUser = new JSONObject();
        testUser.put("username", "a");
        testUser.put("email", "b");
        testUser.put("password", "c");

        mvc.perform(post("/login")
                .content(testUser.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string(""));
    }

    @Test
    public void registerLoginLogoutUserWithValidData() throws Exception {
        User user = testData.createdUser1;
        JSONObject testUser = new JSONObject();
        testUser.put("username", user.getUsername());
        testUser.put("email", user.getEmail());
        testUser.put("password", user.getPassword());

        mvc.perform(post("/register")
                .with(csrf())
                .content(testUser.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("{\"message\":\"User registered successfully!\"}"));

        User user1 = userDAO.findByEmail(user.getEmail());
        assertEquals(user,user1);

        testUser = new JSONObject();
        testUser.put("username", user.getEmail());
        testUser.put("password", user.getPassword());

        mvc.perform(post("/login")
                .with(csrf())
                .content(testUser.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        assertTrue(userService.isLoggedIn(user.getEmail()));


        testUser = new JSONObject();
        testUser.put("email", user.getEmail());

        mvc.perform(post("/logout")
                .with(csrf())
                .content(testUser.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        assertFalse(userService.isLoggedIn(user.getEmail()));
    }

    @Test
    public void registerLoginLogoutLogoutUserWithValidData() throws Exception {
            User user = testData.createdUser1;
        JSONObject testUser = new JSONObject();
        testUser.put("username", user.getUsername());
        testUser.put("email", user.getEmail());
        testUser.put("password", user.getPassword());

        mvc.perform(post("/register")
                .with(csrf())
                .content(testUser.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("{\"message\":\"User registered successfully!\"}"));

        User user1 = userDAO.findByEmail(user.getEmail());
        assertEquals(user,user1);

        testUser = new JSONObject();
        testUser.put("username", user.getEmail());
        testUser.put("password", user.getPassword());

        mvc.perform(post("/login")
                .with(csrf())
                .content(testUser.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        assertTrue(userService.isLoggedIn(user.getEmail()));

        testUser = new JSONObject();
        testUser.put("email", user.getEmail());

        mvc.perform(post("/logout")
                .with(csrf())
                .content(testUser.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        assertFalse(userService.isLoggedIn(user.getEmail()));

        testUser = new JSONObject();
        testUser.put("email", user.getEmail());

        mvc.perform(post("/logout")
                .with(csrf())
                .content(testUser.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());

    }

    @TestConfiguration
    protected static class Config {

        @Bean
        public UserService userService() {
            return new UserServiceImpl();
        }
    }



}
