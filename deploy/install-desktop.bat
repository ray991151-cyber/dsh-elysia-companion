@echo off
chcp 65001 >nul
title 爱莉希雅插件安装器（桌面版 DSH）
echo.
echo  === 爱莉希雅常驻插件 · 一键安装（桌面版 DeepSeek Harness）===
echo.
set "DSH_HOME=%APPDATA%\open-deepseek-harness-desktop\dsh-home"
if not exist "%DSH_HOME%" (
  echo  [错误] 未找到桌面版 DSH 主目录：%DSH_HOME%
  echo  请确认已安装并运行过桌面版 DeepSeek Harness 后重试。
  pause & exit /b 1
)
set "PKG_DIR=%DSH_HOME%\profiles\web\node_modules\@local\dsh-elysia-companion"
set "PATCH=%DSH_HOME%\profiles\web\cordis.patch.yml"
echo  [1/3] 复制插件包...
if not exist "%PKG_DIR%" mkdir "%PKG_DIR%"
if not exist "%PKG_DIR%\lib" mkdir "%PKG_DIR%\lib"
copy /Y "%~dp0persistent-plugin\@local\dsh-elysia-companion\package.json" "%PKG_DIR%\package.json" >nul
copy /Y "%~dp0persistent-plugin\@local\dsh-elysia-companion\lib\index.js" "%PKG_DIR%\lib\index.js" >nul
copy /Y "%~dp0persistent-plugin\@local\dsh-elysia-companion\lib\client.js" "%PKG_DIR%\lib\client.js" >nul
xcopy /E /I /Y "%~dp0persistent-plugin\@local\dsh-elysia-companion\voice" "%PKG_DIR%\voice" >nul
echo    OK
echo  [2/3] 合并组合补丁...
copy /Y "%PATCH%" "%PATCH%.bak-elysia" >nul
findstr /C:"elysia-companion" "%PATCH%" >nul
if %errorlevel% neq 0 (
  echo.>>"%PATCH%"
  echo # --- 爱莉希雅常驻插件（@local/dsh-elysia-companion）--- >>"%PATCH%"
  echo - insert:>>"%PATCH%"
  echo     - id: elysia-companion>>"%PATCH%"
  echo       name: '@local/dsh-elysia-companion'>>"%PATCH%"
  echo    OK（已追加；原补丁备份为 cordis.patch.yml.bak-elysia）
) else (
  echo    OK（补丁已存在，跳过）
)
echo  [3/3] 完成！
echo.
echo  请完全退出并重新打开桌面版 DeepSeek Harness。
echo  重启后：界面变粉 + 所有会话以爱莉人格回复 + 标题带 ♥Elysia。
echo.
pause