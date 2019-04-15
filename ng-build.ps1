
$home = Get-Location


$clientDir = Join-Path $home "mockup-editor\mockup-client\src\main\web\client"

# Location of ressources at the server side
$serverDir = Join-Path $home "mockup-editor\mockup-client\" 

Push-Location $clientDir

ng build --prod

Pop-Location 

Remove-Item -Path $server -Recurse -Force

# copying compiled folders to server-location
Copy-Item "$clientDir\dist" $serverDir -Force 