//
// Created by Andrew Slesarenko on 18/08/2020.
//

#pragma once

#include "QWidget"
#include "QProgressBar"

class Progress: public QWidget {
    Q_OBJECT

private:
    QProgressBar* m_pprb;
    int m_nStep;

public:
    Progress(QWidget* pobj = nullptr);

public slots:
    void slotStep();
    void slotReset();
};