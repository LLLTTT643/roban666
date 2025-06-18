// JavaScript Document
// ice_world_robot_guide/frontend/js/weather.js
document.addEventListener('DOMContentLoaded', function() {
    // 哈尔滨城市ID
    const HARBIN_CITY_ID = '101050101';
    // 天气API密钥（实际应用中应从安全配置获取）
    const WEATHER_API_KEY = 'YOUR_API_KEY';
    // 天气API基础URL
    const WEATHER_API_URL = `https://devapi.qweather.com/v7/weather/now?location=${HARBIN_CITY_ID}&key=${WEATHER_API_KEY}`;
    // 7天预报API URL
    const FORECAST_API_URL = `https://devapi.qweather.com/v7/weather/7d?location=${HARBIN_CITY_ID}&key=${WEATHER_API_KEY}`;
    // 园区区域天气API URL（模拟）
    const AREA_WEATHER_API_URL = 'https://api.example.com/area-weather';

    // 获取当前天气数据
    async function fetchCurrentWeather() {
        try {
            const response = await fetch(WEATHER_API_URL);
            const data = await response.json();
            
            if (data.code === '200') {
                updateCurrentWeather(data.now);
            } else {
                console.error('获取天气数据失败:', data);
                showError('获取天气数据失败，请稍后再试');
            }
        } catch (error) {
            console.error('获取天气数据出错:', error);
            showError('网络连接错误，请检查网络设置');
        }
    }

    // 获取7天天气预报
    async function fetch7DayForecast() {
        try {
            const response = await fetch(FORECAST_API_URL);
            const data = await response.json();
            
            if (data.code === '200') {
                update7DayForecast(data.daily);
            } else {
                console.error('获取7天预报失败:', data);
                showError('获取7天预报失败，请稍后再试');
            }
        } catch (error) {
            console.error('获取7天预报出错:', error);
            showError('网络连接错误，请检查网络设置');
        }
    }

    // 获取园区各区域天气（模拟）
    async function fetchAreaWeather() {
        try {
            // 模拟API调用
            const areaData = [
                {
                    name: "冰雕艺术区",
                    weather: "小雪",
                    temp: -11,
                    visibility: 4.8,
                    humidity: 70
                },
                {
                    name: "雪地活动区",
                    weather: "中雪",
                    temp: -12,
                    visibility: 3.5,
                    humidity: 75
                },
                {
                    name: "灯光秀区域",
                    weather: "雪花飘落",
                    temp: -13,
                    visibility: 4.2,
                    humidity: 68
                },
                {
                    name: "美食休闲区",
                    weather: "阴天",
                    temp: -10,
                    visibility: 6.1,
                    humidity: 65
                }
            ];
            
            updateAreaWeather(areaData);
        } catch (error) {
            console.error('获取园区天气数据出错:', error);
            showError('获取园区天气数据失败');
        }
    }

    // 更新当前天气显示
    function updateCurrentWeather(weatherData) {
        document.getElementById('currentTemp').textContent = `${weatherData.temp}°`;
        document.getElementById('currentWeather').textContent = getWeatherText(weatherData.text);
        document.getElementById('feelsLikeTemp').textContent = `${weatherData.feelsLike}°C`;
        document.getElementById('humidity').textContent = `${weatherData.humidity}%`;
        document.getElementById('windSpeed').innerHTML = `<i class="fas fa-wind text-blue-500 mr-1"></i>${weatherData.windSpeed} m/s`;
        document.getElementById('windDirection').innerHTML = `<i class="fas fa-location-arrow text-blue-500 mr-1" style="transform: rotate(${weatherData.wind360}deg)"></i>${weatherData.windDir}`;
        document.getElementById('pressure').innerHTML = `<i class="fas fa-compress-alt text-blue-500 mr-1"></i>${weatherData.pressure} hPa`;
        document.getElementById('visibility').innerHTML = `<i class="fas fa-eye text-blue-500 mr-1"></i>${weatherData.vis} km`;
        document.getElementById('precipitation').innerHTML = `<i class="fas fa-cloud-rain text-blue-500 mr-1"></i>${weatherData.precip}%`;
        document.getElementById('uvIndex').innerHTML = `<i class="fas fa-sun text-blue-500 mr-1"></i>${weatherData.uvIndex}`;

        // 更新时间
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        document.getElementById('updateTime').textContent = `${hours}:${minutes}`;

        // 更新天气预警
        updateWeatherAlerts(weatherData);
    }

    // 更新7天天气预报
    function update7DayForecast(forecastData) {
        const forecastContainer = document.getElementById('forecastContainer');
        forecastContainer.innerHTML = '';

        forecastData.forEach((day, index) => {
            const date = new Date(day.fxDate);
            const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
            const dayName = index === 0 ? '今天' : dayNames[date.getDay()];
            
            const weatherIcon = getWeatherIcon(day.iconDay);

            const dayElement = document.createElement('div');
            dayElement.className = 'forecast-day';
            dayElement.innerHTML = `
                <p class="font-medium text-gray-800 mb-1">${dayName}</p>
                <div class="weather-icon text-blue-500 mb-1">
                    <i class="fas ${weatherIcon}"></i>
                </div>
                <p class="text-lg font-semibold text-gray-800">${day.tempMax}°C</p>
                <p class="text-sm text-gray-500">${day.tempMin}°C</p>
                <p class="text-xs text-gray-600 mt-2">降水概率: ${day.precip}%</p>
            `;
            
            forecastContainer.appendChild(dayElement);
        });

        // 更新温度趋势图
        updateTempTrendChart(forecastData);
    }

    // 更新园区各区域天气
    function updateAreaWeather(areaData) {
        const areaWeatherContainer = document.getElementById('areaWeatherContainer');
        areaWeatherContainer.innerHTML = '';

        areaData.forEach(area => {
            const areaElement = document.createElement('div');
            areaElement.className = 'weather-card';
            areaElement.innerHTML = `
                <div class="bg-blue-500 text-white px-4 py-3">
                    <h3 class="font-medium">${area.name}</h3>
                </div>
                <div class="p-4">
                    <div class="flex justify-between items-center mb-3">
                        <div class="flex items-center">
                            <i class="fas fa-${area.weather.includes('雪') ? 'snowflake' : area.weather.includes('阴') ? 'cloud' : 'sun'} text-blue-500 text-xl mr-2"></i>
                            <span class="text-gray-800 font-medium">${area.weather}</span>
                        </div>
                        <span class="text-xl font-bold text-gray-800">${area.temp}°C</span>
                    </div>
                    <div class="text-sm text-gray-600">
                        <p>能见度: ${area.visibility}km</p>
                        <p>湿度: ${area.humidity}%</p>
                    </div>
                </div>
            `;
            areaWeatherContainer.appendChild(areaElement);
        });
    }

    // 更新温度趋势图
    function updateTempTrendChart(forecastData) {
        const chartContainer = document.getElementById('tempTrendChart');
        chartContainer.innerHTML = '';

        // 获取温度范围用于计算高度比例
        const temps = forecastData.map(day => parseInt(day.tempMax));
        const maxTemp = Math.max(...temps);
        const minTemp = Math.min(...temps);
        const tempRange = maxTemp - minTemp;

        forecastData.forEach((day, index) => {
            const temp = parseInt(day.tempMax);
            // 计算柱状图高度比例 (0-100%)
            const heightPercent = tempRange > 0 ? 
                ((temp - minTemp) / tempRange * 80 + 20) : 50;
            
            const bar = document.createElement('div');
            bar.className = 'tiny-chart-bar';
            bar.style.height = `${heightPercent}%`;
            bar.setAttribute('data-temp', temp);
            
            // 添加工具提示交互
            bar.addEventListener('mouseenter', function(e) {
                showTooltip(`最高温度: ${temp}°C`, e.clientX, e.clientY);
            });
            
            bar.addEventListener('mouseleave', function() {
                hideTooltip();
            });
            
            chartContainer.appendChild(bar);
        });
    }

    // 更新天气预警信息
    function updateWeatherAlerts(weatherData) {
        const alertElement = document.getElementById('weatherAlert');
        
        if (weatherData.warning) {
            alertElement.innerHTML = `
                <div class="flex items-center">
                    <i class="fas fa-exclamation-triangle mr-2"></i>
                    <p class="font-medium">${weatherData.warning}</p>
                </div>
            `;
            alertElement.style.display = 'block';
        } else {
            alertElement.style.display = 'none';
        }
    }

    // 显示错误信息
    function showError(message) {
        const alertElement = document.getElementById('weatherAlert');
        alertElement.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-exclamation-circle mr-2"></i>
                <p class="font-medium">${message}</p>
            </div>
        `;
        alertElement.style.display = 'block';
    }

    // 显示工具提示
    function showTooltip(text, x, y) {
        const tooltip = document.getElementById('tooltip');
        tooltip.textContent = text;
        tooltip.style.left = `${x + 15}px`;
        tooltip.style.top = `${y - 25}px`;
        tooltip.style.opacity = '1';
    }

    // 隐藏工具提示
    function hideTooltip() {
        const tooltip = document.getElementById('tooltip');
        tooltip.style.opacity = '0';
    }

    // 获取天气文本描述
    function getWeatherText(weatherCode) {
        const weatherMap = {
            '100': '晴',
            '101': '多云',
            '102': '少云',
            '103': '晴间多云',
            '104': '阴',
            '200': '有风',
            '201': '平静',
            '202': '微风',
            '203': '和风',
            '204': '清风',
            '205': '强风',
            '206': '疾风',
            '207': '大风',
            '208': '烈风',
            '209': '风暴',
            '210': '狂暴风',
            '211': '飓风',
            '212': '龙卷风',
            '213': '热带风暴',
            '300': '阵雨',
            '301': '强阵雨',
            '302': '雷阵雨',
            '303': '强雷阵雨',
            '304': '雷阵雨伴有冰雹',
            '305': '小雨',
            '306': '中雨',
            '307': '大雨',
            '308': '极端降雨',
            '309': '毛毛雨/细雨',
            '310': '暴雨',
            '311': '大暴雨',
            '312': '特大暴雨',
            '313': '冻雨',
            '400': '小雪',
            '401': '中雪',
            '402': '大雪',
            '403': '暴雪',
            '404': '雨夹雪',
            '405': '雨雪天气',
            '406': '阵雨夹雪',
            '407': '阵雪',
            '500': '薄雾',
            '501': '雾',
            '502': '霾',
            '503': '扬沙',
            '504': '浮尘',
            '507': '沙尘暴',
            '508': '强沙尘暴',
            '900': '热',
            '901': '冷',
            '999': '未知'
        };
        
        return weatherMap[weatherCode] || weatherCode;
    }

    // 获取天气图标
    function getWeatherIcon(iconCode) {
        const iconMap = {
            '100': 'fa-sun',
            '101': 'fa-cloud-sun',
            '102': 'fa-cloud',
            '103': 'fa-cloud',
            '104': 'fa-cloud',
            '200': 'fa-wind',
            '201': 'fa-wind',
            '202': 'fa-wind',
            '203': 'fa-wind',
            '204': 'fa-wind',
            '205': 'fa-wind',
            '206': 'fa-wind',
            '207': 'fa-wind',
            '208': 'fa-wind',
            '209': 'fa-wind',
            '210': 'fa-wind',
            '211': 'fa-wind',
            '212': 'fa-wind',
            '213': 'fa-wind',
            '300': 'fa-cloud-rain',
            '301': 'fa-cloud-showers-heavy',
            '302': 'fa-bolt',
            '303': 'fa-bolt',
            '304': 'fa-cloud-rain',
            '305': 'fa-cloud-rain',
            '306': 'fa-cloud-rain',
            '307': 'fa-cloud-showers-heavy',
            '308': 'fa-cloud-showers-heavy',
            '309': 'fa-cloud-rain',
            '310': 'fa-cloud-showers-heavy',
            '311': 'fa-cloud-showers-heavy',
            '312': 'fa-cloud-showers-heavy',
            '313': 'fa-cloud-showers-heavy',
            '400': 'fa-snowflake',
            '401': 'fa-snowflake',
            '402': 'fa-snowflake',
            '403': 'fa-snowflake',
            '404': 'fa-snowflake',
            '405': 'fa-snowflake',
            '406': 'fa-snowflake',
            '407': 'fa-snowflake',
            '500': 'fa-smog',
            '501': 'fa-smog',
            '502': 'fa-smog',
            '503': 'fa-smog',
            '504': 'fa-smog',
            '507': 'fa-smog',
            '508': 'fa-smog',
            '900': 'fa-sun',
            '901': 'fa-snowflake',
            '999': 'fa-question'
        };
        
        return iconMap[iconCode] || 'fa-question';
    }

    // 初始化天气数据
    function initWeatherData() {
        fetchCurrentWeather();
        fetch7DayForecast();
        fetchAreaWeather();
        
        // 每30分钟自动刷新天气数据
        setInterval(() => {
            fetchCurrentWeather();
            fetch7DayForecast();
            fetchAreaWeather();
        }, 1800000);
    }

    // 启动天气数据获取
    initWeatherData();
});

