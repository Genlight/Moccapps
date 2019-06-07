package ase.DAO.impl;

import ase.DAO.AbstractDAO;
import ase.DAO.DAOException;
import ase.DAO.PageVersionDAO;
import ase.DTO.Page;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PageVersionDAOImpl  extends AbstractDAO implements PageVersionDAO {
    @Override
    public Page create(Page page) throws DAOException {
        return null;
    }

    @Override
    public Page update(Page page) throws DAOException {
        return null;
    }

    @Override
    public boolean delete(Page page) throws DAOException {
        return false;
    }

    @Override
    public Page findById(int id) throws DAOException {
        return null;
    }

    @Override
    public Page findByProjectAndOrder(int id, int order) throws DAOException {
        return null;
    }

    @Override
    public List<Page> findPagesForProject(int id) throws DAOException {
        return null;
    }
}
