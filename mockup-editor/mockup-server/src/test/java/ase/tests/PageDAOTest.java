package ase.tests;

import ase.DAO.DAOException;
import ase.DAO.PageDAO;
import ase.DTO.Page;
import org.junit.Test;
import org.junit.platform.commons.logging.Logger;
import org.junit.platform.commons.logging.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

/*@ActiveProfiles("test")
@SpringBootTest(classes = TestRdbsConfiguration.class)
@ContextConfiguration(classes = Application.class)
@RunWith(SpringJUnit4ClassRunner.class)
@SqlGroup({
        @Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD, scripts = {"classpath:schema.sql","classpath:insertTestData.sql"}),
        @Sql(executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD, scripts = "classpath:deleteData.sql")
})*/
public class PageDAOTest extends AbstractDAOTest {

/*    @Rule
    public Timeout testTimeout = Timeout.seconds(3);

    @ClassRule
    public static PostgreSQLContainer postgresContainer = new PostgreSQLContainer()
            .withDatabaseName("test")
            .withPassword("test")
            .withUsername("test");

    @Autowired
    private PageDAO pageDAO;
    private static TestData testData;



    @BeforeClass
    public static void setupTestData() {
        testData = new TestData();
        testData.init();
    }*/

    @Autowired
    private PageDAO pageDAO;

    private static final Logger logger = LoggerFactory.getLogger(PageDAOTest.class);

    @Test
    public void createPageWithValidDataTest() throws DAOException {
        Page page = testData.page2;
        assertEquals("The returned Page has to be equal to the created one", page, pageDAO.create(page));
    }

    @Test(expected = DAOException.class)
    public void createPageWithInValidDataTest() throws DAOException {
        pageDAO.create(null);
    }


    @Test
    public void updatePageWithValidDataTest() throws DAOException {
        Page page = testData.page1;
        Page pageBefore = pageDAO.findById(1);
        assertEquals(page,pageBefore);
        page.setPage_order(5);
        assertEquals(page, pageDAO.update(page));
        page.setPage_order(1);
    }

    @Test(expected = DAOException.class)
    public void updatePageWithInValidDataTest() throws DAOException {
        pageDAO.update(null);
    }

    @Test
    public void deletePageWithValidDataTest() throws DAOException {
        Page page = testData.page1;
        page.setId(1);
        assertTrue(pageDAO.delete(page));
    }

    @Test(expected = DAOException.class)
    public void deletePageWithInValidDataTest() throws DAOException {
        Page page = testData.page1;
        page.setId(-1);
        pageDAO.delete(page);
    }

    @Test
    public void findPageByIDWithValidDataTest() throws DAOException {
        Page page = testData.page1;
        page.setId(1);
        Page page1 = pageDAO.findById(1);
        assertEquals(page, page1);
    }

    @Test(expected = DAOException.class)
    public void findPageByIDPageWithInValidDataTest() throws DAOException {
        pageDAO.findById(-1);
    }

}
