#!/bin/bash
echo "setup opkg repository"
wget --no-check-certificate https://asratec.github.io/VSidoConn4Edison/Setup/base-opkg.conf -O - /etc/opkg/base-opkg.conf
wget --no-check-certificate https://asratec.github.io/VSidoConn4Edison/Setup/intel-iotdk.conf -O - /etc/opkg/intel-iotdk.conf

opkg update 
opkg install kernel-module-uvcvideo
opkg install espeak
opkg install alsa-utils
opkg install v4l-utils v4l-utils-dev libv4l-dev libv4l 
opkg install v4l2grab v4l-utils-staticdev
opkg install git
opkg install cmake
sync
sync




