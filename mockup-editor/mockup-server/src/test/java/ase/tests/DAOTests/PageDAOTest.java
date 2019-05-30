package ase.tests.DAOTests;

import ase.DAO.DAOException;
import ase.DAO.PageDAO;
import ase.DTO.Page;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static org.junit.Assert.*;

public class PageDAOTest extends AbstractDAOTest {

    @Autowired
    private PageDAO pageDAO;

    private static final Logger logger = LoggerFactory.getLogger(PageDAOTest.class);

    @Test
    public void createPageWithValidDataTest() throws DAOException {
        Page page = testData.page3;
        assertEquals("The returned Page has to be equal to the created one", page, pageDAO.create(page));
    }

    @Test(expected = DAOException.class)
    public void createPageWithInValidDataTest() throws DAOException {
        pageDAO.create(null);
    }


    @Test
    public void updatePageWithValidDataTest() throws DAOException {
        Page page = testData.createdPage1;
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
        Page page = testData.createdPage1;
        page.setId(1);
        assertTrue(pageDAO.delete(page));
    }

    @Test(expected = DAOException.class)
    public void deletePageWithInValidDataTest() throws DAOException {
        Page page = testData.createdPage1;
        page.setId(-1);
        pageDAO.delete(page);
    }

    @Test
    public void findPageByIDWithValidDataTest() throws DAOException {
        Page page = testData.createdPage1;
        page.setId(1);
        Page page1 = pageDAO.findById(1);
        assertEquals(page, page1);
    }

    @Test
    public void findPageByPIDandOrderWithValidDataTest() throws DAOException {
        Page page = testData.createdPage1;
        page.setId(1);
        Page page1 = pageDAO.findByProjectAndOrder(testData.createdPage1.getProject_id(),testData.createdPage1.getPage_order());
        assertEquals(page, page1);
    }

    @Test(expected = DAOException.class)
    public void findPageByIDPageWithInValidDataTest() throws DAOException {
        pageDAO.findById(-1);
    }

    @Test
    public void findPagesByProjectId() throws DAOException {
        Page page_ideal = testData.createdPage1;
        page_ideal.setId(1);

        Page page_real = pageDAO.findById(1);
        assertEquals(page_ideal, page_real);

        Page page1_ideal = testData.createdPage2;
        page1_ideal.setId(2);

        Page page1_real = pageDAO.findById(2);
        assertEquals(page1_ideal, page1_real);

        List<Page> pages= pageDAO.findPagesForProject(testData.createdPage1.getProject_id());
        for(Page e: pages){
            logger.info(e.toString());
        }
        if(!(pages.contains(testData.createdPage1))){
            fail();
        }
        if(!(pages.contains(testData.createdPage2))){
            fail();
        }
    }

}
