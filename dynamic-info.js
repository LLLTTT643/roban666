/ ice_world_robot_guide/frontend/js/dynamic-info.js
document.addEventListener('DOMContentLoaded', function() {
    // 垃圾拾取状态
    let trashCollectionActive = false;
    let trashPoints = [];
    let collectedTrash = 0;
    let totalTrash = 0;

    // DOM元素
    const trashCollectionBtn = document.getElementById('trashCollectionBtn');
    const trashStatus = document.getElementById('trashStatus');
    const trashCount = document.getElementById('trashCount');
    const trashProgress = document.getElementById('trashProgress');
    const trashPointsContainer = document.getElementById('trashPointsContainer');
    const trashCollectedCount = document.getElementById('trashCollectedCount');
    const trashDetectedCount = document.getElementById('trashDetectedCount');
    const scanTrashBtn = document.getElementById('scanTrashBtn');
    const resetTrashBtn = document.getElementById('resetTrashBtn');

    // 初始化垃圾拾取功能
    function initTrashCollection() {
        // 模拟垃圾点数据
        generateTrashPoints(5);
        
        // 事件监听
        trashCollectionBtn.addEventListener('click', toggleTrashCollection);
        scanTrashBtn.addEventListener('click', scanForTrash);
        resetTrashBtn.addEventListener('click', resetTrashCollection);
        
        // 更新UI
        updateTrashUI();
    }

    // 生成随机垃圾点
    function generateTrashPoints(count) {
        trashPoints = [];
        for (let i = 0; i < count; i++) {
            trashPoints.push({
                id: i,
                x: Math.random() * 80 + 10, // 10-90%
                y: Math.random() * 80 + 10,
                collected: false
            });
        }
        totalTrash = trashPoints.length;
    }

    // 切换垃圾拾取模式
    function toggleTrashCollection() {
        trashCollectionActive = !trashCollectionActive;
        
        if (trashCollectionActive) {
            trashCollectionBtn.innerHTML = '<i class="fas fa-stop mr-2"></i>停止拾取';
            trashCollectionBtn.classList.add('bg-red-500', 'hover:bg-red-600');
            trashStatus.textContent = '垃圾拾取模式已激活';
            startTrashCollection();
        } else {
            trashCollectionBtn.innerHTML = '<i class="fas fa-trash mr-2"></i>拾取垃圾';
            trashCollectionBtn.classList.remove('bg-red-500', 'hover:bg-red-600');
            trashStatus.textContent = '垃圾拾取模式已关闭';
            stopTrashCollection();
        }
    }

    // 开始垃圾拾取
    function startTrashCollection() {
        // 模拟机器人移动和拾取垃圾
        simulateTrashCollection();
    }

    // 停止垃圾拾取
    function stopTrashCollection() {
        // 在实际应用中，这里会停止机器人移动
    }

    // 模拟垃圾拾取过程
    function simulateTrashCollection() {
        if (!trashCollectionActive) return;
        
        // 查找下一个未收集的垃圾点
        const nextTrash = trashPoints.find(point => !point.collected);
        
        if (!nextTrash) {
            // 所有垃圾已收集
            trashStatus.textContent = '所有垃圾已清理完毕！';
            trashCollectionActive = false;
            trashCollectionBtn.innerHTML = '<i class="fas fa-trash mr-2"></i>拾取垃圾';
            trashCollectionBtn.classList.remove('bg-red-500', 'hover:bg-red-600');
            return;
        }
        
        // 模拟机器人移动和拾取
        setTimeout(() => {
            // 标记为已收集
            nextTrash.collected = true;
            collectedTrash++;
            
            // 更新UI
            updateTrashUI();
            
            // 继续下一个垃圾点
            simulateTrashCollection();
        }, 2000);
    }

    // 扫描垃圾
    function scanForTrash() {
        // 添加扫描动画
        scanTrashBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>扫描中...';
        
        // 模拟扫描过程
        setTimeout(() => {
            scanTrashBtn.innerHTML = '<i class="fas fa-search mr-2"></i>扫描';
            
            // 高亮显示垃圾点
            highlightTrashPoints();
            
            // 更新检测到的垃圾数量
            trashDetectedCount.textContent = trashPoints.length;
            
            // 显示状态
            trashStatus.textContent = `检测到 ${trashPoints.length} 处垃圾`;
        }, 1500);
    }

    // 高亮垃圾点
    function highlightTrashPoints() {
        trashPoints.forEach(point => {
            const trashElement = document.querySelector(`.trash-point[data-trash-id="${point.id}"]`);
            if (trashElement) {
                trashElement.classList.add('animate-pulse');
                setTimeout(() => {
                    trashElement.classList.remove('animate-pulse');
                }, 2000);
            }
        });
    }

    // 重置垃圾收集状态
    function resetTrashCollection() {
        trashPoints.forEach(point => {
            point.collected = false;
        });
        collectedTrash = 0;
        trashCollectionActive = false;
        
        // 更新UI
        updateTrashUI();
        
        trashStatus.textContent = '垃圾收集状态已重置';
        trashCollectionBtn.innerHTML = '<i class="fas fa-trash mr-2"></i>拾取垃圾';
        trashCollectionBtn.classList.remove('bg-red-500', 'hover:bg-red-600');
    }

    // 更新垃圾拾取UI
    function updateTrashUI() {
        // 更新收集数量
        trashCollectedCount.textContent = collectedTrash;
        
        // 更新进度条
        const progressPercent = (collectedTrash / totalTrash) * 100;
        trashProgress.style.width = `${progressPercent}%`;
        
        // 更新垃圾点显示
        renderTrashPoints();
    }

    // 渲染垃圾点
    function renderTrashPoints() {
        trashPointsContainer.innerHTML = '';
        
        trashPoints.forEach(point => {
            const trashElement = document.createElement('div');
            trashElement.className = `trash-point ${point.collected ? 'trash-collected' : ''}`;
            trashElement.style.left = `${point.x}%`;
            trashElement.style.top = `${point.y}%`;
            trashElement.dataset.trashId = point.id;
            
            if (point.collected) {
                // 已收集的垃圾点显示动画
                setTimeout(() => {
                    trashElement.style.display = 'none';
                }, 1000);
            }
            
            trashPointsContainer.appendChild(trashElement);
        });
    }

    // 初始化
    initTrashCollection();
});

