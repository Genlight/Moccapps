package ase.tests.DAOTests;

import ase.DAO.CommentDAO;
import ase.DAO.DAOException;
import ase.DTO.Comment;
import ase.DTO.CommentEntry;
import ase.tests.TestData;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import static org.junit.Assert.assertEquals;

public class CommentDAOTest extends AbstractDAOTest{

    @Autowired
    CommentDAO commentDAO;

    private static final Logger logger = LoggerFactory.getLogger(InvitationDAOTest.class);


    @Test
    public void createCommentWithValidDataTest() throws DAOException {
        Comment comment = testData.comment2;
        assertEquals("The returned Comment has to be equal to the created one", comment, commentDAO.create(comment));
    }


    @Test
    public void createCommentEntryWithValidDataTest() throws DAOException {
        CommentEntry comment = testData.commentEntry2;
        commentDAO.create(testData.comment2);
        assertEquals("The returned Comment has to be equal to the created one", comment, commentDAO.createEntry(comment));
    }

    @Test
    public void findCommentById() throws DAOException{
        Comment comment = testData.createdComment1;
        assertEquals("The returned Comment has to be equal to the created one", comment, commentDAO.findById(testData.createdComment1.getId()));
    }


}
