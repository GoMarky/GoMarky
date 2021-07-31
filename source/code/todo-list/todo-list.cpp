//
// Created by Andrew Slesarenko on 04/07/2021.
//

#include "./../todo-item/todo-item.h"
#include "QtWidgets"

class TodoListService : public QObject
{
public:
    TodoListService();
    QVBoxLayout* GetLayout(QVBoxLayout* root_layout) const;

public slots:
    void onDidAddButtonClick();

private:
    QVBoxLayout* layout = new QVBoxLayout;
};

TodoListService::TodoListService() = default;

QVBoxLayout* TodoListService::GetLayout(QVBoxLayout* root_layout) const
{
    QVector<TodoItem*> defaultTodoList;

    auto* first_todo  = new TodoItem("Clean cat shit", "Andrew");
    auto* second_todo = new TodoItem("Wash dishes", "Victoria");
    auto* third_todo  = new TodoItem("English language homework", "Tatyana");

    defaultTodoList.push_back(first_todo);
    defaultTodoList.push_back(second_todo);
    defaultTodoList.push_back(third_todo);

    for (auto& todo_item : defaultTodoList)
    {
        QPushButton* todo_widget = todo_item->GetLayout();
        layout->addWidget(todo_widget);
    }

    auto* add_button = new QPushButton("Add objective");

    auto* horizontal_layout = new QHBoxLayout;

    horizontal_layout->addWidget(add_button);
    root_layout->addLayout(horizontal_layout);

    connect(add_button, SIGNAL(clicked()), this, SLOT(onDidAddButtonClick()));

    return layout;
}

void TodoListService::onDidAddButtonClick()
{
    auto* new_todo_item = new TodoItem("Pikul", "Sleep");

    layout->addWidget(new_todo_item->GetLayout());
}

