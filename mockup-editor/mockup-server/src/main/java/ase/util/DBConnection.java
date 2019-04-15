package ase.util;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {

    private static final Logger logger = LogManager.getLogger(DBConnection.class);
    private static Connection c=null;


    /**
     * if a connection is established shuts it down
     * @throws SQLException
     */
    public static void closeConnection() throws SQLException{
        if(c!=null){
            c.close();
            c=null;
        }
    }

    public static Connection getConnection()throws SQLException,ClassNotFoundException{
        if(c==null){
            Class.forName("org.h2.Driver");
            c= DriverManager.getConnection("jdbc:h2:tcp://localhost/~/test","sa","");
        }
        return c;
    }

}
