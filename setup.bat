@echo off
setlocal enabledelayedexpansion

:: ============================================================
:: OMNITX Setup Script v4.0.1
:: Pure CMD - Direct Downloads - No Package Manager
:: ============================================================
:: One-liner CMD:  curl -L https://omnitx.github.io/setup.bat -o %TEMP%\omnitx.bat && %TEMP%\omnitx.bat
:: One-liner PS:   iwr https://omnitx.github.io/setup.bat -o $env:TEMP\omnitx.bat; & $env:TEMP\omnitx.bat
:: ============================================================

:: ============================================================
:: CONFIGURATION
:: ============================================================
set "SCRIPT_VERSION=4.0.1"
set "LOG_FILE_NAME=OMNITX_Setup_Log.txt"
set "LOG_TO_DESKTOP=yes"

:: --- ZeroTier Network ---
set "ZT_NETWORK=17d709436c5d1c9e"

:: --- DNS Servers ---
set "DNS_PRIMARY=1.1.1.1"
set "DNS_SECONDARY=1.0.0.1"

:: --- App Catalog ---
:: Format: set "APP_N=Name|URL|Silent Flags|Type"
:: Types: standard | vnc | zerotier
set "APP_1=7-Zip|https://www.7-zip.org/a/7z2409-x64.exe|/S|standard"
set "APP_2=WinRAR|https://www.win-rar.com/fileadmin/winrar-versions/winrar/winrar-x64-710.exe|/s|standard"
set "APP_3=Notepad++|https://github.com/notepad-plus-plus/notepad-plus-plus/releases/download/v8.7.4/npp.8.7.4.Installer.x64.exe|/S|standard"
set "APP_4=Everything|https://www.voidtools.com/Everything-1.4.1.1026.x64-Setup.exe|/S|standard"
set "APP_5=PotPlayer|https://t1.daumcdn.net/potplayer/PotPlayer/Version/Latest/PotPlayerSetup64.exe|/S|standard"
set "APP_6=qBittorrent|https://github.com/qbittorrent/qBittorrent/releases/download/release-5.0.4/qbittorrent_5.0.4_x64_setup.exe|/S|standard"
set "APP_7=LocalSend|https://github.com/localsend/localsend/releases/download/v1.16.2/LocalSend-1.16.2-windows-x86-64.exe|/S /VERYSILENT|standard"
set "APP_8=Cloudflare WARP|https://1111-releases.cloudflareclient.com/windows/Cloudflare_WARP_Release-x64.msi|/quiet /norestart|standard"
set "APP_9=TightVNC|https://github.com/Tight-VNC/tightvnc/releases/download/v2.8.85/tightvnc-2.8.85-gpl-setup-64bit.msi|/quiet /norestart ADDLOCAL=Server SERVER_REGISTER_AS_SERVICE=1 SERVER_ADD_FIREWALL_EXCEPTION=1 SET_USEVNCAUTHENTICATION=1 VALUE_OF_USEVNCAUTHENTICATION=0 SET_REMOVEWALLPAPER=1 VALUE_OF_REMOVEWALLPAPER=0|standard"
set "APP_10=ZeroTier|https://download.zerotier.com/RELEASES/1.14.2/dist/ZeroTier%%20One.msi|/quiet /norestart|zerotier"
set "TOTAL_APPS=10"
:: ============================================================

:: --- Mode flags ---
set "DRYRUN=0"
set "AUTO=0"
set "SINGLE_APP=0"
set "SINGLE_APP_NUM=0"

if /i "%~1"=="dryrun" set "DRYRUN=1"
if /i "%~1"=="auto"   set "AUTO=1"
if /i "%~1"=="app" (
    if not "%~2"=="" (
        set "SINGLE_APP=1"
        set "SINGLE_APP_NUM=%~2"
    )
)

:: --- Admin Check & Auto-Elevation ---
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo  Requesting Administrator privileges...
    powershell -Command "Start-Process cmd -ArgumentList '/c \"%~f0\"' -Verb RunAs" >nul 2>&1
    exit /b
)

:: --- Log File ---
if /i "%LOG_TO_DESKTOP%"=="yes" (
    set "LOG_FILE=%USERPROFILE%\Desktop\%LOG_FILE_NAME%"
) else (
    set "LOG_FILE=%~dp0%LOG_FILE_NAME%"
)

