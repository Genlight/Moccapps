package ase.service.impl;

import ase.DAO.CommentDAO;
import ase.DAO.DAOException;
import ase.DAO.PageDAO;
import ase.DTO.Page;
import ase.service.PageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PageServiceImpl implements PageService {

    private static final Logger logger = LoggerFactory.getLogger(PageServiceImpl.class);

    @Autowired
    PageDAO pageDAO;

    @Autowired
    CommentDAO commentDAO;

    /**
     * creates a page entry in db
     * @param  page Page
     * @return      Page
     */
    @Override
    public Page create(Page page) {
        try {
           return pageDAO.create(page);
        } catch (DAOException e) {
            e.printStackTrace();
            return null;
        }

    }

    /**
     * delete a Page in db
     * @param  page Page
     * @return      boolean
     */
    @Override
    public boolean delete(Page page) {
        try {
            pageDAO.delete(page);
        } catch (DAOException e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }
    /**
     * returns all Pages for a Project
     * @param  projectId Integer
     * @return           List<Page>
     */
    @Override
    public List<Page> getAllPagesForProject(int projectId) {
        try {
            List<Page>pages= pageDAO.findPagesForProject(projectId);
            return pages;
        } catch (DAOException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
    /**
     * get a Page by a given Project and an order number
     * @param  id    Integer
     * @param  order Integer
     * @return       Page
     */
    @Override
    public Page getPageByProjectIdAndOrder(int id, int order) {
        try {
            Page page= pageDAO.findByProjectAndOrder(id,order);
            return page;
        } catch (DAOException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * returns a Page by given id
     * @param  id Integer
     * @return    Page
     */
    @Override
    public Page getPageById(int id) {
        try {
            Page page= pageDAO.findById(id);
            return page;
        } catch (DAOException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * updates an existing page in db
     * @param  page Page
     * @return      boolean
     */
    @Override
    public boolean update(Page page) {
        try {
            if(pageDAO.update(page)!=null){
                return true;
            }
        } catch (DAOException e) {
            e.printStackTrace();
        }
        return false;
    }
}
