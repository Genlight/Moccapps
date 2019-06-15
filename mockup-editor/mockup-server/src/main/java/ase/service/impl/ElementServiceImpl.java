package ase.service.impl;

import ase.service.ElementService;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

/**
 * @author: Brigitte Blank
 */
@Service
public class ElementServiceImpl implements ElementService {
    @Override
    public List<String> getCategories() {
        List<String> categories = new ArrayList<>();
        File folder = new File("/assets/img");
        File[] listOfCategories = folder.listFiles();
        for (File category: listOfCategories) {
            categories.add(category.getName());
        }
        return categories;
    }

    @Override
    public List<String> getElements(String category) {
        List<String> elements = new ArrayList<>();
        File folder = new File("/assets/img/"+category);
        File[] listOfElements = folder.listFiles();
        for (File elem: listOfElements) {
            elements.add(elem.getName());
        }
        return elements;
    }
}
