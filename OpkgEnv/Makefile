.PHONY:all clean

all:
	cp -f opkg/*.conf /etc/opkg/
	sync
	sync

clean:

install:
	opkg update 
	opkg install kernel-module-uvcvideo
	opkg install git
	opkg install opencv opencv-apps opencv-dev
	opkg install espeak
	opkg install alsa-utils
	sync
	sync
