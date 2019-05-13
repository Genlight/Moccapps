package ase.tests.DAOTests;

import ase.springboot.Application;
import ase.tests.TestData;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.SqlGroup;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@ActiveProfiles("test")
@SpringBootTest
@ContextConfiguration(classes = Application.class)
@RunWith(SpringJUnit4ClassRunner.class)
@SqlGroup({
        @Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD, scripts = {"classpath:schema.sql","classpath:insertTestData.sql"}),
        @Sql(executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD, scripts = "classpath:deleteData.sql")
})
public abstract class AbstractDAOTest {

    @Rule
    public Timeout testTimeout = Timeout.seconds(3);

    @Autowired
    protected static TestData testData;

    @BeforeClass
    public static void setupTestData() {
        testData = new TestData();
        testData.init();
    }

}
