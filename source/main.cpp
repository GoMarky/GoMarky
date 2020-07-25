/** @file main.cpp
 * Just a simple hello world using libfmt
 */
// The previous block is needed in every file for which you want to generate documentation

#include <fmt/format.h>
#include "counter/counter.h"
#include "QtWidgets"

// This should be in the headers

/**
 * @brief A function that does nothing but generate documentation
 * @return The answer to life, the universe and everything
 */
int foo();

int main(int argc, char** argv)
{
    QApplication app(argc, argv);

    QLabel      label("0");
    QPushButton command("ADD");

    Counter counter;

    label.show();
    command.show();

    QObject::connect(&command, SIGNAL(clicked()), &counter, SLOT(slotInc()));

    QObject::connect(&counter, SIGNAL(counterChanged(int)), &label, SLOT(setNum(int)));

    QObject::connect(&counter, SIGNAL(goodbye()), &app, SLOT(quit()));

    return QApplication::exec();
};

// Implementation
int foo() { return 42; }
