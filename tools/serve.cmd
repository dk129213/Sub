@echo off
REM Local preview with PHP, so apply.php actually runs and can send mail.
REM PHP lives in ..\php-portable (portable, nothing installed system-wide).
REM Usage:  tools\serve.cmd [port]
setlocal
set PORT=%1
if "%PORT%"=="" set PORT=5173
set PHPDIR=%~dp0..\..\php-portable
"%PHPDIR%\php.exe" -c "%PHPDIR%\php.ini" -S localhost:%PORT% -t "%~dp0.."
