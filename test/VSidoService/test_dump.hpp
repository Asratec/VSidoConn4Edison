#ifndef __TEST_DUMP_HPP__
#define __TEST_DUMP_HPP__
#include <list>
using namespace std;


#define _HBYTE(x) (unsigned char)(((int)x <<1) &0xff)
#define _LBYTE(x) (unsigned char)(((((int)x <<1) >>8 ) &0xff)<< 1)

void dumpTestData(const list<unsigned char>&data);

#endif // __TEST_DUMP_HPP__

