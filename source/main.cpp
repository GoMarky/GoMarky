#include "QtWidgets"
#include "gm/workbench/counter/counter.h"

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
