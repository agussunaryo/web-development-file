#SingleInstance, Force

;F4::ExitApp

;file = C:\Users\roder\OneDrive\Pictures\ahk_legend.png ; Replace as needed

FileSelectFile, SelectedFile, 3, , Open a file, Text Documents (*.txt; *.doc)
if (SelectedFile = "")
    MsgBox, The user didn't select anything.
else
    MsgBox, The user selected the following:`n%SelectedFile%

;F4::ExitApp

color = FFFFFF ; White
Gui, New
;Gui, Add, Picture,, %file%
Gui, Add, Picture,, %Selectedfile%
Gui, Color, %color%
Gui, +LastFound -Caption +AlwaysOnTop +ToolWindow -Border
Gui, Show, x100 y100

Space::
toggle := !toggle
If toggle
	;Gui, Show, w200 h200
    Gui, Show, x100 y100
else
	Gui, hide
return

F4::ExitApp

GuiEscape:
GuiClose:
;exitapp
return

!F4::ExitApp  ; Ctrl + F4
