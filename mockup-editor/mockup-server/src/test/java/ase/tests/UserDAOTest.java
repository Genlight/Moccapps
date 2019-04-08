package ase.tests;

import ase.DAO.DAOException;
import ase.DAO.UserDAO;
import ase.DTO.User;
import ase.springboot.Application;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.Assert.assertEquals;

@ContextConfiguration(classes = Application.class)
@RunWith(SpringJUnit4ClassRunner.class)
@ActiveProfiles("test")
public class UserDAOTest {

    @Rule
    public Timeout testTimeout = Timeout.seconds(3);

    @Autowired
    private UserDAO userDAO;
    private static TestData testData;

    private static final Logger logger= LoggerFactory.getLogger(UserDAOTest.class);

    @BeforeClass
    public static void setupTestData(){
        testData=new TestData();
        testData.init();
    }

    @Test
    public void createUserWithValidDataTest()throws DAOException {
        User user = testData.user1;
        assertEquals("The returned User has to be equal to the created one", user, userDAO.create(user));
    }

    @Test(expected = DAOException.class)
    public void createUserWithInValidDataTest()throws DAOException {
        User user = null;
        userDAO.create(user);
    }

    @Test
    public void updateUserWithValidDataTest()throws DAOException {
        User user=testData.user1;
        user.setId(1);
        assertEquals("user was successfully updated", user, userDAO.update(user));
    }

    @Test(expected = DAOException.class)
    public void updateUserWithInValidDataTest()throws DAOException {
        userDAO.update(null);
    }

    @Test
    public void deleteUserWithValidDataTest()throws DAOException {
        assertEquals("user was successfully deleted", true, userDAO.delete(1));
    }

    @Test(expected = DAOException.class)
    public void deleteUserWithInValidDataTest()throws DAOException {
        userDAO.delete(-1);
    }

    @Test
    public void findUserByIDWithValidDataTest()throws DAOException {
        User user=new User(2,"tuser2","temail2","tpassword2");
        assertEquals("user was found by id", user, userDAO.findById(2));
    }

    @Test(expected = DAOException.class)
    public void findUserByIDUserWithInValidDataTest()throws DAOException {
        userDAO.findById(-1);
    }

    @Test
    public void findUserByEmailWithValidDataTest()throws DAOException {
        User user=new User(2,"tuser2","temail2","tpassword2");
        assertEquals("user was found by email", user, userDAO.findByEmail("temail2"));
    }
}
