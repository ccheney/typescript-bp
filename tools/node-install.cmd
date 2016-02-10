@echo off

SET BASE=%~dp0
SET TEMP_DIR=%BASE%node\temp\
set TEMP_MSI=%TEMP_DIR%node%BIT%.msi
SET STANDALONE_DIR=%BASE%node\windows\
SET BIT_64=
SET BIT_32=32
If Defined ProgramFiles(x86) (
    set BIT=%BIT_64%
) Else (
    set BIT=%BIT_32%
)
REM TODO: Scrape node website for latest version number
set NODE_VERSION=4.1.1
set NPM_VERSION=1.4.9

SET UNINSTALL=N
SET STANDALONE=N

REM ===========================================================================
REM gather arguments
:loop
IF "%~1"=="" GOTO start
IF /I "%~1"=="/u" SET UNINSTALL=Y
IF /I "%~1"=="-u" SET UNINSTALL=Y
IF /I "%~1"=="--uninstall" SET UNINSTALL=Y
IF /I "%~1"=="/s" SET STANDALONE=Y
IF /I "%~1"=="-s" SET STANDALONE=Y
IF /I "%~1"=="--standalone" SET STANDALONE=Y
SHIFT & GOTO loop

REM ===========================================================================
:start

IF /I "%UNINSTALL%"=="N" IF /I "%STANDALONE%"=="N" goto node_install
IF /I "%UNINSTALL%"=="Y" IF /I "%STANDALONE%"=="N" goto node_uninstall
IF /I "%UNINSTALL%"=="N" IF /I "%STANDALONE%"=="Y" goto node_standalone_install
IF /I "%UNINSTALL%"=="Y" IF /I "%STANDALONE%"=="Y" goto node_standalone_uninstall

goto finish

REM ===========================================================================
:node_install

echo :: INSTALLING NODE...
if "%BIT%" == "%BIT_32%" (
    set URL=http://nodejs.org/dist/v%NODE_VERSION%/node-v%NODE_VERSION%-x86.msi
) else (
    set URL=http://nodejs.org/dist/v%NODE_VERSION%/node-v%NODE_VERSION%-x64.msi
)

echo :: DOWNLOADING NODE v%NODE_VERSION% FROM %URL%
if not exist "%TEMP_DIR%" (
    md "%TEMP_DIR%"
)
cscript //Nologo "%BASE%utils\curl.vbs" "%URL%" "%TEMP_MSI%"
msiexec.exe /i "%TEMP_MSI%"

echo :: OK
echo :: INSTALLING GLOBAL DEPENDENCIES...
SET PATH=%PATH%;%AppData%\npm;%ProgramFiles%\nodejs\
call npm install --global bower
call npm install --global grunt-cli

goto finish

REM ===========================================================================
:node_uninstall

echo :: NOT SUPPORTED, PLEASE UNINSTALL NODE VIA WINDOWS CONTROL PANEL

goto finish

REM ===========================================================================
:node_standalone_install

if exist "%STANDALONE_DIR%node%BIT_32%.exe" (
    goto standalone_installed
) else (
    goto standalone_not_installed
)

:standalone_not_installed
md "%STANDALONE_DIR%"
echo :: INSTALLING STANDALONE NODE
echo :: DOWNLOADING 32-BIT NODE v%NODE_VERSION%...
cscript //Nologo "%BASE%utils\curl.vbs" "http://nodejs.org/dist/v%NODE_VERSION%/win-x86/node.exe" "%STANDALONE_DIR%node%BIT_32%.exe"
echo :: DOWNLOADING 64-BIT NODE %NODE_VERSION%...
cscript //Nologo "%BASE%utils\curl.vbs" "http://nodejs.org/dist/v%NODE_VERSION%/win-x64/node.exe" "%STANDALONE_DIR%node%BIT_64%.exe"
echo :: DOWNLOADING NPM v%NPM_VERSION%...
cscript //Nologo "%BASE%utils\curl.vbs" "http://nodejs.org/dist/npm/npm-%NPM_VERSION%.zip" "%STANDALONE_DIR%npm.zip"
echo :: UNZIPPING NPM
cscript //Nologo "%BASE%utils\unzip.vbs" "%STANDALONE_DIR%npm.zip" "%STANDALONE_DIR%"

echo :: INSTALLING GLOBAL DEPENDENCIES...
call "%STANDALONE_DIR%npm" install --global bower
call "%STANDALONE_DIR%npm" install --global grunt-cli
echo :: OK, STANDALONE NODE INSTALLED AT "%STANDALONE_DIR%"
goto finish

:standalone_installed
echo :: NOT INSTALLING, STANDALONE NODE ALREADY INSTALLED AT "%STANDALONE_DIR%"
goto finish

REM ===========================================================================
:node_standalone_uninstall

echo :: UNINSTALLING STANDALONE NODE...
if exist "%STANDALONE_DIR%" (
    rmdir /s /q "%STANDALONE_DIR%"
)
echo :: OK

goto finish

REM ===========================================================================
:finish

echo :: DONE
