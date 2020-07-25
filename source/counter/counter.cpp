//
// Created by Andrew Slesarenko on 11/07/2020.
//
#include "counter.h"

Counter::Counter() : QObject(), m_nValue(0){};

void Counter::slotInc()
{
    emit counterChanged(++m_nValue);

    if (m_nValue == 5) { emit goodbye(); }
}
