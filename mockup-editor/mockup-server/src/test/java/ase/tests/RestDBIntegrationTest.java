package ase.tests;

import ase.DAO.UserDAO;
import ase.DTO.User;
import ase.service.UserService;
import ase.springboot.Application;
import org.json.JSONObject;
import org.junit.*;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
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
@Ignore
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

    @Test
    public void registerUserWithValidData() throws Exception {

        User user = testData.createdUser1;
        JSONObject testUser = new JSONObject();
        testUser.put("username", user.getUsername());
        testUser.put("email", user.getEmail());
        testUser.put("password", user.getPassword());

        mvc.perform(post("/api/v1/register")
                .with(csrf())
                .content(testUser.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        User user1 = userDAO.findByEmail(user.getEmail());
        assertEquals(user,user1);

    }

    @Test
    public void registerRegisterUserWithValidData() throws Exception {

        User user = testData.createdUser1;
        JSONObject testUser = new JSONObject();
        testUser.put("username", user.getUsername());
        testUser.put("email", user.getEmail());
        testUser.put("password", user.getPassword());

        mvc.perform(post("/api/v1/register")
                .with(csrf())
                .content(testUser.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        User user1 = userDAO.findByEmail(user.getEmail());
        assertEquals(user,user1);

        mvc.perform(post("/api/v1/register")
                .with(csrf())
                .content(testUser.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("false"));


    }

    @Test
    public void registerLoginUserWithValidData() throws Exception {
        User user = testData.createdUser1;
        JSONObject testUser = new JSONObject();
        testUser.put("username", user.getUsername());
        testUser.put("email", user.getEmail());
        testUser.put("password", user.getPassword());

        mvc.perform(post("/api/v1/register")
                .with(csrf())
                .content(testUser.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        User user1 = userDAO.findByEmail(user.getEmail());
        assertEquals(user,user1);

        mvc.perform(post("/api/v1/login")
                .with(csrf())
                .content(testUser.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("{\"id\":1,\"username\":\"user1\",\"email\":\"email1\",\"password\":\"password1\"}"));


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

        mvc.perform(post("/api/v1/register")
                .with(csrf())
                .content(testUser.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        User user1 = userDAO.findByEmail(user.getEmail());
        assertEquals(user,user1);

        mvc.perform(post("/api/v1/logout")
                .with(csrf())
                .content(testUser.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("false"));


        assertFalse(userService.isLoggedIn(user.getEmail()));

    }


    @Test
    @WithMockUser(value = "spring")
    public void loginUserWithInvalidData() throws Exception {
        User user = testData.createdUser1;
        JSONObject testUser = new JSONObject();
        testUser.put("username", "a");
        testUser.put("email", "b");
        testUser.put("password", "c");

        mvc.perform(post("/api/v1/login")
                .content(testUser.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string(""));

        assertFalse(userService.isLoggedIn(user.getEmail()));
    }

    @Test
    public void registerLoginLogoutUserWithValidData() throws Exception {
        User user = testData.createdUser1;
        JSONObject testUser = new JSONObject();
        testUser.put("username", user.getUsername());
        testUser.put("email", user.getEmail());
        testUser.put("password", user.getPassword());

        mvc.perform(post("/api/v1/register")
                .with(csrf())
                .content(testUser.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        User user1 = userDAO.findByEmail(user.getEmail());
        assertEquals(user,user1);

        mvc.perform(post("/api/v1/login")
                .with(csrf())
                .content(testUser.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("{\"id\":1,\"username\":\"user1\",\"email\":\"email1\",\"password\":\"password1\"}"));

        assertTrue(userService.isLoggedIn(user.getEmail()));

        mvc.perform(post("/api/v1/logout")
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

        mvc.perform(post("/api/v1/register")
                .with(csrf())
                .content(testUser.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        User user1 = userDAO.findByEmail(user.getEmail());
        assertEquals(user,user1);

        mvc.perform(post("/api/v1/login")
                .with(csrf())
                .content(testUser.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("{\"id\":1,\"username\":\"user1\",\"email\":\"email1\",\"password\":\"password1\"}"));

        assertTrue(userService.isLoggedIn(user.getEmail()));

        mvc.perform(post("/api/v1/logout")
                .with(csrf())
                .content(testUser.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        assertFalse(userService.isLoggedIn(user.getEmail()));

        mvc.perform(post("/api/v1/logout")
                .with(csrf())
                .content(testUser.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("false"));

        assertFalse(userService.isLoggedIn(user.getEmail()));
    }



}
