.PHONY:all clean

SRC          += $(VSIDOSERVICE_ROOT)/uart_read.cpp
SRC          += $(VSIDOSERVICE_ROOT)/uart_send.cpp
SRC          += $(VSIDOSERVICE_ROOT)/dispatch.cpp
SRC          += $(VSIDOSERVICE_ROOT)/rs_request.cpp
SRC          += $(VSIDOSERVICE_ROOT)/rs_response.cpp
SRC          += $(VSIDOSERVICE_ROOT)/ws_request.cpp
SRC          += $(VSIDOSERVICE_ROOT)/ws_response.cpp
SRC          += $(shell find $(VSIDOSERVICE_ROOT)/vsido_request_*.cpp  -type f)
SRC          += $(shell find $(VSIDOSERVICE_ROOT)/vsido_response_*.cpp  -type f)


CXXFLAGS     := -std=c++11
CXXFLAGS     += -g
#CXXFLAGS    += -Os
CXXFLAGS     += -pthread
CXXFLAGS     += -I$(VSIDOSERVICE_ROOT)

CXXFLAGS     += -I../../prebuild/websockets/include


LDFLAGS      := -lpthread
LDFLAGS      += -L../../prebuild/websockets/lib
LDFLAGS      += -lwebsockets
LDFLAGS      += -lz


OBJs         := $(patsubst %.cpp,%.o,$(SRC))
OBJsTESTED   := $(patsubst $(VSIDOSERVICE_ROOT)/%,tested/%,$(OBJs))	
tested/%.o:$(VSIDOSERVICE_ROOT)/%.cpp
	g++ $(CXXFLAGS) -c $< -o $@

OBJs_TEST         := $(patsubst %.cpp,test/%.o,$(SRC_TEST))
test/%.o:%.cpp
	g++ $(CXXFLAGS) -c $<  -o $@




all: prebuild $(OBJsTESTED) $(OBJs_TEST)
	g++  $(OBJs_TEST) $(OBJsTESTED) $(LDFLAGS) -o VSido.ut
	-./VSido.ut --log_format=XML --log_sink=results.xml --log_level=all --report_level=no
	cat ./results.xml
clean:
	rm -rf VSido.*
	rm -f *.o
	rm -rf tested
	rm -rf test

prebuild:
	mkdir -p tested/
	mkdir -p test/

