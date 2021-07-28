//
// Created by Andrew Slesarenko on 04/07/2021.
//

#include "QtWidgets"
#include "iostream"

using namespace std;

class TodoItem : public QObject
{
    TodoItem();

    TodoItem(const QString& new_name, const QString& new_author);

public:
    QString GetName() const { return name; }

    QString GetAuthor() const { return author; }

    int GetTimesDone() const { return times_done; }

    QPushButton* GetLayout() const;

public slots:
    void IncreaseTimesDone();

private:
    QPushButton* button = new QPushButton;
    QString      name;
    QString      author;
    int          times_done;
};

TodoItem::TodoItem()
{
    name       = "Chill";
    author     = "Andrew";
    times_done = 0;
}

TodoItem::TodoItem(const QString& new_name, const QString& new_author)
{
    name       = new_name;
    author     = new_author;
    times_done = 0;
}

QPushButton* TodoItem::GetLayout() const
{
    auto connection = connect(button, SIGNAL(clicked()), SLOT(IncreaseTimesDone()));

    button->setMinimumSize(120, 40);

    button->setText(name + QString::number(times_done).prepend(" "));

    return button;
}

void TodoItem::IncreaseTimesDone()
{
    times_done += 1;

    button->setText(name + QString::number(times_done).prepend(" "));
}
