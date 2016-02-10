@echo off

set BASE=%~dp0
set NODE_DIR=%BASE%tools\node\windows\
set BIT_64=
set BIT_32=32
If Defined ProgramFiles(x86) (
    set BIT=%BIT_64%
) Else (
    set BIT=%BIT_32%
)


if exist "%NODE_DIR%node.exe" (
    REM If a standalone node installation exists, use that
    goto standalone
) else (
    REM Otherwise, assume local install is available
    goto local
)

REM ===========================================================================
:standalone

set NODE=%NODE_DIR%node%BIT%.exe
echo :: Standalone node installation found!
echo :: Location: "%NODE%"

echo :: Installing dependencies...
CALL "%NODE_DIR%npm" install || exit /b 1
CALL "%NODE_DIR%bower" install || exit /b 1

echo :: Performing Grunt build...
CALL "%NODE_DIR%grunt" disperse %* || exit /b 1

goto finish

REM ===========================================================================
:local

set NODE=node
echo :: Node installation found!
echo :: Installing dependencies...
CALL npm install || exit /b 1
CALL bower install || exit /b 1
echo :: Performing Grunt build...
CALL grunt disperse %* || exit /b 1

goto finish

REM ===========================================================================
:check_node_version

REM Check the installed version of node with the latest version
REM If installed node is not up-to-date, echo a message

REM TODO: scrape site for latest version number
SET LATEST_VERSION=v4.1.1

IF "%LATEST_VERSION%" NEQ "%1" (
    echo :: WARNING: You are using an outdated version of Node. The latest version is %LATEST_VERSION%
    echo :: If the build is failing, please update node to the latest version
)

EXIT /B 0

REM ===========================================================================
:finish

for /f "delims=" %%a in ('"%NODE%" -v') do @set version=%%a
CALL :check_node_version %version%

echo DONE
