//
// Created by Andrew Slesarenko on 04/07/2021.
//

#pragma once

#include "./../todo-item/todo-item.h"
#include "QtWidgets"

class TodoListService : public QObject
{
    Q_OBJECT
public:
    TodoListService();
    QVBoxLayout* GetLayout() const;
};