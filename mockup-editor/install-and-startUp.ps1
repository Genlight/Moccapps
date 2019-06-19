param(
    # this is my own project directory, for you it could be different, change it as needed
    [Parameter()]
    [string]
    $WorkingDir="$PSScriptRoot",
    # Drop DB is Default, so if db should be kept, use this switch
    [switch]$useOldDB
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

# if(-not $useOldDB) {
#   drobdb -
# }

mvn clean install

pause

Push-Location .\mockup-server\

mvn spring-boot:run

Pop-Location # .\mockup-server
Pop-Location # $WorkingDir
