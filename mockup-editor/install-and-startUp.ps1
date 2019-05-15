param(
    # this is my own project directory, for you it could be different, change it as needed
    [Parameter()]
    [string]
    $WorkingDir="$PSScriptRoot",
    # DB host, default is localhost
    [string]$serverIp="localhost"
)

# check if Service is up and running
if( (get-service "postgres*" | measure ).Count -eq 0 ) {
  Write-Error "Keinen Postgres Server gefunden" -ea Stop
}
$pgSrv = (get-service 'postgres*') | select -First 1
if( $pgSrv.Status -ne "Running" ) {
  $pgSrv | Start-Service -ea Stop 
}
Push-Location $WorkingDir

mvn -DSERVER_IP=$serverIp clean install

pause

Push-Location .\mockup-server\

mvn spring-boot:run

Pop-Location # .\mockup-server
Pop-Location # $WorkingDir
