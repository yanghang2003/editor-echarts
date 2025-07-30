import { Chart } from 'chart.js/auto';

//展示类
export class ChartHelper {
  constructor(canvas, type, editData) {
    this.canvas = canvas;
    this.type = type;
    this.editData = editData;
    this.chart = null;

    this.initChart();
  }
  //初始化
  initChart() {
    try {
      if (!this.canvas) return;
      console.log('this.editData', this.editData)
      this.chart = new Chart(this.canvas.getContext('2d'), {
        type: this.type,
        data: this.getData(),
        options: this.getOption()
      });
    }
    catch (error) {
      console.error('初始化失败:', error);
    }
  }

  //获取数据
  getData() {
    switch (this.type) {
      case 'bar':
        return this.getBarChartData()
      case 'line':
        return this.getLineChartData()
      case 'pie':
        return this.getPieChartData()
      default:
        return console.log(this.type)
    }
  }
  //获取配置
  getOption() {
    return this.editData.option
  }

  //更新图表
  updateData(newData) {
    if (!this.chart) return;
    switch (this.type) {
      case 'bar':
        if (newData.seriesData) {
          this.chart.data.labels = newData.seriesData[0]?.points?.map(p => p.label) || [];
          this.chart.data.datasets = newData.seriesData.map(series => ({
            label: series.name,
            data: series.points.map(p => p.value),
            backgroundColor: series.color,
            borderColor: series.color,
            borderWidth: 1
          }));
        }
        this.chart.options = {
          ...this.chart.options,
          ...newData.option
        };
        break;
      case 'line':
        if (newData.seriesData) {
          this.chart.data.labels = newData.seriesData[0]?.points?.map(p => p.label) || [];
          this.chart.data.datasets = newData.seriesData.map(series => ({
            label: series.label,
            data: series.points.map((point) => point.value),
            backgroundColor: series.backgroundColor,
            borderColor: series.borderColor,
            tension: series.tension,
            fill: series.fill,
            pointRadius: series.pointRadius
          }));
        }
        this.chart.options = {
          ...this.chart.options,
          ...newData.option
        };
        break;
      case 'pie':
        if (newData.seriesData) {
          this.chart.data.labels = newData.seriesData.map((item) => item.name);
          this.chart.data.datasets = [
            {
              data: newData.seriesData.map((item) => item.value),
              backgroundColor: newData.seriesData.map((item) => item.color),
              borderWidth: 1
            }

          ];
        }
        this.chart.options = {
          ...this.chart.options,
          ...newData.option
        };
        break;
      default:
        return console.log(this.type)
    }

    this.chart.update();
  }

  //销毁图表
  destroy() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  //柱形图数据
  getBarChartData = () => {
    const labels = this.editData.seriesData[0]?.points?.map((point) => point.label) || [];
    const datasets = this.editData.seriesData.map((series) => ({
      label: series.name,
      data: series.points.map((point) => point.value),
      backgroundColor: series.color,
      borderColor: series.color,
      borderWidth: 1
    }));
    return {
      labels,
      datasets
    };
  };

  //折现图数据
  getLineChartData = () => {
    const labels = this.editData.seriesData[0]?.points?.map((point) => point.label) || [];

    const datasets = this.editData.seriesData.map((series) => ({
      label: series.label,
      data: series.points.map((point) => point.value),
      backgroundColor: series.backgroundColor,
      borderColor: series.borderColor,
      tension: series.tension,
      fill: series.fill,
      pointRadius: series.pointRadius
    }));

    return {
      labels,
      datasets
    };
  };

  //饼图数据
  getPieChartData = () => {
    const labels = this.editData.seriesData.map((item) => item.name);
    const datasets = [
      {
        data: this.editData.seriesData.map((item) => item.value),
        backgroundColor: this.editData.seriesData.map((item) => item.color),
        borderWidth: 1
      }
    ];

    return {
      labels,
      datasets
    };
  };

}