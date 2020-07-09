import { createDecorator } from '@/platform/instantiation/common/instantiation';

export interface ITelemetryService {}

export const ITelemetryService = createDecorator<ITelemetryService>('telemetryService');
