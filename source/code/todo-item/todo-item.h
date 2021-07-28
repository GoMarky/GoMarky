//
// Created by Andrew Slesarenko on 04/07/2021.
//

#ifndef GOMARKY_TODO_ITEM_H
#define GOMARKY_TODO_ITEM_H

#endif // GOMARKY_TODO_ITEM_H

#include "QtWidgets"

class TodoItem: public QObject
{
public:
    TodoItem();

    TodoItem(const QString& new_name, const QString& new_author);

    QPushButton* GetLayout() const;

    void IncreaseTimesDone();
};

using VectorTodoItem = QVector<TodoItem*>;