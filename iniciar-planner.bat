@echo off
title PLANNER ACTA — Servidor Local
cd /d "%~dp0"
echo =========================================
echo  Iniciando PLANNER ACTA...
echo  Acesse: http://localhost:5500/
echo =========================================
start http://localhost:5500/
node server.js
pause
