//
// Created by Andrew Slesarenko on 04/07/2021.
//

#ifndef GOMARKY_TODO_LIST_H
#define GOMARKY_TODO_LIST_H

#endif // GOMARKY_TODO_LIST_H

#include "./../todo-item/todo-item.h"
#include "QVector"
#include "QtWidgets"

class TodoListService : public QObject
{
public:
    TodoListService();

    VectorTodoItem GetTodos() const {};
};