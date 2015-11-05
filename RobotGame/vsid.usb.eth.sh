#!/bin/sh
#dev=`ip addr | grep enp`
dev=enp0s17u1u2
echo ${dev}
ip link set dev ${dev} up
udhcpc -i ${dev}
