package ase.service.impl;

import ase.DAO.DAOException;
import ase.DAO.PageVersionDAO;
import ase.DTO.Page;
import ase.DTO.PageVersion;
import ase.service.PageService;
import ase.service.PageVersionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PageVersionServiceImpl implements PageVersionService {

    private static final Logger logger = LoggerFactory.getLogger(PageVersionServiceImpl.class);

    @Autowired
    PageVersionDAO pageVersionDAO;

    @Autowired
    PageService pageService;

    /**
     * returns all PageVersions for a given Project, identified by the project ID
     * @param  projectId Integer
     * @return           List<PageVersion>
     */
    @Override
    public List<PageVersion> getAllPagesForProject(int projectId) {
        try {
            return pageVersionDAO.findPagesForProject(projectId);
        } catch (DAOException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    /**
     * restores a Project by given PageVersions
     * @param  pageVersions List<PageVersion>
     * @param  projectId    Project
     * @return              List<Page>
     */
    @Override
    public List<Page> restorePages(List<PageVersion> pageVersions, int projectId){
        List<Page> pages = new ArrayList<>();
        for(PageVersion p:pageVersions){
            Page page = new Page();
            page.setProject_id(projectId);
            page.setPage_data(p.getPage_data());
            page.setWidth(p.getPage_width());
            page.setHeight(p.getPage_height());
            page.setPage_name(p.getPage_name());
            page.setPage_order(p.getPage_order());
            page = pageService.create(page);
            pages.add(page);
        }
        return pages;
    }

}
