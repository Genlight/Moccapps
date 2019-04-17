package ase.tests;

import ase.DAO.UserDAO;
import ase.DTO.User;
import ase.service.UserService;
import ase.springboot.Application;
import ase.springboot.controller.RESTService;
import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.SqlGroup;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;

import static junit.framework.TestCase.assertTrue;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ContextConfiguration(classes = Application.class)
@SpringBootTest(classes = TestRdbsConfiguration.class)
@RunWith(SpringJUnit4ClassRunner.class)
@ActiveProfiles("test")
@AutoConfigureMockMvc(secure = false)
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


    @BeforeClass
    public static void setupTestData() {
        testData = new TestData();
        testData.init();
    }

    @ClassRule
    public static PostgreSQLContainer postgresContainer = new PostgreSQLContainer()
            .withDatabaseName("test")
            .withPassword("test")
            .withUsername("test");

    @Test
    public void registerUserWithValidData() throws Exception {

        User user = testData.user1;

        mvc.perform(post("/api/v1/register")
                .with(csrf())
                .param("email", user.getEmail())
                .param("username", user.getUsername())
                .param("password", user.getPassword())
                .contentType(MediaType.TEXT_PLAIN))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        User user1 = userDAO.findByEmail(user.getEmail());
        assertEquals(user,user1);

    }

    @Test
    public void registerRegisterUserWithValidData() throws Exception {

        User user = testData.user1;

        mvc.perform(post("/api/v1/register")
                .with(csrf())
                .param("email", user.getEmail())
                .param("username", user.getUsername())
                .param("password", user.getPassword())
                .contentType(MediaType.TEXT_PLAIN))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        User user1 = userDAO.findByEmail(user.getEmail());
        assertEquals(user,user1);

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
    public void registerLoginUserWithValidData() throws Exception {
        User user = testData.user1;

        mvc.perform(post("/api/v1/register")
                .with(csrf())
                .param("email", user.getEmail())
                .param("username", user.getUsername())
                .param("password", user.getPassword())
                .contentType(MediaType.TEXT_PLAIN))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        User user1 = userDAO.findByEmail(user.getEmail());
        assertEquals(user,user1);

        mvc.perform(post("/api/v1/login")
                .with(csrf())
                .param("email", user.getEmail())
                .param("password", user.getPassword())
                .contentType(MediaType.TEXT_PLAIN))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));


        assertTrue(userService.isLoggedIn(user.getEmail()));

        userService.logout(user.getEmail());

    }

    @Test
    public void registerLogoutUserWithValidData() throws Exception {
        User user = testData.user1;

        mvc.perform(post("/api/v1/register")
                .with(csrf())
                .param("email", user.getEmail())
                .param("username", user.getUsername())
                .param("password", user.getPassword())
                .contentType(MediaType.TEXT_PLAIN))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        User user1 = userDAO.findByEmail(user.getEmail());
        assertEquals(user,user1);

        mvc.perform(post("/api/v1/logout")
                .with(csrf())
                .param("email", user.getEmail())
                .contentType(MediaType.TEXT_PLAIN))
                .andExpect(status().isOk())
                .andExpect(content().string("false"));


        assertFalse(userService.isLoggedIn(user.getEmail()));

    }


    @Test
    public void loginUserWithInvalidData() throws Exception {
        User user = testData.user1;

        mvc.perform(post("/api/v1/login")
                .with(csrf())
                .param("email", user.getEmail())
                .param("password", user.getPassword())
                .contentType(MediaType.TEXT_PLAIN))
                .andExpect(status().isOk())
                .andExpect(content().string("false"));

        assertFalse(userService.isLoggedIn(user.getEmail()));
    }

    @Test
    public void registerLoginLogoutUserWithValidData() throws Exception {
        User user = testData.user1;

        mvc.perform(post("/api/v1/register")
                .with(csrf())
                .param("email", user.getEmail())
                .param("username", user.getUsername())
                .param("password", user.getPassword())
                .contentType(MediaType.TEXT_PLAIN))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        User user1 = userDAO.findByEmail(user.getEmail());
        assertEquals(user,user1);

        mvc.perform(post("/api/v1/login")
                .with(csrf())
                .param("email", user.getEmail())
                .param("password", user.getPassword())
                .contentType(MediaType.TEXT_PLAIN))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        assertTrue(userService.isLoggedIn(user.getEmail()));

        mvc.perform(post("/api/v1/logout")
                .with(csrf())
                .param("email", user.getEmail())
                .contentType(MediaType.TEXT_PLAIN))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        assertFalse(userService.isLoggedIn(user.getEmail()));
    }

    @Test
    public void registerLoginLogoutLogoutUserWithValidData() throws Exception {
        User user = testData.user1;

        mvc.perform(post("/api/v1/register")
                .with(csrf())
                .param("email", user.getEmail())
                .param("username", user.getUsername())
                .param("password", user.getPassword())
                .contentType(MediaType.TEXT_PLAIN))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        User user1 = userDAO.findByEmail(user.getEmail());
        assertEquals(user,user1);

        mvc.perform(post("/api/v1/login")
                .with(csrf())
                .param("email", user.getEmail())
                .param("password", user.getPassword())
                .contentType(MediaType.TEXT_PLAIN))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        assertTrue(userService.isLoggedIn(user.getEmail()));

        mvc.perform(post("/api/v1/logout")
                .with(csrf())
                .param("email", user.getEmail())
                .contentType(MediaType.TEXT_PLAIN))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        assertFalse(userService.isLoggedIn(user.getEmail()));

        mvc.perform(post("/api/v1/logout")
                .with(csrf())
                .param("email", user.getEmail())
                .contentType(MediaType.TEXT_PLAIN))
                .andExpect(status().isOk())
                .andExpect(content().string("false"));

        assertFalse(userService.isLoggedIn(user.getEmail()));
    }



}
