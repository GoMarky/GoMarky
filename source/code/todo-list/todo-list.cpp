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
    QVBoxLayout* GetLayout(QVBoxLayout* root_layout) const;

public slots:
    void onDidAddButtonClick();

private:
    VectorTodoItem& GetTodos() const;

    QVBoxLayout* layout = new QVBoxLayout;
};

TodoListService::TodoListService()
{
    auto* first_todo  = new TodoItem("Clean cat shit", "Andrew");
    auto* second_todo = new TodoItem("Wash dishes", "Victoria");
    auto* third_todo  = new TodoItem("English language homework", "Tatyana");

    DefaultTodoList.push_back(first_todo);
    DefaultTodoList.push_back(second_todo);
    DefaultTodoList.push_back(third_todo);
};

QVBoxLayout* TodoListService::GetLayout(QVBoxLayout* root_layout) const
{
    auto todos = this->GetTodos();

    for (const auto& todo_item : todos)
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

VectorTodoItem& TodoListService::GetTodos() const { return DefaultTodoList; }
