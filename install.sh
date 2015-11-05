#!/bin/bash
wget --no-check-certificate https://asratec.github.io/VSidoConn4Edison/Binary/v0.96/VSidoConn4Edison.tar.gz -O VSidoConn4Edison.tar.gz 
mkdir -p /home/sysroot/
tar -xzvf VSidoConn4Edison.tar.gz -C /home/sysroot/
make -C /home/sysroot/usr/share/OpkgEnv
make -C /home/sysroot/usr/share/OpkgEnv install
make -C /home/sysroot/usr/share/Config
sync
sync



