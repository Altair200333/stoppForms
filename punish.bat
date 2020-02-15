echo off
tasklist /fi "imagename eq cmd.exe" |find ":" > nul
if errorlevel 1 (taskkill /f /im "cmd.exe")