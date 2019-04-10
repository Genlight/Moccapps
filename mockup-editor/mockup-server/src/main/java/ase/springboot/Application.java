package ase.springboot;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;

import javax.sql.DataSource;

/**
 * @author group2
 *
 *
 */
@Configuration
@ComponentScan(basePackages = {"ase"})
@EnableAutoConfiguration(exclude={DataSourceAutoConfiguration.class})
public class Application extends SpringBootServletInitializer {

	
	public static void main(String[] args) {
		SpringApplication.run(Application.class,args);
	}

	@Profile(value="prod")
	@Bean(name="dataSource")
	public DataSource dataSource() {
		return DataSourceBuilder
				.create()
				.username("sa")
				.password("")
				.url("jdbc:h2:~/test")
				.driverClassName("org.h2.Driver")
				.build();
	}

	@Profile(value="test")
	@Bean(name="dataSource")
	public DataSource testDataSource() {
		DataSource dataSource = new EmbeddedDatabaseBuilder()
				.setName("testDB")
				.setType(EmbeddedDatabaseType.H2)
				.addScripts("schema.sql")
				.build();
		return dataSource;
	}

	@Bean(name="jdbcTemplate")
	@Qualifier("testDataSource")
	public JdbcTemplate jdbcTemplate(DataSource dataSource) {
		return new JdbcTemplate(dataSource);
	}

}