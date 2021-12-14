# moccapps

the best Prototype Mockup - Editor you have ever seen.

We present to you the slim and fast editor, in which you you can operate with your team simultanously on objects.

## Installation
To build this project, install following dependencies:

## Downloads
We need all of the following framework packages: 

### Maven 
https://www-us.apache.org/dist/maven/maven-3/3.6.0/binaries/apache-maven-3.6.0-bin.zip
> Path has to be set sysstem wide, see further below

### Java JDK 1.8
https://download.oracle.com/otn-pub/java/jdk/8u201-b09/42970487e3af4f5aa5bca3f542482c60/jdk-8u201-windows-x64.exe
> Path has to be set sysstem wide, see further below

### Docker for Windows
Because of changes in our DB Setup, we require Docker. 
For Windows10 Pro, Education or Enterprise, install [Docker for Windows] (https://docs.docker.com/docker-for-windows/install/) 


For older Windows Versions (and Home Ed), install [Docker Toolbox] 
(https://github.com/docker/toolbox/releases/tag/v18.09.3)

see usage with Postgres and docker toolbox, [this README](https://gitlab.com/ase_grp02/moccapps/tree/devel/mockup-editor/mockup-server/README.md)

# Windows-dev-tools
for node-gyp we use v2.7, a C++-Compiler and Visual Studio Code 2015/17 are necessary. 

Execute the following code with a root account: 
`npm install --global windows-build-tools`

## set System Environment Variables
following System Environment variables have to be set in order for the build to work. (Paths to Executables like mvn.exe, or node.exe, normally located in a bin-folder)
- Python
- Java JDK
- Node
- Maven

Add these in Windows with these steps:
- Windows-Key + Q
- type "Systemumgebungsvariablen setzen" (+ [enter])
- then go to "Umgebungsvariablen..." -> Systemvariablen -> "Path"
- click on "Bearbeiten..."
- Add your Executable-paths of the ment. programs with neu..
- Important: some java applications install java under commonfiles/javapath; they will be set at the front in the settings, make sure that they get set at the end (with "nach unten" set the ranking)
- click ok through all views 

## Db Setup
We use PostgreSQL x64, v11, for that, download the image for Windows from [here](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)

After start, please run createTestDB.ps1 a single time. this is needed for a local installation of postgreSQL. It uses a CLI tool. If you don't work with Windows7 or above, use the command of the script and run it manually. this tools come with each version of postgres and should be named and behave the same. 

## Build locally
`cd /<YOUR_DIR>/mockup-editor` 

`mvn clean install` 

For the first time, use clean,

then use mvn install for all following builds)
 
This will build the project.
 This command will install node.js locally for this project, as well as make an angular project in mockup-client.
 
## Run Spring Server 
 `cd /YOUR_DIR/mockup-editor`  
 `mvn spring-boot:run`  
 
 server available at http://localhost:8090
 
 login credentials:
 user="user"
 password=generated string in the spring terminal


### Alternative 
you can use the Powershell script mockup-editor/install-and-startup.ps1 to 

### Killing used ports
with powershell: \
`Get-Process -Id (Get-NetTCPConnection -LocalPort 8090 -ea SilentlyContinue).OwningProcess | Stop-Process` \

headsUp: needs Powershell v3 or higher to be installed.