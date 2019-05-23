package ase.service;

import ase.DTO.Page;

import java.util.List;

public interface PageService {

    Page create(Page page);

    boolean delete (Page page);

    List<Page> getAllPagesForProject(int projectId);

    Page getPageById(int id);

    boolean update(Page page);
}
