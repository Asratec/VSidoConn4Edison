#define BOOST_TEST_MAIN // or #define BOOST_TEST_MODULE test_module_name
#include <boost/test/included/unit_test.hpp>

#include <thread>
#include <mutex>
using namespace std;

mutex _globalLockMtx;


