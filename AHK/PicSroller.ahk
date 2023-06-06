#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

AutoTrim, Off ; traditional assignments off
ListLines Off ;A_ListLines default is on: history of lines most recently executed

#SingleInstance, force
SetBatchLines, 25ms
#Persistent
#MaxHotkeysPerInterval 200
;---------------------------------------------------------------------------------------------------------------
isLoading := 1
tmpW := 0
tmpH := 0
OnScrollTimerFlag := 0
UpdateScrollBarsTimerFlag := 0


SRCCOPY = 0x00CC0020
CS_HREDRAW = 0X2
CS_VREDRAW = 0X1
WS_CLIPCHILDREN = 0x02000000
WS_EX_COMPOSITED = 0x02000000
WS_EX_STATICEDGE := +e0x20000
; The following are "int" in the DLLCall
WM_HSCROLL := 0x114, WM_VSCROLL := 0x115
HORZRES := 0X8, VERTRES := 0XA, BITSPIXEL := 0XC, PLANES := 0XE


;ref https://autohotkey.com/board/topic/95930-window-double-buffering-redraw-gdi-avoid-flickering/

;https://autohotkey.com/board/topic/63262-solveddisable-and-renable-aero/
;DllCall("dwmapi\DwmEnableComposition", "uint", !(dwm:=!dwm))

OnMessage(WM_HSCROLL, "OnScroll"), OnMessage(WM_VSCROLL, "OnScroll")
;OnMessage(11, "DisableSetRedraw") ; Not used here
OnMessage(0x000F, "WM_PAINT")
;OnMessage(0x14, "WM_ERASEBKGND")
OnMessage(0x0201, "WM_LBUTTONDOWN")
; Move window with mouse

Class ImageProps
{

	hWnd
	{
		set
		{
		this._hWnd := value
		}
		get
		{
		return this._hWnd
		}
	}
	dcWidth
	{
		set
		{
		this._dcWidth := value
		}
		get
		{
		return this._dcWidth
		}
	}
	dcHeight
	{
		set
		{
		this._dcHeight := value
		}
		get
		{
		return this._dcHeight
		}
	}
	hdcMem
	{
		set
		{
		this._hdcMem := value
		}
		get
		{
		return this._hdcMem
		}
	}
	hdcScreenCompat
	{
		set
		{
		this._hdcScreenCompat := value
		}
		get
		{
		return this._hdcScreenCompat
		}
	}
	hdcWin
	{
		set
		{
		this._hdcWin := value
		}
		get
		{
		return this._hdcWin
		}
	}
	picH
	{
		set
		{
		this._picH := value
		}
		get
		{
		return this._picH
		}
	}
	picHeight
	{
		set
		{
		this._picHeight := value
		}
		get
		{
		return this._picHeight
		}
	}
	picWidth
	{
		set
		{
		this._picWidth := value
		}
		get
		{
		return this._picWidth
		}
	}
	ScrollWinEx
	{
		set
		{
		this._ScrollWinEx := value
		}
		get
		{
		return this._ScrollWinEx
		}
	}
	picLeftPos
	{
		set
		{
		this._picLeftPos := value
		}
		get
		{
		return this._picLeftPos
		}
	}
	new_pos
	{
		set
		{
		this._new_pos := value
		}
		get
		{
		return this._new_pos
		}
	}
	MoveHwnd()
	{
	;SysGet, VirtualLeft, 76
	;SysGet, VirtualTop, 77
	;SysGet, VirtualWidth, 78
	;SysGet, VirtualHeight, 79
	}
}


Gui, Margin,0,0
Gui, -Caption +Resize +OwnDialogs +HWNDguiHWND ; +WS_EX_STATICEDGE +%WS_CLIPCHILDREN% ; +E%WS_EX_COMPOSITED%
WinSet, Style, -%CS_HREDRAW%, A
WinSet, Style, -%CS_VREDRAW%, A

SM_CXVSCROLL := 2
SM_CYHSCROLL := 21
ImageProps._hWnd := guiHWND
strTemp = ahkpaper.jpg

sleep 100



guiNoPicW := 0
guiNoPicH := 0

;Gui, +AlwaysOnTop

Gui, Add, Button, section vOpenPic gOpenPic HWNDOpenPicHwnd, Open Image

Gui, Add, Radio, Checked section vScrollWin gScrollWin HWNDScrollWinHwnd, ScrollWin


Gui, Add, Radio, xs vScrollWinEx gScrollWinEx HWNDScrollWinExHwnd, ScrollWinEx


Gui, Add, Button, xs vQuit gQuit, Quit Progam

	if (ImageProps.hWnd())
	ImageProps.hdcWin := DllCall("GetDC", "Ptr", ImageProps.hWnd())
	else
	Throw No Window!
ImageProps.hdcMem := DllCall("CreateCompatibleDC", "Ptr", ImageProps.hdcWin())

ImageProps.dcWidth := DllCall( "GetDeviceCaps", "Ptr", ImageProps.hdcWin(), "Int", HORZRES)
ImageProps.dcHeight := DllCall( "GetDeviceCaps", "Ptr", ImageProps.hdcWin(), "Int", VERTRES)

guiW := floor(A_ScreenWidth/2)
guiH := floor(A_ScreenHeight/3)
defGuiW := guiW
defGuiH := guiH

