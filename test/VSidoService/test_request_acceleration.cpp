#include "vsido_request_acceleration.hpp"
#include "vsido_request_parser.hpp"
using namespace VSido;


#include <boost/test/unit_test.hpp>
#include <boost/test/unit_test.hpp>



BOOST_AUTO_TEST_CASE(test_case_RequestAcceleration_1)
{
	RequestParser parser("{\"command\":\"acceleration\"}");
	/// uart data
	list<unsigned char> result = 
	{
		0xff,
		(unsigned char)'a',
		4,
	};
	unsigned char _sum = 0;
	for(auto data : result)
	{
		_sum ^= data;
	}
	result.push_back(_sum);
	
	BOOST_CHECK(result == parser.conv());
}


BOOST_AUTO_TEST_CASE(test_case_RequestAcceleration_2)
{
	/// spell miss
	RequestParser parser("{\"command\":\"aceleration\"}");
	/// uart data
	list<unsigned char> result = 
	{
		0xff,
		(unsigned char)'a',
		4,
	};
	unsigned char _sum = 0;
	for(auto data : result)
	{
		_sum ^= data;
	}
	result.push_back(_sum);
	
	BOOST_CHECK(result != parser.conv());
}


BOOST_AUTO_TEST_CASE(test_case_RequestAcceleration_3)
{
	/// name error.
	RequestParser parser("{\"cmd\":\"acceleration\"} }");
	/// uart data
	list<unsigned char> result = 
	{
		0xff,
		(unsigned char)'a',
		4,
	};
	unsigned char _sum = 0;
	for(auto data : result)
	{
		_sum ^= data;
	}
	result.push_back(_sum);
	
	BOOST_CHECK(result != parser.conv());
}


BOOST_AUTO_TEST_CASE(test_case_RequestAcceleration_4)
{
	/// format error.
	RequestParser parser("{\"cmd\":\"acceleration\" [akfd,kkfkak,dfajk]}");
	/// uart data
	list<unsigned char> result = 
	{
		0xff,
		(unsigned char)'a',
		4,
	};
	unsigned char _sum = 0;
	for(auto data : result)
	{
		_sum ^= data;
	}
	result.push_back(_sum);
	
	BOOST_CHECK(result != parser.conv());
}

