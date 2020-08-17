/** @file main.cpp
 * Just a simple hello world using libfmt
 */
// The previous block is needed in every file for which you want to generate documentation

#include "QtWidgets"

#include "code/calculator/calculator.h"


int main(int argc, char** argv)
{
    QApplication app(argc, argv);

    Calculator calculator;

    calculator.setWindowTitle("Calculator");

    calculator.resize(230, 200);
    calculator.show();

    return app.exec();
};

