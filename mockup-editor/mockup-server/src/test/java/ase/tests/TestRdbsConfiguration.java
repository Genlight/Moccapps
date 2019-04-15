package ase.tests;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.testcontainers.containers.PostgreSQLContainer;

import javax.sql.DataSource;

@Profile("test")
@TestConfiguration
public class TestRdbsConfiguration {

    private static final Logger logger  = LoggerFactory.getLogger(TestRdbsConfiguration.class);
    @Bean
    public PostgreSQLContainer postgreSQLContainer() {
        final PostgreSQLContainer postgreSQLContainer = new PostgreSQLContainer();
        postgreSQLContainer.start();
        return postgreSQLContainer;
    }
    @Bean
    public DataSource dataSource(final PostgreSQLContainer postgreSQLContainer) {
        DataSource ds = DataSourceBuilder .create()
                .url(postgreSQLContainer.getJdbcUrl())
                .username(postgreSQLContainer.getUsername())
                .password(postgreSQLContainer.getPassword())
                .driverClassName(postgreSQLContainer.getDriverClassName())
                .build();
        return ds;
    }
}
