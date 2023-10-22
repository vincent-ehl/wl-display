#!/usr/bin/env bash

if [[ $(id -u) -ne 0 ]]; then
  echo "Setup requires root"
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "NodeJS is required. Please install before continuing"
  exit 1
fi

ln -s /home/vincentehl/wl-display/bin/system/wl-display.service /lib/systemd/system/wl-display.service

systemctl daemon-reload

systemctl enable wl-display && systemctl start wl-display
