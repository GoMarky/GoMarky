//
// Created by Andrew Slesarenko on 04/07/2021.
//

#ifndef GOMARKY_TODO_LIST_H
#define GOMARKY_TODO_LIST_H

#endif // GOMARKY_TODO_LIST_H

#include "./../todo-item/todo-item.h"
#include "QtWidgets"

class TodoListService : public QObject
{
    Q_OBJECT
public:
    TodoListService();
    QVBoxLayout* GetLayout() const;
};