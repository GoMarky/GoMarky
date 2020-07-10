#include <fmt/format.h>
#include "iostream"

using namespace std;

constexpr double nth(double x, int n)
{
    double res = 1;
    int    i   = 0;

    while (i < n)
    {
        res *= x;
        ++i;
    }

    return res;
}

static void copy_fct()
{
    int v1[10] = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9};

    int v2[10];

    for (int i = 0; i != 10; ++i)
    {
        v2[i] = v1[i];
    }
}

int main()
{
    constexpr double s2 = nth(5, 5);

    fmt::print("This is the default behaviour and will be tested");

    return 0;
};