GoSub OpenPic

WinGetPos , , , picLeftPos, , ahk_id %ScrollWinHwnd%
ImageProps.picLeftPos := picLeftPos




GuiGetSize(guiHWND, guiNoPicW, guiNoPicH)

guiNoPicW -= ImageProps.picWidth()
guiNoPicH -= ImageProps.picHeight()


sysget, temp, %SM_CXVSCROLL%

guiW := guiNoPicW + ImageProps.picWidth() + temp
sysget, temp, %SM_CYHSCROLL%
guiH := guiNoPicH + ImageProps.picHeight() + temp

Gui, Show, % "w" . guiW . " h" . guiH,AlwaysOnTop Window
;Gui,Show,w300 h300 Center,AlwaysOnTop Window
;Gui, +LastFound
GroupAdd, MyGui, % "ahk_id " . guiHWND
isLoading := 0
Critical Off
Sleep -1
Return

ScrollWin:
;Gui, +AlwaysOnTop
Gui, Submit, Nohide
ImageProps.ScrollWinEx := ScrollWinEx
Return

ScrollWinEx:
Gui, Submit, Nohide
ImageProps.ScrollWinEx := ScrollWinEx
GuiControlGet, ScrollWinEx
Return


OpenPic:
	if (isLoading)
	imageType := 1
	else
	imageType := 0

	if (!(strTemp := ImageSourceProc(guiHWND, imageType)))
	return

	if (imageType == 2)
	{

	strTemp := DownloadFile(strTemp, "tmp")
	}

	if (ErrorLevel)
	GoSub Esc

	if (imageType == 1)
	{
	ImageProps.picWidth := 250
	ImageProps.picHeight := 250

		if (isLoading)
		gui, add, pic, ys vpicHVar, % strTemp
		else
		{
		GuiControl,, picHVar, *w250 *h250 %strTemp%

		sysget, temp, %SM_CXVSCROLL%
		guiW := guiNoPicW + ImageProps.picWidth() + temp
		sysget, temp, %SM_CYHSCROLL%
		guiH := guiNoPicH + ImageProps.picHeight() + temp
		}

	}
	else
	{
	GetImageSize(strTemp)

	tmpW := ImageProps.picWidth()
	tmpH := ImageProps.picHeight()
		if (!(temp := LoadPicture(strTemp, GDI+ w%tmpW% h%tmpH%)))
		throw "Image Error!"
		else

	ImageProps.picH := temp
	GuiControl,, picHVar, % "*w" tmpW " *h" tmpH " HBITMAP:*" ImageProps.picH()


	DllCall("SelectObject", "Ptr", ImageProps.hdcMem(), "Ptr", ImageProps.picH())
	}


	if (imageType <> 1 || isLoading)
	{
		if (ImageProps.picWidth >= defGuiW - guiNoPicW)
		guiW := defGuiW
		else
		guiW := ImageProps.picWidth + guiNoPicW

		if (ImageProps.picHeight >= defGuiH - guiNoPicH)
		guiH := defGuiH
		else
		guiH := ImageProps.picHeight + guiNoPicH
	}

SysGet, md, MonitorWorkArea, % GetMonNum()

dx := Round(mdleft + (mdRight - mdleft - guiW)/2)

dy := Round(mdTop + (mdBottom - mdTop - guiH)/2)


if (isLoading)
Gui, Show, Hide x%dx% y%dy%,AlwaysOnTop Window
else
Gui, Show, % "x" . dx . " y" . dy . " w" . guiW . " h" . guiH,AlwaysOnTop Window
Return



#if winActive("ahk_class AutoHotkeyGUI") and not winActive("Image Source")
RButton::

hdcScreen := DllCall("CreateDC", "Str", "DISPLAY", "Ptr", 0, "Ptr", 0, "Ptr", 0)

ImageProps.hdcScreenCompat := DllCall("CreateCompatibleDC", "UPtr", hdcScreen)
;Retrieve the metrics for the bitmap associated with the regular device context.
bmPlanes := DllCall( "GetDeviceCaps", "UPtr", hdcScreen, "Int", PLANES)
bmBitsPixel := DllCall( "GetDeviceCaps", "UPtr", hdcScreen, "Int", BITSPIXEL)


ImageProps.dcWidth := DllCall( "GetDeviceCaps", "UPtr", hdcScreen, "Int", HORZRES)
ImageProps.dcHeight := DllCall( "GetDeviceCaps", "UPtr", hdcScreen, "Int", VERTRES)


; The width must be byte-aligned.
;bmWidthBytes := ((bmp.bmWidth + 15) &~15)/8;

; Create a bitmap for the compatible DC.
ImageProps.picH := DllCall( "CreateBitmap", "Int", ImageProps.dcWidth(), "Int", ImageProps.dcHeight(), "Uint", bmPlanes, "Uint", bmBitsPixel, "UPtr", 0)
;ImageProps.picH := DllCall( "CreateCompatibleBitmap", "UPtr", ImageProps.hdcScreenCompat(), "Int", ImageProps.dcWidth(), "Int", ImageProps.dcHeight)

