#!/usr/bin/env bash

if [[ $(id -u) -ne 0 ]]; then
  echo "Setup requires root"
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "NodeJS is required. Please install before continuing"
  exit 1
fi

HOME_DIR=/home/vincentehl

mkdir -p $HOME_DIR/.config/systemd/user
ln -s $HOME_DIR//wl-display/bin/system/wl-display.service $HOME_DIR/.config/systemd/user/wl-display.service
mkdir -p $HOME_DIR/.config/autostart
ln -s $HOME_DIR//wl-display/bin/system/wl-display-kiosk.desktop $HOME_DIR/.config/autostart

systemctl --user daemon-reload

systemctl --user enable wl-display && systemctl --user start wl-display