:: ============================================================
:: Main Entry
:: ============================================================
cls
call :Banner

echo   [1] Install OMNITX Setup (Apps ^& Tools)
echo   [2] Fix ^& Repair Windows
echo   [3] Exit
echo.
set /p "MAIN_CHOICE=Select (1/2/3): "

if "%MAIN_CHOICE%"=="1" goto Menu_Apps
if "%MAIN_CHOICE%"=="2" goto Menu_Fix
if "%MAIN_CHOICE%"=="3" goto ExitScript
goto MainEntry

:: ============================================================
:: Menu: Install Apps
:: ============================================================
:Menu_Apps
cls
call :Banner

echo   ============================================================
echo    APP INSTALLER - Direct Downloads (No Package Manager)
echo    Total apps: %TOTAL_APPS%
echo   ============================================================
echo    Y = Install    N = Skip    ESC = Abort remaining
echo   ============================================================
if %DRYRUN%==1 echo    *** DRY RUN MODE - Nothing will be installed ***
echo.

set "SUCCESS_COUNT=0"
set "FAIL_COUNT=0"
set "SKIP_COUNT=0"
set "ABORTED=0"

if %SINGLE_APP%==1 (
    call :RunApp %SINGLE_APP_NUM%
) else (
    call :RunApp 1
)

goto InstallReport

:: ============================================================
:: Recursive App Runner
:: ============================================================
:RunApp
set "CUR_APP=%~1"
if %CUR_APP% gtr %TOTAL_APPS% goto :eof
if %ABORTED%==1 goto :eof

call :GetApp %CUR_APP%
if "!APP_NAME!"=="" goto :eof

echo   --------------------------------------------------------
echo    [%CUR_APP%/%TOTAL_APPS%] !APP_NAME!
echo    Type: !APP_TYPE!
echo   --------------------------------------------------------

if %DRYRUN%==1 (
    echo   [DRYRUN] Would download and install: !APP_NAME!
    call :Log INFO "DRYRUN: !APP_NAME!"
    set /a SUCCESS_COUNT+=1
    goto :NextAppInLoop
)

if %AUTO%==1 (
    call :DoInstall "!APP_NAME!" "!APP_URL!" "!APP_FLAGS!" "!APP_TYPE!"
    goto :NextAppInLoop
)

echo   Install? [Y/N/ESC]:
choice /c YNES /n /m "  > "
if !errorlevel!==1 (
    call :DoInstall "!APP_NAME!" "!APP_URL!" "!APP_FLAGS!" "!APP_TYPE!"
) else if !errorlevel!==2 (
    echo   Skipped.
    call :Log INFO "Skipped: !APP_NAME!"
    set /a SKIP_COUNT+=1
) else if !errorlevel!==3 (
    echo   Aborting remaining apps.
    call :Log WARN "User aborted at app %CUR_APP%"
    set "ABORTED=1"
) else (
    echo   Skipped.
    set /a SKIP_COUNT+=1
)

:NextAppInLoop
echo.
set /a NEXT_APP=%CUR_APP% + 1
call :RunApp %NEXT_APP%
goto :eof

:: ============================================================
:: Core: Install a Single App
:: ============================================================
:DoInstall
setlocal enabledelayedexpansion

set "I_NAME=%~1"
set "I_URL=%~2"
set "I_FLAGS=%~3"
set "I_TYPE=%~4"

:: --- Download ---
set "TEMP_DIR=%TEMP%\OMNITX_!I_NAME!"
if exist "!TEMP_DIR!" rd /s /q "!TEMP_DIR!" >nul 2>&1
mkdir "!TEMP_DIR!" >nul 2>&1

:: Extract filename from URL
set "FILE_NAME=!I_URL!"
set "FILE_NAME=!FILE_NAME:*//=!"
for %%F in ("!FILE_NAME!") do set "FILE_NAME=%%~nxF"
set "FILE_PATH=!TEMP_DIR!\!FILE_NAME!"

echo   Downloading !I_NAME!...
echo   URL: !I_URL!

:: Download: certutil (all Windows) then curl fallback
certutil -urlcache -split -f "!I_URL!" "!FILE_PATH!" >nul 2>&1
if !errorlevel! neq 0 (
    echo   certutil failed, trying curl...
    curl -L -o "!FILE_PATH!" "!I_URL!" 2>nul
)

