#include "vsido_response_parser.hpp"
using namespace VSido;


#include <boost/test/unit_test.hpp>
#include <boost/test/unit_test.hpp>


#include "test_dump.hpp"





BOOST_AUTO_TEST_CASE(test_case_ResponseIK_0)
{
	/// uart data
	list<unsigned char> uart = 
	{
		0xff,0x6b,0x04,0x90
	};

	
	ResponseParser parser(uart);
	
	string json =  "\"kdts\":[],\"raw\":[255,107,4,144],\"type\":\"ik\"}";
	
	
	BOOST_CHECK(json == parser.conv());
}


BOOST_AUTO_TEST_CASE(test_case_ResponseIK_1)
{
	/// uart data
	list<unsigned char> uart = 
	{
/*		
		0xff,
		(unsigned char)'k',
		0x??,//length
*/
		

	};
	uart.push_front(uart.size()+3 +1);
	uart.push_front((unsigned char)'k');
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
	
	
	BOOST_CHECK(json != parser.conv());
}


