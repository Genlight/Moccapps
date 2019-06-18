package ase.tests.DAOTests;

import ase.DAO.DAOException;
import ase.DAO.PageVersionDAO;
import ase.DTO.Page;
import ase.DTO.PageVersion;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static org.junit.Assert.*;

public class PageVersionsDAOTest extends AbstractDAOTest {

    @Autowired
    private PageVersionDAO pageVersionDAO;

    private static final Logger logger = LoggerFactory.getLogger(PageVersionsDAOTest.class);

    @Test
    public void createPageVersionWithValidDataTest() throws DAOException {
        Page page = testData.createdPage2;
        PageVersion pageVersion = testData.pageVersion2;
        pageVersion.setId(2);
        assertEquals("The returned PageVersion has to be equal to the created one", pageVersion, pageVersionDAO.create(page, testData.pageVersion2.getProjectVersions_id()));
        pageVersion.setId(0);
    }


    @Test(expected = DAOException.class)
    public void createPageVersionWithInValidDataTest() throws DAOException {
        pageVersionDAO.create(null, 0);
    }


    @Test
    public void updatePageVersionWithValidDataTest() throws DAOException {
        PageVersion pageVersion = testData.createdPageVersion1;
        PageVersion pageBefore = pageVersionDAO.findById(1);
        assertEquals(pageVersion,pageBefore);
        pageVersion.setPage_order(5);
        assertEquals(pageVersion, pageVersionDAO.update(pageVersion));
        pageVersion.setPage_order(1);
    }

    @Test(expected = DAOException.class)
    public void updatePageVersionWithInValidDataTest() throws DAOException {
        pageVersionDAO.update(null);
    }

    @Test
    public void deletePageVersionWithValidDataTest() throws DAOException {
        PageVersion page = testData.createdPageVersion1;
        page.setId(1);
        assertTrue(pageVersionDAO.delete(page));
    }

    @Test(expected = DAOException.class)
    public void deletePageVersionWithInValidDataTest() throws DAOException {
        PageVersion page = testData.createdPageVersion1;
        page.setId(-1);
        pageVersionDAO.delete(page);
    }

    @Test
    public void findPageVersionByIDWithValidDataTest() throws DAOException {
        PageVersion page = testData.createdPageVersion1;
        page.setId(1);
        PageVersion page1 = pageVersionDAO.findById(1);
        assertEquals(page, page1);
    }

    @Test
    public void findPageVersionByPIDandOrderWithValidDataTest() throws DAOException {
        PageVersion page = testData.createdPageVersion1;
        page.setId(1);
        PageVersion page1 = pageVersionDAO.findByProjectAndOrder(testData.createdProjectVersion1.getProjectId(),testData.createdPageVersion1.getPage_order());
        assertEquals(page, page1);
    }

    @Test(expected = DAOException.class)
    public void findPageByIDPageWithInValidDataTest() throws DAOException {
        pageVersionDAO.findById(-1);
    }

    @Test
    public void findPagesByProjectId() throws DAOException {
        PageVersion page_ideal = testData.createdPageVersion1;
        page_ideal.setId(1);

        PageVersion page_real = pageVersionDAO.findById(1);
        assertEquals(page_ideal, page_real);

        List<PageVersion> pages= pageVersionDAO.findPagesForProject(testData.createdPage1.getProject_id());
        for(PageVersion e: pages){
            logger.info(e.toString());
        }
        if(!(pages.contains(testData.createdPageVersion1))){
            fail();
        }
    }


}
