import { getRandomColor } from '@/utils/getRandomColor';
import { getRandomColorWithOpacity } from '@/utils/getRandomColorWithOpacity';
//编辑类
export class ChartDataEditor {
  constructor(store, type) {
    this.store = store;
    this.type = type;
    this.selectedItems = new Array(this.store.state.editData.seriesData.length).fill(false);
  }

  // 获取当前系列数据
  get seriesData() {
    return this.store.state.editData.seriesData;
  }

  // 更新系列数据
  updateSeriesData(newSeriesData) {
    this.store.commit('setEditData', {
      ...this.store.state.editData,
      seriesData: newSeriesData
    });
  }

  // 添加数据点
  addPoint(seriesIndex) {
    const newSeriesData = this.seriesData.map((series, index) => {
      if (index === seriesIndex) {
        return {
          ...series,
          points: [...(series.points || []), {
            label: '',
            value: 0
          }]
        };
      }
      return series;
    });
    this.updateSeriesData(newSeriesData);
  }

  // 删除数据点
  removePoint(seriesIndex, pointIndex) {
    const newSeriesData = this.seriesData.map((series, index) => {
      if (index === seriesIndex) {
        const newPoints = [...series.points];
        newPoints.splice(pointIndex, 1);
        return { ...series, points: newPoints };
      }
      return series;
    });
    this.updateSeriesData(newSeriesData);
  }
  // 添加系列
  addSeries() {
    const isLineChart = this.type === 'line';
    const templatePoints = this.seriesData[0]?.points?.map(p => ({
      label: p.label,
      value: 0
    })) || [];

    const newSeries = isLineChart ? {
      label: `系列${String.fromCharCode(65 + this.seriesData.length)}`,
      borderColor: getRandomColor(),
      backgroundColor: getRandomColorWithOpacity(),
      tension: 0.4,
      fill: true,
      pointRadius: 5,
      points: templatePoints
    } : {
      name: `系列${String.fromCharCode(65 + this.seriesData.length)}`,
      color: getRandomColor(),
      points: templatePoints
    };

    this.updateSeriesData([...this.seriesData, newSeries]);
  }
  // 删除系列
  removeSeries(seriesIndex) {
    if (this.seriesData.length <= 1) return;
    this.updateSeriesData(this.seriesData.filter((_, i) => i !== seriesIndex));
  }

  // 添加数据项
  addItem() {
    const newItem = {
      name: `项目${String.fromCharCode(65 + this.seriesData.length)}`,
      value: Math.floor(Math.random() * 20) + 5,
      color: getRandomColor()
    };
    this.updateSeriesData([...this.seriesData, newItem]);
    this.selectedItems.push(false);
  }
  // 删除选中项
  removeSelectedItems() {
    console.log(this.selectedItems)
    if (!this.hasSelectedItems()) return;

    const newSeriesData = this.seriesData.filter((_, i) => !this.selectedItems[i]);
    this.updateSeriesData(newSeriesData);
    this.selectedItems = new Array(newSeriesData.length).fill(false);
  }
  // 切换选中状态
  toggleItemSelection(itemIndex) {
    this.selectedItems[itemIndex] = !this.selectedItems[itemIndex];
    console.log(this.selectedItems)
  }
  // 检查是否有选中的项
  hasSelectedItems() {
    return this.selectedItems.some(selected => selected);
  }

  // 获取所有方法
  getMethods() {
    const commonMethods = {
      addPoint: this.addPoint.bind(this),
      removePoint: this.removePoint.bind(this),
      addSeries: this.addSeries.bind(this),
      removeSeries: this.removeSeries.bind(this),
      addItem: this.addItem.bind(this),
      removeSelectedItems: this.removeSelectedItems.bind(this),
      toggleItemSelection: this.toggleItemSelection.bind(this),
      hasSelectedItems: this.hasSelectedItems.bind(this),

    };

    return commonMethods;
  }
}