if not exist "!FILE_PATH!" (
    echo   ERROR: Download failed.
    call :Log ERROR "Download failed: !I_NAME!"
    endlocal
    set /a FAIL_COUNT+=1
    goto :eof
)

for %%Z in ("!FILE_PATH!") do set "F_SIZE=%%~zZ"
if !F_SIZE! lss 1000000 (
    echo   ERROR: File too small (!F_SIZE! bytes). Download likely failed.
    call :Log ERROR "Download too small: !I_NAME! (!F_SIZE! bytes)"
    endlocal
    set /a FAIL_COUNT+=1
    goto :eof
)

echo   Downloaded: !F_SIZE! bytes.

:: --- Install ---
echo   Installing !I_NAME!...
call :Log INFO "Installing: !I_NAME!"

if /i "!FILE_PATH:~-4!"==".msi" (
    start /wait "" msiexec /i "!FILE_PATH!" !I_FLAGS! /qn /norestart
) else (
    start /wait "" "!FILE_PATH!" !I_FLAGS!
)

if !errorlevel! equ 0 (
    echo   OK: !I_NAME! installed.
    call :Log OK "!I_NAME! installed."
    endlocal
    set /a SUCCESS_COUNT+=1
) else (
    echo   WARNING: Installer exited with code !errorlevel!
    call :Log WARN "!I_NAME! exit code: !errorlevel!"
    endlocal
    set /a FAIL_COUNT+=1
)

:: --- ZeroTier: Auto-Join ---
if /i "%~4"=="zerotier" (
    echo   Waiting for ZeroTier service...
    timeout /t 8 /nobreak >nul
    if exist "C:\ProgramData\ZeroTier\One\zerotier-cli.bat" (
        "C:\ProgramData\ZeroTier\One\zerotier-cli.bat" join %ZT_NETWORK% >nul 2>&1
        echo   ZeroTier join requested for network %ZT_NETWORK%
        call :Log OK "ZeroTier join requested: %ZT_NETWORK%"
    ) else (
        echo   WARNING: ZeroTier CLI not found. Manual join needed.
        call :Log WARN "ZeroTier CLI not found."
    )
)

:: --- Cleanup ---
if exist "!TEMP_DIR!" rd /s /q "!TEMP_DIR!" >nul 2>&1

endlocal
goto :eof

:: ============================================================
:: Get App by Number
:: ============================================================
:GetApp
set "GN=%~1"
for /f "tokens=1,2,3,4 delims=|" %%A in ("!APP_%GN%!") do (
    set "APP_NAME=%%A"
    set "APP_URL=%%B"
    set "APP_FLAGS=%%C"
    set "APP_TYPE=%%D"
)
goto :eof

:: ============================================================
:: Menu: Fix & Repair
:: ============================================================
:Menu_Fix
cls
call :Banner

echo   ============================================================
echo                WINDOWS REPAIR ^& SECURITY
echo   ============================================================
echo    [1] SFC /Scannow
echo    [2] DISM /RestoreHealth (Standard)
echo    [3] DISM /RestoreHealth (Custom Proxy)
echo    [4] Set Cloudflare DNS (1.1.1.1)
echo    [5] Flush DNS Cache
echo    [6] Reset Windows Update
echo    [B] Back to Main Menu
echo   ============================================================
echo.
set /p "FIX_CHOICE=Select (1-6/B): "

if "%FIX_CHOICE%"=="1" call :RunSFC
if "%FIX_CHOICE%"=="2" call :RunDISM
if "%FIX_CHOICE%"=="3" call :RunDISMProxy
if "%FIX_CHOICE%"=="4" call :SetCloudflareDNS
if "%FIX_CHOICE%"=="5" call :FlushDNS
if "%FIX_CHOICE%"=="6" call :ResetWinUpdate
if /i "%FIX_CHOICE%"=="B" goto MainEntry
goto Menu_Fix

:RunSFC
echo.
echo   Running SFC /Scannow...
echo   This may take 10-30 minutes.
echo.
sfc /scannow
echo.
call :Log INFO "SFC completed"
pause
goto :eof

:RunDISM
echo.
echo   Running DISM /RestoreHealth...
echo   This may take 10-30 minutes.
echo.
dism /online /cleanup-image /restorehealth
echo.
call :Log INFO "DISM completed"
pause
goto :eof