DllCall("SelectObject", "UPtr", ImageProps.hdcScreenCompat(), "UPtr", ImageProps.picH())

	try
	{
	DllCall("BitBlt", "UPtr", ImageProps.hdcScreenCompat(), "int", 0, "int", 0, "int", ImageProps.dcWidth(), "int", ImageProps.dcHeight(), "UPtr", hdcScreen, "int", 0, "int", 0, "Uint", SRCCOPY)
	}
	catch e
	{
	MsgBox, 16,, % "Exception thrown!`n`nwhat: " e.what "`nfile: " e.file . "`nline: " e.line "`nmessage: " e.message "`nextra: " e.extra
	}
;DllCall("BitBlt", "UPtr", ImageProps.hdcWin(), "int", ImageProps.picLeftPos(), "int", 0, "int", ImageProps.dcWidth(), "int", ImageProps.dcHeight(), "UPtr", ImageProps.hdcScreenCompat(), "int", ImageProps.picLeftPos(), "int", 0, "Uint", SRCCOPY)

; Select the bitmap for the compatible DC.


GuiControl,, picHVar, % "*w"A_ScreenWidth " *h"A_ScreenHeight " HBITMAP:*" ImageProps.picH()

;msgbox % "tmp " tmp " ImageProps.hdcWin() " ImageProps.hdcWin() " ImageProps.hWnd() " ImageProps.hWnd() " ImageProps.hdcScreenCompat() " ImageProps.hdcScreenCompat() " ImageProps.dcWidth() " ImageProps.dcWidth() " ImageProps.dcHeight() " ImageProps.dcHeight() " new_pos " new_pos " hdcScreen " hdcScreen
DllCall("DeleteDC", "UPtr", hdcScreen)

gosub GuiSize

Gui, Show, % "x" . dx . " y" . dy . " w" . guiW . " h" . guiH,AlwaysOnTop Window
Return
#ifwinActive


; https://www.autohotkey.com/boards/viewtopic.php?t=81665&p=355816
GetImageSize(imageFilePath)
{
		if !hBitmap := LoadPicture(imageFilePath, "GDI+")
		throw "Failed to load the image"
	VarSetCapacity(BITMAP, size := 4*4 + A_PtrSize*2, 0)
	DllCall("GetObject", "Ptr", hBitmap, "Int", size, "Ptr", &BITMAP)
	DllCall("DeleteObject", "Ptr", hBitmap)
	ImageProps.picWidth := NumGet(BITMAP, 4, "UInt")
	ImageProps.picHeight := NumGet(BITMAP, 8, "UInt")
}

