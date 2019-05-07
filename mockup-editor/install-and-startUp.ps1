param(
    # this is my own project directory, for you it could be different, change it as needed
    [Parameter()]
    [string]
    $WorkingDir="$env:USERPROFILE\atom-projects\moccapps\mockup-editor"
)

Push-Location $WorkingDir

mvn install

pause

Push-Location .\mockup-server\

mvn spring-boot:run