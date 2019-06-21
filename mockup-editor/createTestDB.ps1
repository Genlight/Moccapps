param(
  [Parameter(Mandatory=$true)]
  [string]$Password
)

﻿createdb.exe -U postgres --owner=postgres -W $Password
