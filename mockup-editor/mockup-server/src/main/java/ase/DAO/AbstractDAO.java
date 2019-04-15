package ase.DAO;

import ase.util.DBConnection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import java.sql.Connection;
import java.sql.SQLException;

public abstract class AbstractDAO {

    @Autowired
    protected JdbcTemplate jdbcTemplate;

    protected Connection connection;

    protected Connection getConnection() throws SQLException {
        if (connection==null) {
            connection = jdbcTemplate.getDataSource().getConnection();
        }
        return connection;
    }
}
