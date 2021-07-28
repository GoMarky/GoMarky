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
    TodoItem first_item = {"Homework", "Victoria"};
};

QVBoxLayout* TodoListService::GetLayout() const
{
    auto* layout = new QVBoxLayout;

    return layout;
}

VectorTodoItem& TodoListService::GetTodos() const { return DefaultTodoList; }
