export const DEFAULT_LINE_CHART_DATA = {
  chartType: 'line',
  seriesData: [
    {
      label: '产品A',
      points: [
        { label: '一月', value: 65 },
        { label: '二月', value: 59 },
        { label: '三月', value: 80 },
        { label: '四月', value: 81 },
        { label: '五月', value: 56 },
        { label: '六月', value: 55 }
      ],
      borderColor: '#4f46e5',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      tension: 0, //曲线平滑度
      fill: true,
      pointRadius: 5
    },
    {
      label: '产品B',
      points: [
        { label: '一月', value: 28 },
        { label: '二月', value: 48 },
        { label: '三月', value: 40 },
        { label: '四月', value: 19 },
        { label: '五月', value: 86 },
        { label: '六月', value: 55 }
      ],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0,
      fill: true,
      pointRadius: 5
    }
  ],
  option: {
    responsive: true,
    maintainAspectRatio: false,//图表是否保持原始的宽高比
    plugins: {
      title: {
        display: true,
        text: '销售数据'
      },
      legend: {
        position: 'top'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '月份'
        }
      },
      y: {
        title: {
          display: true,
          text: '销售额'
        },
        beginAtZero: true
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  }
};