//
// Created by Andrew Slesarenko on 04/07/2021.
//

#include "./../todo-list/todo-list.h"
#include "QtWidgets"

class MainApplication : public QObject
{
public:
    MainApplication();
    int Run(int argc, char** argv);
};

MainApplication::MainApplication() {}

int MainApplication::Run(int argc, char** argv)
{
    QApplication app(argc, argv);
    QWidget      widget;

    TodoListService todoList;

    QVBoxLayout* todoLayout = todoList.GetLayout();

    widget.setLayout(todoLayout);
    widget.show();

    return app.exec();
}
