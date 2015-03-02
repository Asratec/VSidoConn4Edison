# VSidoConn4Edison  
V-Sido CONNECT Sample Code For Intel Edison Board  


Build from source code.
1.Checkout This Project  
   git clone git@github.com:Asratec/VSidoConnServer.git  
2.Checkout Dependence project of VSido for Linux source code.  
	git clone git@github.com:Asratec/VSidoConnServer.git  
  
3.Build a tar ball on PC.  
	make package  
	
Install from binary:  
	mkdir /home/sysroot/usr  
	tar VSidoWithEdsion.tar.gz -C /home/sysroot  
	make -C /home/sysroot/usr/Config  
	
	