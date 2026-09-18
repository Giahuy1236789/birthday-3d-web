@echo off
setlocal
title Dreamy Birthday 3D

where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Khong tim thay npm.cmd. Hay cai Node.js LTS truoc.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Dang cai dependencies lan dau...
  call npm.cmd install
  if errorlevel 1 (
    echo.
    echo [ERROR] Khong the cai dependencies. Kiem tra ket noi internet roi thu lai.
    pause
    exit /b 1
  )
)

call npm.cmd run dev
