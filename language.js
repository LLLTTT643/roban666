// ice_world_robot_guide/frontend/js/language.js
// 翻译数据 - 与weather.html共享部分资源
const translations = {
    'zh': {
        'title': '冰世界 - 语言设置',
        'header': '语言设置',
        'subheader': '选择您偏好的界面语言',
        'available_languages': '可用语言',
        'chinese': '简体中文',
        'japanese': '日本語',
        'korean': '한국어',
        'welcome': '欢迎来到冰世界机器人向导',
        'description': '这是一个帮助您探索冰世界的智能助手，提供天气、导航和更多实用功能。',
        'features': '主要功能',
        'feature1': '• 实时天气追踪',
        'feature2': '• 智能路线规划',
        'feature3': '• 紧急救援呼叫',
        'feature4': '• 多语言支持',
        'save': '保存设置',
        'save_success': '保存成功!',
        'copyright': '© 2025 冰世界机器人向导',
        'preview_title': '语言预览',
        'weather': '天气',
        'navigation': '导航',
        'emergency': '紧急'
    },
    'en': {
        'title': 'Ice World - Language Settings',
        'header': 'Language Settings',
        'subheader': 'Select your preferred interface language',
        'available_languages': 'Available Languages',
        'chinese': 'Chinese (Simplified)',
        'japanese': 'Japanese',
        'korean': 'Korean',
        'welcome': 'Welcome to Ice World Robot Guide',
        'description': 'This is an intelligent assistant to help you explore the ice world, providing weather, navigation and more practical features.',
        'features': 'Main Features',
        'feature1': '• Real-time weather tracking',
        'feature2': '• Intelligent route planning',
        'feature3': '• Emergency rescue call',
        'feature4': '• Multi-language support',
        'save': 'Save Settings',
        'save_success': 'Saved successfully!',
        'copyright': '© 2025 Ice World Robot Guide',
        'preview_title': 'Language Preview',
        'weather': 'Weather',
        'navigation': 'Navigation',
        'emergency': 'Emergency'
    },
    'ja': {
        'title': 'アイスワールド - 言語設定',
        'header': '言語設定',
        'subheader': 'お好みのインターフェース言語を選択してください',
        'available_languages': '利用可能な言語',
        'chinese': '中国語 (簡体字)',
        'japanese': '日本語',
        'korean': '韓国語',
        'welcome': 'アイスワールドロボットガイドへようこそ',
        'description': 'これは、天気、ナビゲーション、その他の実用的な機能を提供し、アイスワールドを探索するのに役立つインテリジェントアシスタントです。',
        'features': '主な機能',
        'feature1': '• リアルタイム天気追跡',
        'feature2': '• インテリジェントルート計画',
        'feature3': '• 緊急救助コール',
        'feature4': '• 多言語サポート',
        'save': '設定を保存',
        'save_success': '保存が成功しました!',
        'copyright': '© 2025 アイスワールドロボットガイド',
        'preview_title': '言語プレビュー',
        'weather': '天気',
        'navigation': 'ナビゲーション',
        'emergency': '緊急'
    },
    'ko': {
        'title': '아이스 월드 - 언어 설정',
        'header': '언어 설정',
        'subheader': '선호하는 인터페이스 언어를 선택하세요',
        'available_languages': '사용 가능한 언어',
        'chinese': '중국어 (간체)',
        'japanese': '일본어',
        'korean': '한국어',
        'welcome': '아이스 월드 로봇 가이드에 오신 것을 환영합니다',
        'description': '이것은 날씨, 내비게이션 및 더 많은 실용적인 기능을 제공하여 아이스 월드를 탐험하는 데 도움이 되는 지능형 어시스턴트입니다.',
        'features': '주요 기능',
        'feature1': '• 실시간 날씨 추적',
        'feature2': '• 지능형 경로 계획',
        'feature3': '• 긴급 구조 호출',
        'feature4': '• 다국어 지원',
        'save': '설정 저장',
        'save_success': '성공적으로 저장되었습니다!',
        'copyright': '© 2025 아이스 월드 로봇 가이드',
        'preview_title': '언어 미리보기',
        'weather': '날씨',
        'navigation': '내비게이션',
        'emergency': '긴급'
    }
};

// 当前选择的语言
let currentLanguage = 'zh';

// 初始化页面语言设置
function initLanguage() {
    const savedLanguage = localStorage.getItem('iceWorldLanguage');
    if (savedLanguage && translations[savedLanguage]) {
        currentLanguage = savedLanguage;
    }
    updateLanguageSelection();
    translatePage();
    updateDocumentTitle();
}

// 更新文档标题
function updateDocumentTitle() {
    const titleElement = document.querySelector('title');
    if (titleElement && translations[currentLanguage]?.title) {
        titleElement.textContent = translations[currentLanguage].title;
    }
}

// 更新语言选择状态
function updateLanguageSelection() {
    document.querySelectorAll('.language-card').forEach(card => {
        card.classList.remove('active');
        const icon = card.querySelector('.fa-check-circle');
        icon?.classList.add('opacity-0');
    });

    const activeCard = document.getElementById(`lang-${currentLanguage}`);
    if (activeCard) {
        activeCard.classList.add('active');
        const icon = activeCard.querySelector('.fa-check-circle');
        icon?.classList.remove('opacity-0');
    }
}

// 翻译页面内容
function translatePage() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            // 添加文字变化动画
            element.style.opacity = 0;
            setTimeout(() => {
                element.textContent = translations[currentLanguage][key];
                element.style.opacity = 1;
                element.style.transition = 'opacity 0.3s ease';
            }, 150);
        }
    });
}

// 保存语言设置
function saveLanguageSettings() {
    localStorage.setItem('iceWorldLanguage', currentLanguage);
    
    // 显示保存成功的提示
    const btn = document.getElementById('save-btn');
    if (btn) {
        const originalText = btn.querySelector('span').textContent;
        btn.querySelector('span').textContent = translations[currentLanguage]['save_success'] || '保存成功!';
        btn.classList.remove('bg-blue-500', 'hover:bg-blue-600');
        btn.classList.add('bg-green-500', 'hover:bg-green-600');
        
        setTimeout(() => {
            btn.querySelector('span').textContent = originalText;
            btn.classList.remove('bg-green-500', 'hover:bg-green-600');
            btn.classList.add('bg-blue-500', 'hover:bg-blue-600');
        }, 2000);
    }
}

// 设置语言选择事件
function setupLanguageSelection() {
    document.querySelectorAll('.language-card').forEach(card => {
        card.addEventListener('click', function() {
            const langId = this.id.split('-')[1];
            if (translations[langId]) {
                currentLanguage = langId;
                updateLanguageSelection();
                translatePage();
                updateDocumentTitle();
            }
        });
    });

    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveLanguageSettings);
    }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    initLanguage();
    setupLanguageSelection();
});

// 获取当前语言
export function getCurrentLanguage() {
    return currentLanguage;
}

// 获取翻译文本
export function getTranslation(key) {
    return translations[currentLanguage]?.[key] || key;
}

// 动态更新元素文本
export function updateElementText(elementId, translationKey) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = getTranslation(translationKey);
    }
}

