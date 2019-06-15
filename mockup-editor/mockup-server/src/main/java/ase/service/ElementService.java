package ase.service;

import java.util.List;

/**
 * @author: Brigitte Blank
 */
public interface ElementService {
    /**
     * returns a list of available categories with elements
     * @return list of category names
     */
    List<String> getCategories();

    /**
     * returns the list of available element in a given category
     * @param category name of the category
     * @return list of element names
     */
    List<String> getElements(String category);
}
