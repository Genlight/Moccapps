package ase.tests;

import ase.DAO.PageDAO;
import ase.springboot.Application;
import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.Rule;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.SqlGroup;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.testcontainers.containers.PostgreSQLContainer;

@ActiveProfiles("test")
@SpringBootTest(classes = TestRdbsConfiguration.class)
@ContextConfiguration(classes = Application.class)
@RunWith(SpringJUnit4ClassRunner.class)
@SqlGroup({
        @Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD, scripts = {"classpath:schema.sql","classpath:insertTestData.sql"}),
        @Sql(executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD, scripts = "classpath:deleteData.sql")
})
public abstract class AbstractDAOTest {

    @Rule
    public Timeout testTimeout = Timeout.seconds(3);

    @ClassRule
    public static PostgreSQLContainer postgresContainer = new PostgreSQLContainer()
            .withDatabaseName("test")
            .withPassword("test")
            .withUsername("test");

    @Autowired
    protected static TestData testData;

    @BeforeClass
    public static void setupTestData() {
        testData = new TestData();
        testData.init();
    }

}