GetMonNum(Hwnd := 0)
{
iDevNumb := 9, monitorHandle := 0,  MONITOR_DEFAULTTONULL := 0, strTemp := ""
VarSetCapacity(monitorInfo, 40)
NumPut(40, monitorInfo)


	if (Hwnd)
	{
		if (monitorHandle := DllCall("MonitorFromWindow", "uint", hWnd, "uint", MONITOR_DEFAULTTONULL))
			&& DllCall("GetMonitorInfo", "uint", monitorHandle, "uint", &monitorInfo)
		{
		msLeft :=		NumGet(monitorInfo, 4, "Int")
		msTop := 		NumGet(monitorInfo, 8, "Int")
		msRight := 		NumGet(monitorInfo, 12, "Int")
		msBottom := 	NumGet(monitorInfo, 16, "Int")
		mswLeft := 		NumGet(monitorInfo, 20, "Int")
		mswTop := 		NumGet(monitorInfo, 24, "Int")
		mswRight := 	NumGet(monitorInfo, 28, "Int")
		mswBottom :=	NumGet(monitorInfo, 32, "Int")
		mswPrimary :=	NumGet(monitorInfo, 36, "Int") & 1
		}
	}
	else
	{
	strTemp := A_CoordModeMouse
	CoordMode, Mouse, Screen
	MouseGetPos, x, y
	CoordMode, Mouse, % strTemp
	}

	; GetMonitorIndexFromWindow(windowHandle)

	Loop %iDevNumb%
	{
		SysGet, mt, Monitor, %A_Index%

		; Compare location to determine the monitor index.
		if (Hwnd)
		{
			if ((msLeft = mtLeft) and (msTop = mtTop)
				and (msRight = mtRight) and (msBottom = mtBottom))
			{
			msI := A_Index
			break
			}
		}
		else
		{
			if (x >= mtLeft && x <= mtRight && y <= mtBottom && y >= mtTop)
			{

			msI := A_Index
			break
			}
		}
	}
	VarSetCapacity(monitorInfo, 0)
	if (msI)
	return msI
	else ; should never get here
	{
	strTemp := "Cannot retrieve Monitor info from the"
		if (fromMouse)
		MsgBox, 8192, , %strTemp% mouse cursor!
		else
		MsgBox, 8192, , %strTemp% target window!
	return 1 ;hopefully this monitor is the one!
	}
}
DownloadFile(URL, fname)
{
		try
		{
			UrlDownloadToFile, %URL%, %fname%
		}
		catch temp
		{
		msgbox, 8208, FileDownload, Error with the bitmap download!`nSpecifically: %temp%
		}
	FileGetSize, temp , % A_ScriptDir . "`\" . fname
		if temp < 1000
		msgbox, 8208, FileDownload, File size is incorrect!
		sleep 300
		return A_ScriptDir . "`\" . fname

}







GuiSize:
	if (!UpdateScrollBarsTimerFlag && !OnScrollTimerFlag)
	{
	UpdateScrollBarsTimerFlag := 1
	SetTimer, UpdateScrollBarsTimer, -10
 	}
Return


UpdateScrollBarsTimer:
GuiGetSize(guiHWND, guiW, guiH)
UpdateScrollBars(guiHWND, guiW, guiH, GuiClWidth, GuiClHeight)
UpdateScrollBarsTimerFlag := 0
Return

DisableSetRedraw()
{

   return 0
}

WM_ERASEBKGND(wParam, lParam)
{
Return 0
}
WM_PAINT(hwnd, uMsg, wParam, lParam)
{
Static SRCCOPY = 0x00CC0020

	if (ImageProps.ScrollWinEx())
	{
	VarSetCapacity(ps, 64)
	hDC := DllCall("BeginPaint", "UInt", ImageProps.hWnd(), "UInt", &ps)

	;WinMove, %hwnd%, , X, Y
		try
		{
			if (ImageProps.hdcScreenCompat())
			DllCall("BitBlt", "uint", hDC, "int", ImageProps.picLeftPos(), "int", 0, "int", ImageProps.dcWidth(), "int", ImageProps.dcHeight(), "uint", ImageProps.hdcScreenCompat(), "int", ImageProps.new_pos(), "int", ImageProps.new_pos(), "uint", SRCCOPY)
			else
			DllCall("BitBlt", "uint", hDC, "int", ImageProps.picLeftPos(), "int", 0, "int", ImageProps.picWidth(), "int", ImageProps.picHeight(), "uint", ImageProps.hdcMem(), "int", ImageProps.new_pos(), "int", ImageProps.new_pos(), "uint", SRCCOPY)
		}
		catch e
		{
		MsgBox, 16,, % "Exception thrown!`n`nwhat: " e.what "`nfile: " e.file . "`nline: " e.line "`nmessage: " e.message "`nextra: " e.extra
		}
	DllCall("EndPaint", "UInt", ImageProps.hwnd(), "UInt", &ps)
	}
	else
	return 1
}


WM_LBUTTONDOWN()
{
	If (A_Gui)
	PostMessage, 0xA1, 2
; 0xA1: WM_NCLBUTTONDOWN, refer to http msdn.microsoft.com/en-us/library/ms645620%28v=vs.85%29.aspx
; 2: HTCAPTION (in a title bar), refer to http msdn.microsoft.com/en-us/library/ms645618%28v=vs.85%29.aspx
}

Quit:
exit()
#if winactive("Image Source")
esc::
gui, ImageSourceDlg: destroy
WinActivate ahk_id %guiHWND%
WinSet, Enable, , ahk_id %guiHWND%
DetectHiddenWindows, Off
return
#ifWinActive
esc::
exit()

exit()
{
;DllCall("DeleteObject", "Ptr", hBMMem)
DllCall("DeleteDC", "UPtr", ImageProps.hdcMem())
DllCall("DeleteDC", "UPtr", ImageProps.hdcScreenCompat())
DllCall("ReleaseDC", "UPtr", ImageProps.hWnd(), "UPtr", ImageProps.hdcWin())

if (FileExist("tmp"))
FileRecycle, tmp
ExitApp
}

#IfWinActive ahk_group MyGui

;PgUp::SendEvent, {PgUp} {WheelUp}
;PgDn::SendEvent, {PgDn} {WheelDown}
;PgUp::Click, WheelUp
;PgDn::Click, WheelDown
PgUp::
+PgUp::
pgUpFlag := 1
Controlclick, , ahk_id %guiHWND%,,WU, 100
;ControlsendRaw, ,{WheelUp}, ahk_id %guiHWND%
PgDn::
+PgDn::
	if (!pgUpFlag)
	{
	Controlclick, , ahk_id %guiHWND%,,WD, 100
	;ControlsendRaw, ,{WheelDown}, ahk_id %guiHWND%
	}
pgUpFlag := 0
Home::
End::
+Home::
+End::
Up::
Down::
+Right::
+Left::
WheelUp::
WheelDown::
+WheelUp:: ; + Right Scroll
+WheelDown::

    ; SB_LINEDOWN=1, SB_LINEUP=0, WM_HSCROLL=0x114, WM_VSCROLL=0x115
	if (!UpdateScrollBarsTimerFlag && !OnScrollTimerFlag)
	{
	SetTimer, OnScrollTimer, -5
	OnScrollTimerFlag := 1
	}
return

OnScrollTimer:

OnScroll((InStr(A_ThisHotkey,"Down") || InStr(A_ThisHotkey,"Right")? 1: (InStr(A_ThisHotkey,"PgDn")? 3: (InStr(A_ThisHotkey,"PgUp")? 2: (InStr(A_ThisHotkey,"Home")? 6: (InStr(A_ThisHotkey,"End")? 7: 0))))), 0, GetKeyState("Shift") ? 0x114 : 0x115, ImageProps.hWnd())
OnScrollTimerFlag := 0
return
#IfWinActive



; ===> gui scrollbars
UpdateScrollBars(GuiNum, GuiWidth, GuiHeight, GuiClWidth, GuiClHeight)
{
static SIF_RANGE=0x1, SIF_PAGE=0x2, SIF_DISABLENOSCROLL=0x8, SB_HORZ=0X0, SB_VERT=0X1

	;Gui, %GuiNum%:Default
	Gui, +LastFound

	; Calculate scrolling area.
	Left := Top := 9999
	Right := Bottom := 0
	WinGet, ControlList, ControlList
		Loop, Parse, ControlList, `n
		{
		GuiControlGet, c, Pos, %A_LoopField%
			if (cX < Left)
			Left := cX
			if (cY < Top)
			Top := cY
			if (cX + cW > Right)
			Right := cX + cW
			if (cY + cH > Bottom)
			Bottom := cY + cH
		}
	Left -= 8
	Top -= 8
	Right += 8
	Bottom += 8
	ScrollWidth := Right-Left
	ScrollHeight := Bottom-Top
	;msgbox % " ScrollWidth " ScrollWidth " GuiWidth " GuiWidth
	if (ScrollWidth < GuiClWidth)
	ScrollWidth := 0
	if (ScrollHeight < GuiClHeight)
	ScrollHeight := 0

	; Initialize SCROLLINFO.
	VarSetCapacity(si, 28, 0)
	NumPut(28, si, 0, "uint") ; cbSize
	NumPut(SIF_RANGE | SIF_PAGE, si, 4, "uint") ; fMask

	; Update horizontal scroll bar.
	NumPut(ScrollWidth, si, 12, "int") ; nMax
	NumPut(GuiWidth, si, 16, "uint") ; nPage
	DllCall("SetScrollInfo", "ptr", WinExist(), "int", SB_HORZ, "ptr", &si, "int", 1)

	sleep, 5

	; Update vertical scroll bar.
	;NumPut(SIF_RANGE | SIF_PAGE | SIF_DISABLENOSCROLL, si, 4, "uint") ; fMask
	NumPut(ScrollHeight, si, 12, "int") ; nMax
	NumPut(GuiHeight, si, 16, "uint") ; nPage
	DllCall("SetScrollInfo", "ptr", WinExist(), "int", SB_VERT, "ptr", &si, "int", 1)

	/*
		if (Left < 0 && Right < GuiWidth)
		x := Abs(Left) > (GuiWidth-Right ? GuiWidth-Right : Abs(Left))
		if (Top < 0 && Bottom < GuiHeight)
		y := Abs(Top) > (GuiHeight-Bottom ? GuiHeight-Bottom : Abs(Top))

		if (x || y)
		DllCall("ScrollWindow", "uint", WinExist(), "int", x, "int", y, "uint", 0, "uint", 0)
	*/
}

GuiGetSize(thisHWnd, ByRef W, ByRef H)
{
	VarSetCapacity(rect, 16, 0)
	;DllCall("GetWindowRect", "Ptr", thisHWnd, "Ptr", &rect)
	DllCall("GetClientRect", "Ptr", thisHWnd, "Ptr", &rect)
	tmp := NumGet(rect, 4, "int")
	H := NumGet(rect, 12, "int")
	H := H - tmp
	tmp := NumGet(rect, 0, "int")
	W := NumGet(rect, 8, "int")
	W := W - tmp
}

OnScroll(wParam, lParam, msg, hwnd)
{
	static SIF_ALL = 0x17, SW_SCROLLCHILDREN = 0x0001, SW_INVALIDATE = 0X2, SW_ERASE = 0X4, SW_SMOOTHSCROLL = 0X10, SCROLL_STEP = 10
	Static rectClp := 0, oldAction := 0, WM_HSCROLL = 0x114, WM_VSCROLL = 0x115
	InitScroll := 0

	Critical
	bar := (lParam)?(msg == WM_HSCROLL): (msg == WM_VSCROLL) ; SB_HORZ=0, SB_VERT=1

	VarSetCapacity(si, 28, 0)
	NumPut(28, si, 0, "uint") ; cbSize
	NumPut(SIF_ALL, si, 4, "uint") ; fMask
		if !DllCall("GetScrollInfo", "ptr", hwnd, "int", bar, "ptr", &si)
		return

	ReInitialize:

		if !(NumGet(rectClp, 8, "int"))
		{
		InitScroll := 1
		VarSetCapacity(rectClp, 16)
		DllCall("GetClientRect", "ptr", hwnd, "ptr", &rectClp)
		}

	new_pos := NumGet(si, 20, "int") ; nPos

	action := wParam & 0xFFFF

		if ((action != oldAction) && !InitScroll)
		{
			;Up: 0, Down :1: PgUp: 2, PgDown: 3
			if !((action == 0 && oldAction == 2) || (action == 2 && oldAction == 0) || (action == 1 && oldAction == 3) || (action == 3 && oldAction == 1) || action > 3)
			{
			VarSetCapacity(rectClp, 0)
			oldAction := Action
			GoTo ReInitialize
			}
		}

		Switch (action)
		{
		case 0: ; SB_LINEUP
		{
		new_pos -= SCROLL_STEP
			if (InitScroll)
			{
			spr := NumGet(rectClp, 4, "int") + SCROLL_STEP/5
			NumPut(spr, &rectClp + 4, "int")
			}
		}
		case 1: ; SB_LINEDOWN
		{
		new_pos += SCROLL_STEP
			if (InitScroll)
			{
			spr := NumGet(rectClp, 12, "int") - SCROLL_STEP/5
			NumPut(spr, &rectClp + 12, "int")
			}
		}
		case 2: ; SB_PAGEUP
		{
		new_pos -= NumGet(si, 16, "uint")
			if (InitScroll)
			{
			spr := NumGet(rectClp, 4, "int") + NumGet(si, 16, "uint")
			NumPut(spr, &rectClp + 12, "int")
			}
		}
		case 3: ; SB_PAGEDOWN
		{
		new_pos += NumGet(si, 16, "uint")
			if (InitScroll)
			{
			spr := NumGet(rectClp, 12, "int") - NumGet(si, 16, "uint")
			NumPut(spr, &rectClp + 4, "int")
			}
		}
		case 4: ; SB_THUMBTRACK
		new_pos := wParam>>16
		case 5: ; SB_THUMBPOSITION
		new_pos := wParam>>16
		case 6: ; SB_TOP
		new_pos := NumGet(si, 8, "int") ; nMin
		case 7: ; SB_BOTTOM
		new_pos := NumGet(si, 12, "int") ; nMax
		Default:
		return
		}

	min := NumGet(si, 8, "int") ; nMin
	max := NumGet(si, 12, "int") - NumGet(si, 16, "uint") ; nMax-nPage
	new_pos := new_pos > max ? max : new_pos
	new_pos := new_pos < min ? min : new_pos

	old_pos := NumGet(si, 20, "int") ; nPos
	;msgbox % old_pos " " new_pos
	x := y := 0
		if (bar == 0) ; SB_HORZ
		x := old_pos - new_pos
		else
		y := old_pos - new_pos

	oldAction := Action
	ImageProps.new_pos := new_pos
	; Scroll contents of window and invalidate uncovered area.
	spr := ImageProps.picLeftPos() - new_pos
		if (spr > 0)
		{
		NumPut(0, rectClp, 0, "uint")
		NumPut(8, rectClp, spr, "uint")
		;msgbox % "ImageProps.picLeftPos() " ImageProps.picLeftPos() " spr " spr " x " x " new_pos " new_pos " \nNumGet(rectClp, 0, int) "  NumGet(rectClp, 0, "int") " NumGet(rectClp, 8, int) "  NumGet(rectClp, 8, "int")
		}

	;Note  The ScrollWindow function is provided for backward compatibility. New applications should use the ScrollWindowEx function.
	; That statement was in 1992 for Win3.1!

		if (action == 5 || action == 4)
		{
			if (ImageProps.ScrollWinEx())
			{
				try
				{
				DllCall("User32.dll\ScrollWindowEx", "ptr", hwnd, "int", x, "int", y, "ptr", 0, "ptr", ((spr>0)? &rectClp:0), "ptr", 0, "ptr", 0, "Uint", SW_SCROLLCHILDREN | SW_INVALIDATE)
				}
				catch e
				{
				MsgBox, 16,, % "Exception thrown!`n`nwhat: " e.what "`nfile: " e.file . "`nline: " e.line "`nmessage: " e.message "`nextra: " e.extra
				}
			}
			else
			DllCall("ScrollWindow", "ptr", hwnd, "int", x, "int", y, "ptr", 0, "ptr", 0)
		}
		else
		{
			if (ImageProps.ScrollWinEx())
			{
				try
				{
				DllCall("User32.dll\ScrollWindowEx", "ptr", hwnd, "int", x, "int", y, "ptr", 0, "ptr", ((spr>0)? &rectClp:0), "ptr", 0, "ptr", 0, "Uint", SW_SCROLLCHILDREN | SW_INVALIDATE)
				}
				catch e
				{
				MsgBox, 16,, % "Exception thrown!`n`nwhat: " e.what "`nfile: " e.file . "`nline: " e.line "`nmessage: " e.message "`nextra: " e.extra
				}
			}
			else
			DllCall("ScrollWindow", "ptr", hwnd, "int", x, "int", y, "ptr", 0, "ptr", 0)
		}

	DllCall("UpdateWindow", "ptr", hwnd)
	; Update scroll bar.

	NumPut(new_pos, si, 20, "int") ; nPos
	DllCall("SetScrollInfo", "ptr", hwnd, "int", bar, "ptr", &si, "int", 1)

	/*
	GetScrollInfo (hwnd, SB_VERT, &si) ;
	; If the position has changed, scroll the window and update it
		if (si.nPos != iVertPos)
		{
		ScrollWindow (hwnd, 0, cyChar * (iVertPos − si.nPos), NULL, NULL)
		UpdateWindow (hwnd)
		}
	return 0;
	*/

}

ImageSourceProc(guiHWND, byref imgType := 0)
{
	;https://autohotkey.com/board/topic/72109-ahk-fonts/
	; gui variables in function must be global
	Global GuiImageSourceDlgInternalImage, GuiImageSourceDlgImageRet, GuiImageSourceDlgURL, GuiImageSourceDlgAccept, outputText
	static imgRet, acceptDlg := 0, recFontTog := 0

		if (imgType == 1)
		{
		gosub GuiImageSourceDlgInternalImage
		return imgRet
		}
		else
		{
		gui, ImageSourceDlg: +owner%guiHWND% +resize -MaximizeBox -MinimizeBox HWNDhWndImageSourceDlg
		gui, ImageSourceDlg: add, button, section gGuiImageSourceDlgURLButton, Select URL
		gui, ImageSourceDlg: add, edit, ys vGuiImageSourceDlgURL, https://www.autohotkey.com/assets/images/ahk_wallpaper_reduced.jpg
		gui, ImageSourceDlg: add, text, wp section x0 vGuiImageSourceDlgImageRet vGuiImageSourceDlgImageRet
		gui, ImageSourceDlg: add, button, section x0 gGuiImageSourceDlgInternalImage vGuiImageSourceDlgInternalImage, Select Embedded Image
		gui, ImageSourceDlg: add, button, ys gGuiImageSourceDlgImagePath, Select ImagePath
		gui, ImageSourceDlg: add, button, ys gGuiImageSourceDlgAccept vGuiImageSourceDlgAccept, Accept
		WinSet, Disable, , ahk_id %guiHWND%

		gui, ImageSourceDlg: show,, Image Source,AlwaysOnTop Window


		WinWaitActive, ahk_id %guiHWND%

			if (acceptDlg)
			return imgRet
			else
			return 0
		}

	ImageSourceDlgGuiClose:
	acceptDlg := 0
	gui, ImageSourceDlg: Destroy
	; problem with WinWaitClose next invocation when instead of destroyed, ImageSourceDlg is hidden
	WinActivate ahk_id %guiHWND%
	WinSet, Enable, , ahk_id %guiHWND%

	return 0

	GuiImageSourceDlgAccept:
	acceptDlg := 1
		if (imgType <> 1)
		GuiControlGet imgRet, ImageSourceDlg:, GuiImageSourceDlgImageRet

	gui, ImageSourceDlg: Destroy
	WinActivate ahk_id %guiHWND%
	WinSet, Enable, , ahk_id %guiHWND%
	return imgRet

	GuiImageSourceDlgURLButton:
	gui, ImageSourceDlg: submit, nohide
	strTemp := imgType := 2
	GuiControlGet imgRet, ImageSourceDlg:, GuiImageSourceDlgURL
	GuiControl, ImageSourceDlg:, GuiImageSourceDlgImageRet, %imgRet%
		if (imgRet)
		GuiControl, ImageSourceDlg: Enable, GuiImageSourceDlgAccept
		else
		GuiControl, ImageSourceDlg: Disable, GuiImageSourceDlgAccept
	return

	GuiImageSourceDlgInternalImage:
	gui, ImageSourceDlg: submit, nohide
	imgType := 1
	GuiControl, ImageSourceDlg:, GuiImageSourceDlgImageRet, Use Embedded Image
	imgRet := "iVBORw0KGgoAAAANSUhEUgAAAPoAAAEACAMAAACtTJvEAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAAAEO5/0G7/0G8/kG8/0K+/0e5/ka4/0a6/0W9/kS8/0W+/0q3/0y2/k62/0m4/0u6/km6/0q8/0m//ki+/024/026/ky6/028/0++/k6+/1O0/1K2/1ay/1W1/lS0/1S2/1K4/1O6/lG6/1C8/1G+/lG+/1W5/lW4/1W6/1S9/lW8/1S+/1i0/1m2/12y/121/163/l22/1i4/1q6/1m8/1q+/lm+/124/1y6/128/12//l6+/2O0/2G3/2O5/mK4/2G7/mG6/2O8/mC8/2G+/2W4/2S6/2W8/mS8/2W+/2q6/2m8/2m+/266/228/26//my+/3K7/3K8/3G+/0bA/kbA/0rA/knA/0vC/0zA/0/D/k3C/07E/k7E/1PB/lHA/1DC/lDC/1LE/lLE/1PH/1bA/lXA/1bD/lbC/1XE/lTE/1XG/lbG/1bI/lXI/1nA/1nC/1jF/lrE/1nG/17B/l3A/13C/lzC/1/E/l3E/13G/l7G/1rI/lnI/13I/lzI/1zK/l3K/2LB/mHA/2HC/2HE/2HH/mHG/2TB/mXA/2XC/mXC/2XE/2TG/mXG/2DI/mLI/2HK/2HM/2PO/2bJ/mXI/2bK/mbK/2XM/mXM/2bO/mXO/2rA/mjA/2jC/2nE/mnE/2nG/2zA/23C/2zE/23G/2nI/mnI/2nK/2nM/mnM/2nO/mnO/23I/23K/m3K/2/N/m3M/2zP/m3O/2rQ/2rS/mzQ/m3Q/2zS/m7S/3HA/3HC/3LE/3HG/nHG/3bA/3XC/3XE/3XG/3HI/3HK/nHK/3DN/nDM/3DP/3XI/3XK/3jA/3jD/3jE/3nG/33D/33F/33G/3jI/3vK/33I/3DQ/oDD/4LH/4bG/4DI/4XI/4nI/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwzn70AAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQBwYWludC5uZXQgNC4wLjIx8SBplQAAOw9JREFUeF7tfY9zG1me17G2Lp50QVY6z6jpWmCCtY19MUdBHEyMuTqOCccNLLDAKJKicfXEyjUapddqJLK+rrYsdTm6Ll+y3pZ8TcdWjXFYG+ti+ab2RrHWt0vYXd/sksBtcRwBjvtfmu/3dUtqyZLdkpXM7B2fxOqW7MT66Pve931/ve/7GfPPLP4/9T81YO8nk8ndh/azU/Gnifqib8TrGxkZ8Y54L3jz9ovd8aeGet6L8MEfr/eiDz6EC2eR/1NC/TGy9jMMDX/g0eeDT+CSz/5mF5yb+nft62cKIE7TPiDNsCyLFx+D7C/Q9vc74jzUH/un7LvPFve9fpqmgTX8DXBwCQB9H4MT4L79I53QN/U9Xbph337GeOj1MhEGKHMcx/O3eZ6D+wAHYx8Ef8qE74/68cVS4eH37SefNXCkA23+dlxMinFRjCN5Dkb9KO31+SbtnzqJvqiPmub+t+z7zxz0aCDAcnwciQNSqZQYTwJ7GP0046W99o+dRB/UmZppRn5gPzmJA/rh2tra4+6f9mAh0TjSkfOiJKVS8IUfAEqeZSM0KPqk/YMn0Dv12/AV+UPrvh33J0HhMDD4pFgmqPL8q+d/7Kc5DkZ5SpbkOiRZEuNx4B5gGLBx7J88gV6pcxo8LHeWedKHEhDhk1/M2C9R/NlW1bmA0zzOw+9MEeoqYY6DHgTP8Syouq4jvkfqeyV4qP2e9aQVSS98/jx8+pKsaoauJ6yXN+WL1s0rwQUaPmsR6EqapqrwF6DBO5AkmPgw30HsXr/9s+3ojXr5KT6ukvtW5L0My3OiJEmqrpeHLlIhQKyI36pIXyc/8irgZXgt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"
	imgRet .= "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"
	imgRet:="HICON:*" b64Decode(imgRet)
	return

	GuiImageSourceDlgImagePath:
	gui, ImageSourceDlg: submit, nohide
	EnvGet, strTemp, CSIDL_DEFAULT_MYPICTURES
		If (!strTemp)
		{
		EnvGet, strTemp, USERPROFILE
		imgRet := strTemp . "\Pictures"
		if (FileExist(imgRet))
		strTemp := imgRet
		}
	FileSelectFile, imgRet, 1, %strTemp%, Select a Picture, Img (*.bmp; *.emf; *.exif; *.gif; *.ico; *.jpg; *.png; *.tif; *.wmf)

		if (ErrorLevel)
		strTemp := imgRet := 0
		else
		{
		imgType := 0
		GuiControl, ImageSourceDlg:, GuiImageSourceDlgImageRet, %imgRet%
		}
	return

}
B64Decode(B64, nBytes := "", W := "", H := "")
{
Bin = {}, BLen := 0, hICON := 0
Ptr := A_PtrSize ? "Ptr" : "UInt"
UPtr := A_PtrSize ? "UPtr" : "UInt"

	if !nBytes
	nBytes := ceil(StrLen(StrReplace( B64, "=", "=", e))/4*3) - e

VarSetCapacity( Bin, nBytes, 0 ), BLen := StrLen(B64)
	If DllCall( "Crypt32.dll\CryptStringToBinary", "Ptr", &B64, "UInt", BLen, "UInt", 0x1
	, "Ptr", &Bin, "UInt*", nBytes, "Int", 0, "Int", 0 )
	hICON := DllCall( "CreateIconFromResourceEx", "Ptr", &Bin, "UInt", nBytes, "Int", True
	, "UInt","0x30000", "Int", W, "Int", H, "UInt", 0, "UPtr" )
Return hICON
}


/*
     case WM_PAINT :          hdc = BeginPaint (hwnd, &ps) ;
               // Get vertical scroll bar position
          si.cbSize = sizeof (si) ;          si.fMask  = SIF_POS ;          GetScrollInfo (hwnd, SB_VERT, &si) ;          iVertPos = si.nPos ;
               // Get horizontal scroll bar position          GetScrollInfo (hwnd, SB_HORZ, &si) ;          iHorzPos = si.nPos ;
               // Find painting limits
          iPaintBeg = max (0, iVertPos + ps.rcPaint.top / cyChar) ;          iPaintEnd = min (NUMLINES − 1,                           iVertPos + ps.rcPaint.bottom / cyChar) ;
          for (i = iPaintBeg ; i <= iPaintEnd ; i++)          {               x = cxChar * (1 − iHorzPos) ;               y = cyChar * (i − iVertPos) ;
               TextOut (hdc, x, y,                        sysmetrics[i].szLabel,                        lstrlen (sysmetrics[i].szLabel)) ;
               TextOut (hdc, x + 22 * cxCaps, y,                        sysmetrics[i].szDesc,                        lstrlen (sysmetrics[i].szDesc)) ;
               SetTextAlign (hdc, TA_RIGHT | TA_TOP) ;
               TextOut (hdc, x + 22 * cxCaps + 40 * cxChar, y, szBuffer,                        wsprintf (szBuffer, TEXT ("%5d"),                             GetSystemMetrics (sysmetrics[i].iIndex))) ;
               SetTextAlign (hdc, TA_LEFT | TA_TOP) ;          }
          EndPaint (hwnd, &ps) ;          return 0 ;
*/ 


; https://www.autohotkey.com/boards/viewtopic.php?t=86418
; 
