//
// Created by Andrew Slesarenko on 04/07/2021.
//

#pragma once

#include "QtWidgets"

class TodoItem : public QObject
{
    Q_OBJECT

public:
    TodoItem();

    TodoItem(const QString& new_name, const QString& new_author);

    QPushButton* GetLayout() const;

public slots:
    void IncreaseTimesDone();
};

using VectorTodoItem = QVector<TodoItem*>;