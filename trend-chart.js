// ice_world_robot_guide/frontend/js/trend-chart.js
/**
 * 冰雪世界机器人服务满意度趋势图表
 * 从localStorage读取历史数据并生成折线图
 */

let satisfactionChart = null; // 全局图表变量

// 日期格式化函数
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 生成过去7天的日期数组
function generateLast7Days() {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(formatDate(date));
    }
    return dates;
}

// 按日期分组和计算平均评分
function groupFeedbacksByDate(feedbacks) {
    const groupedData = {};
    
    // 获取过去7天的日期作为初始键
    const last7Days = generateLast7Days();
    last7Days.forEach(date => {
        groupedData[date] = {
            total: 0,
            count: 0,
            average: 0
        };
    });
    
    // 处理每条反馈
    feedbacks.forEach(feedback => {
        const date = formatDate(feedback.timestamp);
        
        // 只统计过去7天的数据
        if (last7Days.includes(date)) {
            if (!groupedData[date]) {
                groupedData[date] = { total: 0, count: 0, average: 0 };
            }
            
            groupedData[date].total += parseInt(feedback.rating);
            groupedData[date].count++;
            groupedData[date].average = groupedData[date].total / groupedData[date].count;
        }
    });
    
    return groupedData;
}

// 生成图表颜色
function generateChartColors() {
    return {
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        borderColor: 'rgba(14, 165, 233, 1)',
        pointBackgroundColor: 'rgba(14, 165, 233, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(14, 165, 233, 1)'
    };
}

// 初始化图表
function initChart() {
    const ctx = document.getElementById('satisfactionTrendChart').getContext('2d');
    const colors = generateChartColors();
    
    // 创建图表
    satisfactionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: '平均满意度评分',
                data: [],
                backgroundColor: colors.backgroundColor,
                borderColor: colors.borderColor,
                borderWidth: 2,
                pointBackgroundColor: colors.pointBackgroundColor,
                pointBorderColor: colors.pointBorderColor,
                pointHoverBackgroundColor: colors.pointHoverBackgroundColor,
                pointHoverBorderColor: colors.pointHoverBorderColor,
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            return value + ' ★';
                        }
                    },
                    title: {
                        display: true,
                        text: '满意度评分'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '日期'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `平均评分: ${context.parsed.y.toFixed(1)} / 5`;
                        },
                        footer: function(tooltipItems) {
                            const dataIndex = tooltipItems[0].dataIndex;
                            const date = tooltipItems[0].label;
                            const feedbacksData = groupFeedbacksByDate(getFeedbacks());
                            
                            if (feedbacksData[date]) {
                                return `基于 ${feedbacksData[date].count} 条反馈`;
                            }
                            return '';
                        }
                    }
                },
                title: {
                    display: true,
                    text: '过去7天的服务满意度趋势',
                    font: {
                        size: 16
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            },
            elements: {
                line: {
                    tension: 0.4
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// 获取所有反馈数据
function getFeedbacks() {
    try {
        return JSON.parse(localStorage.getItem('feedbacks')) || [];
    } catch (error) {
        console.error('获取反馈数据出错:', error);
        return [];
    }
}

// 更新图表数据
function updateChart() {
    // 获取反馈数据
    const feedbacks = getFeedbacks();
    
    // 如果没有图表实例，则初始化
    if (!satisfactionChart) {
        initChart();
    }
    
    // 按日期分组数据
    const groupedData = groupFeedbacksByDate(feedbacks);
    
    // 准备图表数据
    const labels = Object.keys(groupedData).sort();
    const data = labels.map(date => groupedData[date].average);
    
    // 更新图表数据
    satisfactionChart.data.labels = labels;
    satisfactionChart.data.datasets[0].data = data;
    
    // 更新图表
    satisfactionChart.update();
    
    // 如果没有数据，显示提示信息
    updateNoDataMessage(data);
}

// 显示/隐藏无数据提示
function updateNoDataMessage(data) {
    let noDataElement = document.getElementById('noDataMessage');
    
    // 检查数据是否全为0或不存在
    const hasData = data.some(value => value > 0);
    
    if (!hasData) {
        // 如果不存在提示元素则创建
        if (!noDataElement) {
            noDataElement = document.createElement('div');
            noDataElement.id = 'noDataMessage';
            noDataElement.className = 'text-center py-10 text-gray-500 italic text-lg';
            noDataElement.textContent = '暂无满意度数据，请提交反馈后查看趋势图';
            
            const chartContainer = document.querySelector('.chart-container');
            chartContainer.appendChild(noDataElement);
        }
        // 显示提示
        noDataElement.style.display = 'block';
    } else if (noDataElement) {
        // 隐藏提示
        noDataElement.style.display = 'none';
    }
}

// 添加监听器，页面加载完成后初始化图表
document.addEventListener('DOMContentLoaded', function() {
    // 初始化图表并更新数据
    initChart();
    updateChart();
    
    // 添加示例数据（如果无数据）
    const feedbacks = getFeedbacks();
    if (feedbacks.length === 0) {
        addSampleData();
    }
    
    // 图表响应式调整
    window.addEventListener('resize', function() {
        if (satisfactionChart) {
            satisfactionChart.resize();
        }
    });
});

// 添加示例数据（仅用于演示）
function addSampleData() {
    const today = new Date();
    const sampleFeedbacks = [];
    
    // 生成过去7天的样本数据
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        
        // 每天生成1-3条样本数据
        const feedbackCount = Math.floor(Math.random() * 3) + 1;
        
        for (let j = 0; j < feedbackCount; j++) {
            // 随机评分 3-5
            const rating = Math.floor(Math.random() * 3) + 3;
            
            sampleFeedbacks.push({
                name: "样本用户",
                email: "sample@example.com",
                rating: rating,
                comments: "这是系统生成的示例反馈，用于展示趋势图功能。",
                timestamp: date.toISOString()
            });
        }
    }
    
    localStorage.setItem('feedbacks', JSON.stringify(sampleFeedbacks));
    updateChart();
}

