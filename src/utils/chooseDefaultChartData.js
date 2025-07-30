import { DEFAULT_BAR_CHART_DATA } from '@/data/bar';
import { DEFAULT_LINE_CHART_DATA } from '@/data/line';
import { DEFAULT_PIE_CHART_DATA } from '@/data/pie';

export function chooseDefaultChartData(type) {
  switch (type) {
    case 'bar':
      return DEFAULT_BAR_CHART_DATA;
    case 'line':
      return DEFAULT_LINE_CHART_DATA;
    case 'pie':
      return DEFAULT_PIE_CHART_DATA;
    default:
      throw new Error(`Unknown chart type: ${type}`);
  }
}