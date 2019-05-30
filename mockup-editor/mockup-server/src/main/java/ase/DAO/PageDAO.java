package ase.DAO;

import ase.DTO.Page;

import java.util.List;

public interface PageDAO {

    Page create(Page page) throws DAOException;

    Page update(Page page) throws DAOException;

    boolean delete(Page page) throws DAOException;

    Page findById(int id) throws DAOException;

    Page findByProjectAndOrder(int id,int order) throws DAOException;

    List<Page> findPagesForProject(int id) throws DAOException;

}
