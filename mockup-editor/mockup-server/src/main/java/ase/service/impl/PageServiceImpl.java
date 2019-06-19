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

    @Override
    public Page create(Page page) {
        try {
           return pageDAO.create(page);
        } catch (DAOException e) {
            e.printStackTrace();
            return null;
        }

    }

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

    @Override
    public List<Page> getAllPagesForProject(int projectId) {
        try {
            List<Page>pages= pageDAO.findPagesForProject(projectId);
            for(Page p:pages){
                p.setComments(commentDAO.findCommentsForPage(p.getId()));
            }
            return pages;
        } catch (DAOException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @Override
    public Page getPageByProjectIdAndOrder(int id, int order) {
        try {
            Page page= pageDAO.findByProjectAndOrder(id,order);
            page.setComments(commentDAO.findCommentsForPage(page.getId()));
            return page;
        } catch (DAOException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public Page getPageById(int id) {
        try {
            Page page= pageDAO.findById(id);
            page.setComments(commentDAO.findCommentsForPage(page.getId()));
            return page;
        } catch (DAOException e) {
            e.printStackTrace();
            return null;
        }
    }

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
