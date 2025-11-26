@echo off
echo ============================================
echo   INSTALANDO FERRAMENTAS (SO NA 1a VEZ)...
echo ============================================
cd /d "%~dp0"

:: Se a pasta node_modules nao existir, instala tudo
if not exist node_modules (
    call npm install
)

echo.
echo ============================================
echo   LIGANDO O SERVIDOR E ABRINDO O SITE...
echo ============================================

:: Abre o navegador
start http://localhost:3000

:: Inicia o servidor (aqui ele cria o banco ceps.db)
call npm start
pause