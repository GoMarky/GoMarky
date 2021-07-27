//
// Created by Andrew Slesarenko on 04/07/2021.
//

#include "./../todo-item/todo-item.h"
#include "QtWidgets"

VectorTodoItem DefaultTodoList;

class TodoListService : public QObject
{
public:
    TodoListService();
    QVBoxLayout* GetLayout() const;

private:
    VectorTodoItem& GetTodos() const;
};

TodoListService::TodoListService()
{
    DefaultTodoList.push_back({"Homework", "Victoria"});
    DefaultTodoList.push_back({"House cleaning", "Tatyana"});
    DefaultTodoList.push_back({"Clean cat shit", "Andrew"});
}

QVBoxLayout* TodoListService::GetLayout() const
{
    auto* layout = new QVBoxLayout;
    auto todos = this->GetTodos();

    for (const auto& todo: todos) {

    }

    return layout;
}

VectorTodoItem& TodoListService::GetTodos() const { return DefaultTodoList; }