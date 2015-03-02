#include "vsido_request_acceleration.hpp"
#include "vsido_request_parser.hpp"
using namespace VSido;


#include <boost/test/unit_test.hpp>
#include <boost/test/unit_test.hpp>


#include "test_dump.hpp"


BOOST_AUTO_TEST_CASE(test_case_RequestAngle_0)
{
	string json = 
	"  {"
	"    \"cmd\": \"servoAngle\","
	"    \"cycle\": 1,"
	"    \"servo\":["
	"      {\"sid\":2,\"angle\":100}"
	"    ]"
	"  }"
	"";
	RequestParser parser(json);
	
	/// uart data
	list<unsigned char> result = 
	{
/*		
		0xff,
		(unsigned char)'o',
		0x4,
*/
		1,

		2,
		_HBYTE(100),_LBYTE(100),
	};
	result.push_front(result.size()+3 +1);
	result.push_front((unsigned char)'o');
	result.push_front(0xff);
	
	unsigned char _sum = 0;
	for(auto data : result)
	{
		_sum ^= data;
	}
	result.push_back(_sum);
	dumpTestData(result);
	
	BOOST_CHECK(result == parser.conv());
}


BOOST_AUTO_TEST_CASE(test_case_RequestAngle_1)
{
	string json = 
	"  {"
	"    \"cmd\": \"servoAngle\","
	"    \"cycle\": 1,"
	"    \"servo\":["
	"      {\"sid\":1,\"angle\":1000}"
	"    ]"
	"  }"
	"";
	RequestParser parser(json);
	
	/// uart data
	list<unsigned char> result = 
	{
/*		
		0xff,
		(unsigned char)'o',
		0x4,
*/
		1,

		1,
		_HBYTE(1000),_LBYTE(1000),
	};
	result.push_front(result.size()+3 +1);
	result.push_front((unsigned char)'o');
	result.push_front(0xff);
	
	unsigned char _sum = 0;
	for(auto data : result)
	{
		_sum ^= data;
	}
	result.push_back(_sum);
	dumpTestData(result);
	
	BOOST_CHECK(result == parser.conv());
}



BOOST_AUTO_TEST_CASE(test_case_RequestAngle_2)
{
	string json = 
	"  {"
	"    \"cmd\": \"servoAngle\","
	"    \"cycle\": 100,"
	"    \"servo\":["
	"      {\"sid\":1,\"angle\":-1400},"
	"      {\"sid\":100,\"angle\":1400}"
	"    ]"
	"  }"
	"";
	RequestParser parser(json);
	
	/// uart data
	list<unsigned char> result = 
	{
/*		
		0xff,
		(unsigned char)'o',
		0x4,
*/
		100,

		1,_HBYTE(-1400),_LBYTE(-1400),

		100,_HBYTE(1400),_LBYTE(1400),
	};
	result.push_front(result.size()+3 +1);
	result.push_front((unsigned char)'o');
	result.push_front(0xff);
	
	unsigned char _sum = 0;
	for(auto data : result)
	{
		_sum ^= data;
	}
	result.push_back(_sum);
	dumpTestData(result);
	
	BOOST_CHECK(result == parser.conv());
}

BOOST_AUTO_TEST_CASE(test_case_RequestAngle_3)
{
	string json = 
	"  {"
	"    \"cmd\": \"servoAngle\","
	"    \"cycle\": 5,"
	"    \"servo\":["
	"      {\"sid\":5,\"angle\":-100},"
	"      {\"sid\":35,\"angle\":0},"
	"      {\"sid\":76,\"angle\":561},"
	"      {\"sid\":8,\"angle\":999}"
	"    ]"
	"  }"
	"";
	RequestParser parser(json);
	
	/// uart data
	list<unsigned char> result = 
	{
/*		
		0xff,
		(unsigned char)'o',
		0x4,
*/
		5,
		
		5,_HBYTE(-100),_LBYTE(-100),
		
		
		35,_HBYTE(0),_LBYTE(0),
		
		76,_HBYTE(561),_LBYTE(561),
		
		8,_HBYTE(999),_LBYTE(999),
		
	};
	result.push_front(result.size()+3 +1);
	result.push_front((unsigned char)'o');
	result.push_front(0xff);
	
	unsigned char _sum = 0;
	for(auto data : result)
	{
		_sum ^= data;
	}
	result.push_back(_sum);
	dumpTestData(result);
	
	BOOST_CHECK(result == parser.conv());
}



