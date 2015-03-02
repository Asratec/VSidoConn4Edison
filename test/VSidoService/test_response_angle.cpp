#include "vsido_response_parser.hpp"
using namespace VSido;


#include <boost/test/unit_test.hpp>
#include <boost/test/unit_test.hpp>


#include "test_dump.hpp"




BOOST_AUTO_TEST_CASE(test_case_ResponseServoInfo_1)
{
	/// uart data
	list<unsigned char> uart = 
	{
/*		
		0xff,
		(unsigned char)'d',
		0x??,//length
*/

		2, // servo id
		_HBYTE(128),_LBYTE(128),
	};
	uart.push_front(uart.size()+3 +1);
	uart.push_front((unsigned char)'d');
	uart.push_front(0xff);
	
	unsigned char _sum = 0;
	for(auto data : uart)
	{
		_sum ^= data;
	}
	uart.push_back(_sum);
	dumpTestData(uart);

	
	ResponseParser parser(uart);
	
	string json = 
	"  {"
	"    \"type\": \"servoinfo\","
	"    \"servo\":["
	"      {\"sid\":2,\"angle\":128}"
	"    ]"
	"  }"
	"";
	
	
	BOOST_CHECK(json == parser.conv());
}


BOOST_AUTO_TEST_CASE(test_case_ResponseServoInfo_2)
{
	/// uart data
	list<unsigned char> uart = 
	{
/*		
		0xff,
		(unsigned char)'d',
		0x??,//length
*/

		2, // servo id
		_HBYTE(1280),_LBYTE(1280),
	};
	uart.push_front(uart.size()+3 +1);
	uart.push_front((unsigned char)'d');
	uart.push_front(0xff);
	
	unsigned char _sum = 0;
	for(auto data : uart)
	{
		_sum ^= data;
	}
	uart.push_back(_sum);
	dumpTestData(uart);

	
	ResponseParser parser(uart);
	
	string json = 
	"  {"
	"    \"type\": \"servoinfo\","
	"    \"servo\":["
	"      {\"sid\":2,\"angle\":1280}"
	"    ]"
	"  }"
	"";
	
	
	BOOST_CHECK(json == parser.conv());
}




