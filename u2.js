// JavaScript Document
// ice_world_robot_guide/frontend/js/register.js
document.addEventListener('DOMContentLoaded', function() {
    // 注册表单提交处理
    const registerForm = document.getElementById('userRegisterForm');
    const registerSuccess = document.getElementById('registerSuccess');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateRegisterForm()) {
                const username = document.getElementById('registerUsername').value;
                const email = document.getElementById('registerEmail').value;
                const password = document.getElementById('registerPassword').value;
                
                // 从localStorage中获取用户数据
                const users = JSON.parse(localStorage.getItem('iceWorldUsers')) || [];
                
                // 检查用户名是否已存在
                if (users.some(u => u.username === username)) {
                    const usernameError = document.getElementById('registerUsernameError');
                    usernameError.textContent = '该用户名已被注册';
                    usernameError.style.display = 'block';
                    return;
                }
                
                // 检查邮箱是否已存在
                if (users.some(u => u.email === email)) {
                    const emailError = document.getElementById('registerEmailError');
                    emailError.textContent = '该电子邮箱已被注册';
                    emailError.style.display = 'block';
                    return;
                }
                
                // 添加新用户
                users.push({
                    username: username,
                    email: email,
                    password: password,
                    registrationDate: new Date().toISOString()
                });
                
                // 保存到localStorage
                localStorage.setItem('iceWorldUsers', JSON.stringify(users));
                
                // 显示注册成功消息
                registerSuccess.style.display = 'block';
                
                // 清空表单
                registerForm.reset();
                
                // 3秒后切换到登录页面
                setTimeout(() => {
                    document.getElementById('loginTab').click();
                }, 3000);
            }
        });
    }

    // 注册表单验证
    function validateRegisterForm() {
        const username = document.getElementById('registerUsername');
        const email = document.getElementById('registerEmail');
        const password = document.getElementById('registerPassword');
        const confirmPassword = document.getElementById('confirmPassword');
        const agreeTerms = document.getElementById('agreeTerms');
        
        const usernameError = document.getElementById('registerUsernameError');
        const emailError = document.getElementById('registerEmailError');
        const passwordError = document.getElementById('registerPasswordError');
        const confirmPasswordError = document.getElementById('confirmPasswordError');
        const agreeTermsError = document.getElementById('agreeTermsError');
        
        let isValid = true;
        
        // 重置错误信息
        usernameError.style.display = 'none';
        emailError.style.display = 'none';
        passwordError.style.display = 'none';
        confirmPasswordError.style.display = 'none';
        agreeTermsError.style.display = 'none';
        
        // 用户名验证
        if (username.value.trim() === '') {
            usernameError.textContent = '请输入用户名';
            usernameError.style.display = 'block';
            isValid = false;
        } else if (username.value.length < 3) {
            usernameError.textContent = '用户名长度不能少于3个字符';
            usernameError.style.display = 'block';
            isValid = false;
        } else if (username.value.length > 20) {
            usernameError.textContent = '用户名长度不能超过20个字符';
            usernameError.style.display = 'block';
            isValid = false;
        }
        
        // 邮箱验证
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.value.trim() === '') {
            emailError.textContent = '请输入电子邮箱';
            emailError.style.display = 'block';
            isValid = false;
        } else if (!emailRegex.test(email.value)) {
            emailError.textContent = '请输入有效的电子邮箱地址';
            emailError.style.display = 'block';
            isValid = false;
        }
        
        // 密码验证
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (password.value === '') {
            passwordError.textContent = '请设置密码';
            passwordError.style.display = 'block';
            isValid = false;
        } else if (password.value.length < 8) {
            passwordError.textContent = '密码长度不能少于8个字符';
            passwordError.style.display = 'block';
            isValid = false;
        } else if (!passwordRegex.test(password.value)) {
            passwordError.textContent = '密码必须包含至少一个字母和一个数字';
            passwordError.style.display = 'block';
            isValid = false;
        }
        
        // 确认密码验证
        if (confirmPassword.value === '') {
            confirmPasswordError.textContent = '请确认密码';
            confirmPasswordError.style.display = 'block';
            isValid = false;
        } else if (confirmPassword.value !== password.value) {
            confirmPasswordError.textContent = '两次输入的密码不一致';
            confirmPasswordError.style.display = 'block';
            isValid = false;
        }
        
        // 服务条款验证
        if (!agreeTerms.checked) {
            agreeTermsError.textContent = '请阅读并同意服务条款和隐私政策';
            agreeTermsError.style.display = 'block';
            isValid = false;
        }
        
        return isValid;
    }
});

