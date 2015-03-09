# VSidoConn4Edison  
V-Sido CONNECT Sample Code For Intel Edison Board  
  

Intel Edison Boardの準備.
  動作確認済みファームウェア  
    http://downloadmirror.intel.com/24698/eng/edison-image-ww05-15.zip
  
ソースコードをビルドする.  
1.Intel Edisonのコマンドラインから、ビルド必要環境をインストールする。  
   wget --no-check-certificate -O - https://asratec.github.io/VSidoConn4Edison/buildenv.sh | sh  
2.ソースコードをチェックアウトする  
  git clone https://github.com/Asratec/VSidoConn4Edison.git  
3.依存ソースコードをチェックアウトする  
  cd VSidoConn4Edison  
  git clone https://github.com/Asratec/VSidoConnServer.git  
4.パッケージをビルドする。  
  make package    
  成果物はVSidoConn4Edison.tar.gzとなる。

成果物を実行環境にインストールする  
  mkdir -p /home/sysroot/  
  tar -xzvf VSidoConn4Edison.tar.gz -C /home/sysroot/  
  make -C /home/sysroot/usr/share/OpkgEnv  
  make -C /home/sysroot/usr/share/OpkgEnv install  
  make -C /home/sysroot/usr/share/Config  
  sync  
  sync  

  
