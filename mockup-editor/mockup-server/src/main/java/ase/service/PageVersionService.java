package ase.service;

import ase.DTO.Page;
import ase.DTO.PageVersion;

import java.util.List;

public interface PageVersionService {
    List<PageVersion> getAllPagesForProject(int projectId);

    List<Page> restorePages(List<PageVersion> pageVersions, int projectId);
}
