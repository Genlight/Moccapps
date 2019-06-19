Push-Location $PSScriptRoot

Push-Location ".\mockup-client"

mvn install

Pop-Location

Copy-Item ".\mockup-client\src\main\web\client\dist\client\" -Destination ".\target\classes\resources\" -Recurse -Force

Push-Location ".\mockup-server"

mvn spring-boot:run
