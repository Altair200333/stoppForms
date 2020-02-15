echo off
:start

tasklist /fi "imagename eq node.exe" |find ":" > nul
if errorlevel 0 (
	echo not found
	:boot
	tasklist /fi "imagename eq node.exe" |find ":" > nul
	if errorlevel 1 (
		
		goto boot
		)
	start cmd.exe /k "node tmp.js"

	)

goto start
exit
