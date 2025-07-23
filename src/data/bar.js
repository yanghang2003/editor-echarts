export const DEFAULT_BAR_CHART_DATA = {
  chartType: 'bar',
  seriesData: [
    {
      name: '产品A',
      color: getComputedStyle(document.documentElement).getPropertyValue('--primary').trim(),
      points: [
        { label: '一月', value: 120 },
        { label: '二月', value: 180 },
        { label: '三月', value: 150 },
        { label: '四月', value: 200 }
      ]
    },
    {
      name: '产品B',
      color: getComputedStyle(document.documentElement).getPropertyValue('--text-hover').trim(),
      points: [
        { label: '一月', value: 70 },
        { label: '二月', value: 260 },
        { label: '三月', value: 120 },
        { label: '四月', value: 90 }
      ]
    }
  ],
  option: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: '销售数据'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '销售额'
        },
        ticks: {
          font: {
            family: 'Arial',
            size: 14,
          }
        }
      },
      x: {
        title: {
          display: true,
          text: '月份'
        },
        ticks: {
          font: {
            family: 'Arial',
            size: 14,
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  }
};