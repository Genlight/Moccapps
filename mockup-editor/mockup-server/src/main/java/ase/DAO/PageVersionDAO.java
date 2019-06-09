package ase.DAO;

import ase.DTO.Page;
import ase.DTO.PageVersion;

import java.util.List;

public interface PageVersionDAO {

    PageVersion create(Page page, int id) throws DAOException;

    PageVersion update(PageVersion pageVersion) throws DAOException;

    boolean delete(PageVersion pageVersion) throws DAOException;

    PageVersion findById(int id) throws DAOException;

    PageVersion findByProjectAndOrder(int id, int order) throws DAOException;

    List<PageVersion> findPagesForProject(int id) throws DAOException;

}
