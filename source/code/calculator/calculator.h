//
// Created by Andrew Slesarenko on 17/08/2020.
//

#pragma once

#include "QStack"
#include "QWidget"
#include "QLCDNumber"
#include "QPushButton"

class Calculator : public QWidget
{
    Q_OBJECT

private:
    QLCDNumber*     m_plcd;
    QStack<QString> m_stk;
    QString         m_strDisplay;

public:
    explicit Calculator(QWidget* pwgt = nullptr);

    QPushButton* createButton(const QString& str);

    void calculate();

public slots:
    void slotButtonClicked();
};