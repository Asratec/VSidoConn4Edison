.PHONY:all clean

all:
	mkdir -p /home/sysroot/etc/opkg/
	mkdir -p /home/sysroot/var/lib/opkg/
	cp -f opkg/*.conf /home/sysroot/etc/opkg/
	cp -f opkg/*.conf /etc/opkg/
	cp -f root/.profile /home/root/.profile
	sync
	sync

clean:

install:
	opkg update 
	opkg install kernel-module-uvcvideo
	opkg install espeak
	opkg install alsa-utils
	opkg -o /home/sysroot/ update 
	opkg -o /home/sysroot/ install v4l-utils v4l-utils-dev libv4l-dev libv4l 
	opkg -o /home/sysroot/ install v4l2grab v4l-utils-staticdev
	opkg -o /home/sysroot/ install git
	opkg -o /home/sysroot/ install cmake
	sync
	sync
