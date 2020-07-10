#include <fmt/format.h>

// This should be in the headers

int foo();

int main(int argc, char* argv[])
{
    if (argc)
    {
        fmt::print("hello world from !", argv[0]);
    }
    return 0;
}

// Implementation
int foo() { return 42; }
