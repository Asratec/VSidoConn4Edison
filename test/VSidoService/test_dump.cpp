#include "test_dump.hpp"
#include <iostream>

void dumpTestData(const list<unsigned char>&data)
{
	cout << endl;
	for(auto ch:data)
	{
		printf("0x%02x,",ch);
	}
	cout << endl;
}


