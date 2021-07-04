//
// Created by Andrew Slesarenko on 04/07/2021.
//

#include "QtWidgets"

class MainApplication : public QObject
{
public:
    MainApplication();
    int Run(int argc, char** argv);
};

MainApplication::MainApplication() {}

int MainApplication::Run(int argc, char** argv) {
    QApplication app(argc, argv);

    QLabel welcome_label("Hello my litta GoMarky. For you its just a beginning");

    welcome_label.setMargin(20);

    QHBoxLayout horizontal_layout;

    welcome_label.show();

    return app.exec();
}
