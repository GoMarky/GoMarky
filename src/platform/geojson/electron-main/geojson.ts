import { FeatureCollection } from '@/base/geojson';
import { WorkspaceLabel } from '@/platform/geojson/common/geojson';

/**
 * @description
 *  В случае добавление дефолтной геометрической фигуры для класса, то null нужно заменить на необходимый интерфейс.
 */
export function getDefaultLabelCollection(): FeatureCollection<null, WorkspaceLabel> {
  return { type: 'FeatureCollection', features: [] };
}
