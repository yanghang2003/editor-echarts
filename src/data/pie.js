export const DEFAULT_PIE_CHART_DATA = {
  chartType: 'pie',
  seriesData: [
    {
      name: '产品A',
      color: '#4f46e5',
      value: 30
    },
    {
      name: '产品B',
      color: '#10b981',
      value: 25
    },
    {
      name: '产品C',
      color: '#f59e0b',
      value: 20
    },
    {
      name: '产品D',
      color: '#ef4444',
      value: 15
    },
    {
      name: '产品E',
      color: '#8b5cf6',
      value: 10
    }
  ],
  option: {
    responsive: true,
    maintainAspectRatio: false,
    legendPosition: 'top',

    plugins: {
      title: {
        display: true,
        text: '销售数据'
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  }
};