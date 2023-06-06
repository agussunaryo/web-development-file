^+4::             ; Ctrl + Shift + 4
	run, "C:\Windows\system32\SnippingTool.exe"
	Sleep, 500
	WinActivate, "Snipping Tool"
	send, !n
	send, r
Return

^Esc:: ExitApp
!Esc:: ExitApp
#Esc:: ExitApp
^!Esc:: ExitApp
