param(
  [Parameter(Mandatory=$true)]
  [string]$Password
)

﻿createdb --username=postgres --owner=postgres test password $Password
