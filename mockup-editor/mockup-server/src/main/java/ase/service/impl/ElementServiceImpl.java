package ase.service.impl;

import ase.service.ElementService;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

/**
 * @author: Brigitte Blank
 *
 * path to the directory if spring is directly started in the mockup-server directory for development purpose
 * private String baseDir = "../mockup-client/src/main/web/client/src/assets/img";
 * path to the directory if spring is started in the usual mockup-editor directory
 */
@Service
public class ElementServiceImpl implements ElementService {

    private String baseDir = "./mockup-client/src/main/web/client/src/assets/img";
    private String systemDir = baseDir + "/system";
    private String userDir = baseDir + "/user";
    /**
     * returns categories concerning element Assets (i.e. Personal)
     * @return List<String>
     * @throws java.lang.NullPointerException [description]
     */
    @Override
    public List<String> getCategories() throws java.lang.NullPointerException {
        //System.out.println("\n\n\n"+(Paths.get("").toString()));
        List<String> categories = new ArrayList<>();
        File folder = new File(systemDir);
        File[] listOfCategories = folder.listFiles();
        for (File category: listOfCategories) {
            categories.add(category.getName());
        }
        return categories;
    }
    /**
     * returns all elements from a given category
     * @param  category String
     * @return          List<String>
     */
    @Override
    public List<String> getElements(String category) {
        List<String> elements = new ArrayList<>();
        File folder = new File(systemDir+"/"+category);
        File[] listOfElements = folder.listFiles();
        for (File elem: listOfElements) {
            elements.add(elem.getName());
        }
        return elements;
    }

    /**
     * returns all elements of a users Personal folder
     * @param  userfolder String
     * @return            List<String>
     */
    @Override
    public List<String> getUserElements(String userfolder) {
        List<String> elements = new ArrayList<>();
        File folder = new File(userDir + "/" + userfolder);
        if (!folder.exists()) {
            return elements;
        }
        File[] listOfElements = folder.listFiles();
        for (File elem: listOfElements) {
            elements.add(userfolder+"/"+elem.getName());
        }
        return elements;
    }
}
