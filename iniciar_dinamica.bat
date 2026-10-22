@echo off
title Dinamica - Protocolo de Inspeccion de Requerimientos (Equipo 6)
cd /d "%~dp0"
echo =================================================================
echo  INICIANDO SERVIDOR DE LA DINAMICA INTERACTIVA (ESTILO KAHOOT)
echo  UPIICSA - INGENIERIA DE REQUERIMIENTOS - GRUPO 3NV30
echo =================================================================
echo.
start "" "http://localhost:3000/host.html"
node server.js
pause
