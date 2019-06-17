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

    /**
     * returns a list of available elements the user uploaded to the server
     * @param userfolder name of the folder containing the user's elements
     * @return list of element names
     */
    List<String> getUserElements(String userfolder);
}