:RunDISMProxy
echo.
set /p "PROXY_ADDR=Proxy (e.g., http://192.168.1.50:8080): "
if "!PROXY_ADDR!"=="" goto :eof
echo.
echo   Running DISM with proxy: !PROXY_ADDR!
set "HTTP_PROXY=!PROXY_ADDR!"
set "HTTPS_PROXY=!PROXY_ADDR!"
netsh winhttp set proxy !PROXY_ADDR! >nul 2>&1
dism /online /cleanup-image /restorehealth
set "HTTP_PROXY="
set "HTTPS_PROXY="
netsh winhttp reset proxy >nul 2>&1
echo.
call :Log INFO "DISM with proxy completed"
pause
goto :eof

:SetCloudflareDNS
echo.
echo   Setting Cloudflare DNS (1.1.1.1 / 1.0.0.1)...
for /f "skip=3 tokens=3*" %%A in ('netsh interface show interface') do (
    if "%%A"=="Connected" (
        netsh interface ip set dns name="%%B" source=static addr=%DNS_PRIMARY% >nul 2>&1
        netsh interface ip add dns name="%%B" addr=%DNS_SECONDARY% index=2 >nul 2>&1
    )
)
echo   DNS updated on all active interfaces.
echo.
call :Log INFO "Cloudflare DNS applied"
pause
goto :eof

:FlushDNS
echo.
echo   Flushing DNS cache...
ipconfig /flushdns
echo   Done.
echo.
call :Log INFO "DNS flushed"
pause
goto :eof

:ResetWinUpdate
echo.
echo   Resetting Windows Update...
net stop wuauserv >nul 2>&1
net stop cryptsvc >nul 2>&1
net stop bits >nul 2>&1
net stop msiserver >nul 2>&1
ren C:\Windows\SoftwareDistribution SoftwareDistribution.old >nul 2>&1
ren C:\Windows\System32\catroot2 catroot2.old >nul 2>&1
net start wuauserv >nul 2>&1
net start cryptsvc >nul 2>&1
net start bits >nul 2>&1
net start msiserver >nul 2>&1
echo   Windows Update reset.
echo.
call :Log INFO "Windows Update reset"
pause
goto :eof

:: ============================================================
:: Logging
:: ============================================================
:Log
setlocal enabledelayedexpansion
set "LEVEL=%~1"
set "MSG=%~2"

for /f "tokens=2 delims==" %%I in ('wmic OS Get localdatetime /value 2^>nul') do set "DT=%%I"
if defined DT (
    set "TS=!DT:~0,4!-!DT:~4,2!-!DT:~6,2! !DT:~8,2!:!DT:~10,2!:!DT:~12,2!"
) else (
    set "TS=%date% %time%"
)

echo [!TS!] [!LEVEL!] !MSG! >> "%LOG_FILE%"
echo [!TS!] [!LEVEL!] !MSG!
endlocal
goto :eof

:: ============================================================
:: Banner
:: ============================================================
:Banner
echo  @@@@@   @@@   @@@  @@@   @@  @@  @@@@@@@  @@   @@
echo   @@   @@  @@@@ @@@@  @@@@  @@  @@    @@      @@ @@
echo   @@   @@  @@ @@@ @@  @@ @@ @@  @@    @@       @@@
echo   @@   @@  @@     @@  @@  @@@@  @@    @@      @@ @@
echo    @@@@@   @@     @@  @@   @@@  @@    @@     @@   @@
echo.
echo  OMNITX Setup v%SCRIPT_VERSION%
echo  Pure CMD - Direct Downloads - No Package Manager
echo.
goto :eof

:: ============================================================
:: Install Report
:: ============================================================
:InstallReport
cls
call :Banner

echo   ============================================================
echo                    INSTALLATION REPORT
echo   ============================================================
echo    Succeeded : %SUCCESS_COUNT%
echo    Skipped   : %SKIP_COUNT%
echo    Failed    : %FAIL_COUNT%
echo    Log File  : %LOG_FILE%
if %DRYRUN%==1 echo    Mode      : DRY RUN (no changes made)
echo   ============================================================
echo.
pause
goto MainEntry

:: ============================================================
:: Exit
:: ============================================================
:ExitScript
echo.
echo  Exiting OMNITX Setup.
echo  Log: %LOG_FILE%
echo.
exit /b 0
