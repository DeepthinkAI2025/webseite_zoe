#!/bin/sh
# Husky shim (minimal) – falls echte Husky nicht installiert ist

command_exists () {
  command -v "$1" >/dev/null 2>&1
}

if command_exists npm; then
  :
fi
