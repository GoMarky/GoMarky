//
// Created by Andrew Slesarenko on 04/07/2021.
//

#include "QtWidgets"

class MainApplication
{
public:
    void static run(int argc, char** argv)
    {
        QApplication app(argc, argv);

        app.exec();
    }
};