//
// Created by Andrew Slesarenko on 04/07/2021.
//

#include "./../todo-list/todo-list.h"
#include "QtWidgets"

class MainApplication
{
public:
    MainApplication();
    int Run(int argc, char** argv);
};

MainApplication::MainApplication() = default;

int MainApplication::Run(int argc, char** argv)
{
    QApplication app(argc, argv);
    QWidget      widget;

    auto* todoList = new TodoListService;
    auto* root_layout = new QVBoxLayout;

    QVBoxLayout* todo_layout = todoList->GetLayout(root_layout);

    root_layout->addLayout(todo_layout);

    widget.setLayout(root_layout);
    widget.show();

    return app.exec();
}
