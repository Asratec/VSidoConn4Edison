#include "vsido_request_acceleration.hpp"
#include "vsido_request_parser.hpp"
using namespace VSido;


#include <boost/test/unit_test.hpp>
#include <boost/test/unit_test.hpp>


#include "test_dump.hpp"


BOOST_AUTO_TEST_CASE(test_case_RequestCompliance_1)
{
	string json = 
	"  {"
	"    \"command\": \"compliance\","
	"    \"servo\":["
	"      {\"sid\":1,\"cp1\":1,\"cp2\":1}"
	"    ]"
	"  }"
	"";
	RequestParser parser(json);
	
	/// uart data
	list<unsigned char> result = 
	{
/*		
		0xff,
		(unsigned char)'c',
		0x4,
*/
		1,
		1,
		1,
	};
	result.push_front(result.size()+3 +1);
	result.push_front((unsigned char)'c');
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



