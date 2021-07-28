//
// Created by Andrew Slesarenko on 04/07/2021.
//

#ifndef GOMARKY_TODO_ITEM_H
#define GOMARKY_TODO_ITEM_H

#endif // GOMARKY_TODO_ITEM_H

#include "QtWidgets"

class TodoItem : public QObject
{
    Q_OBJECT

public:
    TodoItem();

    TodoItem(const QString& new_name, const QString& new_author);

    QPushButton* GetLayout() const;
};

using VectorTodoItem = QVector<TodoItem*>;