VSID_SERVICES := vsido.connect.service 
VSID_SERVICES += vsido.webcam.service 
#VSID_SERVICES += vsido.streamingface.service
VSID_SERVICES += vsido.streamingraw.service
VSID_SERVICES += vsido.streamingmarker.service
VSID_SERVICES += vsido.webserver.service
VSID_SERVICES += vsido.webserver.game.service
VSID_SERVICES += vsido.webroot.service


.PHONY:service $(VSID_SERVICES)

service:copy.service $(VSID_SERVICES) cp.ko
	sync
copy.service:
	cp -f ./vsido.*.service /lib/systemd/system/
	chmod +x /lib/systemd/system/vsido.*
	cp -f ./sshd.socket /lib/systemd/system/
	chmod +x /lib/systemd/system/sshd.socket
	
$(VSID_SERVICES):
	echo "set to auto boot $@"
	cd /etc/systemd/system/ && \
		ln -fs /lib/systemd/system/$@ $@
	systemctl enable $@

cp.ko:
	cp uvcvideo.ko \
	/lib/modules/3.10.17-poky-edison\+/kernel/drivers/media/usb/uvc/uvcvideo.ko

