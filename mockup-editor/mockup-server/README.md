# Start DB with docker Toolbox

## Abstract

Docker Toolbox is based on VirtualBox

install above link, so you get the Basic toolkit to work with it. 

## Start DB wihtout native docker
1. Start docker with 
**Docker Quickstart terminal** 

2. Start **Kitematic** (installed with a. Link) and check the IP of your containers. 

3. Change IP in \moccapps\mockup-editor\mockup-server\src\main\resources\application.properties, Line 18: 
spring.datasource.url=jdbc:postgresql://**192.168.99.100**:5432/moccapps
spring.datasource.username=postgres

4. Start the application like your used to with mvn install and mvn spring-boot:run

## PGAdmin
PgAdmin works out of the box with a local postgres Installation. 
For usage with the docker Toolbox variant, do the following: 

1. install pgAdmin4
2. start pgAdmin
3. When you see the interface, right-click on Servers, then choose "Create -> Server..."
4. use some 
5. **IMPORTANT**: go to Tab "Connection" and insert the IP of your Virtual BOX (can be found ether with ipconfig.exe or Kitematic, s. above)
6. Password can be also found in the application.properties file ( should be 'test'). 
7. Save it
8.  Now you should see it in the Servers and it can be used as normal

