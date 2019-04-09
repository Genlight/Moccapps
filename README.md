# moccapps
the best Prototype Mockup - Editor you have ever seen.

We present to you the slim and fast editor, in which you you can operate with your team simultanously on objects.

## Installation
To build this project, install following dependencies:

## Downloads
Wir benötigen all diese Install
### Maven 
https://www-us.apache.org/dist/maven/maven-3/3.6.0/binaries/apache-maven-3.6.0-bin.zip
> Path has to be set sysstem wide, see further below

### Java JDK 1.8
https://download.oracle.com/otn-pub/java/jdk/8u201-b09/42970487e3af4f5aa5bca3f542482c60/jdk-8u201-windows-x64.exe
> Path has to be set sysstem wide, see further below

## Python v2.7  (needed for node-gyp)
https://www.python.org/ftp/python/2.7.16/python-2.7.16.amd64.msi
> Path has to be set sysstem wide, see further below

### GTK, (needed for Canavs-node-windows-development)
http://ftp.gnome.org/pub/GNOME/binaries/win64/gtk+/2.22/gtk+-bundle_2.22.1-20101229_win64.zip
> unpack in Dircetory C:\GTK

## set System Environment Variables
following System Environment variables >have to be set  in order for the build to work. (Paths to Executables like mvn.exe, or node.exe, normally located in a bin-folder)
- Python
- Java JDK
- Node
- Maven

Add these in Windows with these steps:
- Windows-Key + Q
- type "Systemumgebungsvariablen setzen" (+ [enter])
- then go to "Umgebungsvariablen..." -> Systemvariablen -> "Path"
- click on "Bearbeiuten..."
- Add your Executable-paths of the ment. programs with neu..
- Important: some java applications install java under commonfiles/javapath; they will be set at the front in the settings, make sure that they get set at the end (with "nach unten" set the ranking)
- click ok through all views 

## Build locally
`cd /<YOUR_DIR>/mockup-editor` \
`mvn clean install`  \
For the first time, use clean, \
then use mvn install for all following builds)
 
This will build the project.
 This command will install node.js locally for this project, as well as make an angular project in mockup-client.
 
 ## Run Spring Server
 `cd /YOUR_DIR/mockup-editor` \
 `mvn spring-boot:run` \
 
 server available at http://localhost:8090
 
 login credentials:
 user="user"
 password=generated string in the spring terminal

### Killing used ports
with powershell: \
`(Get-NetTCPConnection -LocalPort 8090 -ea SilentlyContinue).OwningProcess | Get-Process | Stop-Process` \

headsUp: needs Powershell v3 or higher to be installed.



