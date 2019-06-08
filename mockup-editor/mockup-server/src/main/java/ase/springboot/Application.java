package ase.springboot;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;
import javax.validation.Valid;

/**
 * @author group2
 *
 *
 */
@Configuration
@ComponentScan(basePackages = {"ase"})
@EnableAutoConfiguration
@PropertySource(value = "classpath:application.properties")
public class Application extends SpringBootServletInitializer {

	@Value("${spring.datasource.url.test}")
	public String testDataUrl;

	public static void main(String[] args) {
		SpringApplication.run(Application.class,args);
	}

/*	@Profile(value="prod")
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
	}*/
	@Profile(value="test")
	@Bean
	public DataSource dataSource() {
		String finalJdbc = testDataUrl;
		if(System.getenv("SERVER_IP")!=null){
			finalJdbc = testDataUrl.replace("localhost",System.getenv("SERVER_IP")); //Gitlab CI
		}
		else{
			finalJdbc = testDataUrl.replace("localhost",System.getProperty("SERVER_IP"));
		}

		return DataSourceBuilder
				.create()
				.username("postgres")
				.password("test")
				//.url("jdbc:postgresql://localhost:5432/test")
				.url(finalJdbc)
				.driverClassName("org.postgresql.Driver")
				.build();
	}

	/*@Bean
	public LocalContainerEntityManagerFactoryBean entityManagerFactory() {

		HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
		vendorAdapter.setDatabase(Database.POSTGRESQL);
		vendorAdapter.setGenerateDdl(true);
		vendorAdapter.setShowSql(true);

		LocalContainerEntityManagerFactoryBean factory = new LocalContainerEntityManagerFactoryBean();
		factory.setJpaVendorAdapter(vendorAdapter);
		factory.setPackagesToScan(getClass().getPackage().getName());
		factory.setPackagesToScan("ase.DTO");
		factory.setDataSource(dataSource());
		factory.setJpaProperties(jpaProperties());

		return factory;
	}

	private Properties jpaProperties() {
		Properties properties = new Properties();

		properties.put("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");
		properties.put("hibernate.show_sql", "true");
		properties.put("spring.jpa.properties.hibernate.jdbc.lob.non_contextual_creation","true");
		return properties;
	}

	@Bean
	public PlatformTransactionManager transactionManager() {

		JpaTransactionManager txManager = new JpaTransactionManager();
		txManager.setEntityManagerFactory(entityManagerFactory().getObject());
		return txManager;
	}*/

	@Bean
	public JdbcTemplate jdbcTemplate(DataSource dataSource) {
		return new JdbcTemplate(dataSource);
	}

}
