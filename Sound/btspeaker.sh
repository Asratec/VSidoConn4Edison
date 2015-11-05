#!/bin/bash
sleep 1

# run the program bluez
echo -e 'power on\n connect \t 00:11:67:11:11:79 \nquit' | bluetoothctl
echo -e 'power on\n connect \t 00:11:67:11:11:79' | bluetoothctl



echo -e 'connect \t 00:11:67:11:11:79 \nquit' | bluetoothctl

pactl set-default-sink bluez_sink.00_11_67_11_11_79


