#!/bin/bash
wget --no-check-certificate https://157.7.87.176/install/VSidoWithEdsion.tar.gz -O VSidoWithEdsion.tar.gz 
mkdir -p /home/sysroot/
tar -xzvf VSidoWithEdsion.tar.gz -C /home/sysroot/
make -C /home/sysroot/usr/share/OpkgEnv
make -C /home/sysroot/usr/share/OpkgEnv install
make -C /home/sysroot/usr/share/Config
sync
sync



