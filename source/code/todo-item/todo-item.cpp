//
// Created by Andrew Slesarenko on 04/07/2021.
//

#include "QtWidgets"
#include "iostream"

using namespace std;

class TodoItem : public QObject
{
    TodoItem(const QString& new_name, const QString& new_author);

public:
    QPushButton* GetLayout();

public slots:
    void IncreaseTimesDone();

private:
    QPushButton* button = new QPushButton;
    QString      name;
    QString      author;
    int          times_done;
};

TodoItem::TodoItem(const QString& new_name, const QString& new_author)
{
    name       = new_name;
    author     = new_author;
    times_done = 0;
}

QPushButton* TodoItem::GetLayout()
{
    connect(button, SIGNAL(clicked()), SLOT(IncreaseTimesDone()));

    button->setMinimumSize(120, 40);
    button->setText(name + QString::number(times_done).prepend(" "));

    return button;
}

void TodoItem::IncreaseTimesDone()
{
    times_done += 1;

    button->setText(name + QString::number(times_done).prepend(" "));
}
