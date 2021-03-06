package ase.tests.DAOTests;

import ase.DAO.DAOException;
import ase.DAO.UserDAO;
import ase.DTO.User;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

/*@ActiveProfiles("test")
@SpringBootTest(classes = TestRdbsConfiguration.class)
@ContextConfiguration(classes = Application.class)
@RunWith(SpringJUnit4ClassRunner.class)
@SqlGroup({
        @Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD, scripts = "classpath:insertTestData.sql"),
        @Sql(executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD, scripts = "classpath:deleteData.sql")
})*/
public class UserDAOTest extends AbstractDAOTest{
/*

    @Rule
    public Timeout testTimeout = Timeout.seconds(3);

    @ClassRule
    public static PostgreSQLContainer postgresContainer = new PostgreSQLContainer()
            .withDatabaseName("test")
            .withPassword("test")
            .withUsername("test");


    private static TestData testData;



    @BeforeClass
    public static void setupTestData() {
        testData = new TestData();
        testData.init();
    }
*/

    @Autowired
    private UserDAO userDAO;

    private static final Logger logger = LoggerFactory.getLogger(UserDAOTest.class);

    @Test
    public void createUserWithValidDataTest() throws DAOException {
        User user = testData.user3;
        User createdUser=userDAO.create(user);
        user.setId(createdUser.getId());
        user.setPassword(createdUser.getPassword());
        assertEquals("user.model.ts was successfully created", user, createdUser);
        assertEquals("user.model.ts was successfully persisted", createdUser, userDAO.findById(createdUser.getId()));
    }

    @Test(expected = DAOException.class)
    public void createUserWithInValidDataTest() throws DAOException {
        User user = null;
        userDAO.create(user);
    }

    @Test
    public void updateUserWithValidDataTest() throws DAOException {
        User user = testData.createdUser1;
        assertEquals("user.model.ts was successfully updated", user, userDAO.update(user));
        assertEquals("user.model.ts was successfully persisted", user, userDAO.findById(user.getId()));
    }

    @Test(expected = DAOException.class)
    public void updateUserWithInValidDataTest() throws DAOException {
        userDAO.update(null);
    }

    @Test
    public void deleteUserWithValidDataTest() throws DAOException {
        assertTrue("user.model.ts was successfully deleted", userDAO.delete(2));
    }

    @Test(expected = DAOException.class)
    public void deleteUserWithInValidDataTest() throws DAOException {
        userDAO.delete(-1);
    }

    @Test
    public void findUserByIDWithValidDataTest() throws DAOException {
        User user = testData.createdUser2;
        assertEquals("user.model.ts was found by id", user, userDAO.findById(2));
    }

    @Test(expected = DAOException.class)
    public void findUserByIDUserWithInValidDataTest() throws DAOException {
        userDAO.findById(-1);
    }

    @Test
    public void findUserByEmailWithValidDataTest() throws DAOException {
        User user = testData.createdUser2;
        assertEquals("user.model.ts was found by email", user, userDAO.findByEmail("email2"));
    }

    @Test
    public void findAllUsers() throws DAOException{
        List<User> users=new ArrayList<>();
        users.add(testData.createdUser1);
        users.add(testData.createdUser2);
        assertEquals(users,userDAO.findAll());
    }

    @Test (expected = DAOException.class)
    public void createUserWithDuplicateEmail() throws DAOException{
        User user=testData.user4;
        User duplicateUser=testData.user3;
        duplicateUser.setEmail(user.getEmail());
        userDAO.create(user);
        userDAO.create(duplicateUser);
    }

    @Test (expected = DAOException.class)
    public void updateUserWithDuplicateEmail() throws DAOException{
        User user=testData.user4;
        User duplicateUser=testData.user3;
        userDAO.create(user);
        duplicateUser=userDAO.create(duplicateUser);
        duplicateUser.setEmail(user.getEmail());
        userDAO.update(duplicateUser);
    }

}
