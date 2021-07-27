//
// Created by Andrew Slesarenko on 04/07/2021.
//

#ifndef GOMARKY_TODO_ITEM_H
#define GOMARKY_TODO_ITEM_H

#endif // GOMARKY_TODO_ITEM_H

#include "QtWidgets"

struct TodoItem
{
    QString name   = "Default";
    QString author = "Andrew";
};

using VectorTodoItem = QVector<TodoItem>;