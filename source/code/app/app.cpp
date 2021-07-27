//
// Created by Andrew Slesarenko on 04/07/2021.
//

#include "./../todo-list/todo-list.h"
#include "QtWidgets"
#include "iostream"

using namespace std;

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
    QLabel       welcome_label("");

    welcome_label.setMargin(20);
    welcome_label.show();

    TodoListService TodoList;

    VectorTodoItem TodoItems = TodoList.GetTodos();

    for (const auto& item : TodoItems)
    {
        string RawItemName   = item.name.toUtf8().constData();
        string RawAuthorName = item.author.toUtf8().constData();

        welcome_label.setText(item.author);
    }

    return app.exec();
}
