// ==UserScript==
// @name         雨云截图隐私保护脚本
// @namespace    http://tampermonkey.net/
// @version      0.15
// @description  给包含特定隐私内容的元素添加模糊效果，并提供开关按钮控制
// @author       ndxzzy, ChatGPT
// @match        *://app.rainyun.com/*
// @updateURL    https://github.com/rainyun-space/rainyun-privacy-protection/raw/main/privacy-protection.user.js
// @downloadURL  https://github.com/rainyun-space/rainyun-privacy-protection/raw/main/privacy-protection.user.js
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    var privacyProtectionEnabled = false;

    // 敏感关键词列表
    const keywordsForH4 = [
        '公网IP列表', '面板用户名', 'CDN设置', '发票抬头列表', '我的发票', '发起提现',
        '域名管理', '我的模板', 'NAT端口映射管理', 'Nat端口映射', '绑定支付宝', '绑定邮箱',
        '账号变动日志', 'API秘钥', 'IP列表'
    ];

    const keywordsForTable = ['日志ID', 'CNAME', '桶名'];

    const keywordsForP = ['公网IP', '服务器ID', '标签'];

    const smallKeywordsForTD = [
        '公网 IP 地址：', '公网IP地址：', '内网IP：', '远程连接地址 (RDP/SSH)：', '面板主账户：', '安装结果输出', 'IPv4公网地址'
    ];

    // SVG icons for normal and slashed-eye states
    const normalEyeIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        </svg>
    `;
    const slashedEyeIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
            <circle cx="12" cy="12" r="3"></circle>
        </svg>
    `;

    // Create and style the toggle button
    function createToggleButton() {
        const button = document.createElement('div');
        button.innerHTML = normalEyeIcon; // Set the initial icon to the normal eye

        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.left = '20px';
        button.style.width = '40px';
        button.style.height = '40px';
        button.style.backgroundColor = '#37b5c1';
        button.style.borderRadius = '50%';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.cursor = 'pointer';
        button.style.zIndex = '1000';
        button.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
        document.body.appendChild(button);

        // Add dragging functionality
        let isDragging = false;
        let hasMoved = false;
        let offsetX = 0;
        let offsetY = 0;
        let initialX = 0;
        let initialY = 0;
        const dragThreshold = 3; // 拖动的最小距离阈值

        button.addEventListener('mousedown', (e) => {
            isDragging = true;
            hasMoved = false;
            offsetX = e.clientX - button.offsetLeft;
            offsetY = e.clientY - button.offsetTop;
            initialX = e.clientX;
            initialY = e.clientY;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const moveX = e.clientX - initialX;
                const moveY = e.clientY - initialY;
                if (Math.abs(moveX) > dragThreshold || Math.abs(moveY) > dragThreshold) {
                    hasMoved = true;
                    button.style.cursor = 'move';
                    button.style.left = `${e.clientX - offsetX}px`;
                    button.style.top = `${e.clientY - offsetY}px`;
                }
            }
        });

        document.addEventListener('mouseup', (e) => {
            if (isDragging) {
                const moveX = e.clientX - initialX;
                const moveY = e.clientY - initialY;
                isDragging = false;
                button.style.cursor = 'pointer';
                if (!hasMoved && Math.abs(moveX) <= dragThreshold && Math.abs(moveY) <= dragThreshold) {
                    togglePrivacyProtection();
                }
            }
        });

        return button;
    }

    const toggleButton = createToggleButton();

    function togglePrivacyProtection() {
        privacyProtectionEnabled = !privacyProtectionEnabled;
        if (privacyProtectionEnabled) {
            applyPrivacyProtection();
            toggleButton.innerHTML = slashedEyeIcon; // Change to slashed-eye icon
        } else {
            removePrivacyProtection();
            toggleButton.innerHTML = normalEyeIcon; // Change back to normal eye icon
        }
    }

    GM_registerMenuCommand('切换隐私保护', togglePrivacyProtection);

    // 监听页面变化，持续应用隐私保护效果
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (privacyProtectionEnabled) {
                applyPrivacyProtection();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    function applyPrivacyProtection() {
        var h4Elements = document.querySelectorAll('h4');
        h4Elements.forEach(h4Element => {
            if (keywordsForH4.some(keyword => h4Element.textContent.includes(keyword))) {
                var divParent = h4Element.parentNode;
                if (divParent.tagName === 'DIV') {
                    divParent.style.filter = 'blur(5px)';
                }
            }
        });

        var tableElements = document.querySelectorAll('table');
        tableElements.forEach(tableElement => {
            if (keywordsForTable.some(keyword => tableElement.textContent.includes(keyword))) {
                var divParent = tableElement.parentNode;
                if (divParent.tagName === 'DIV') {
                    divParent.style.filter = 'blur(5px)';
                }
            }
        });

        var elements = document.querySelectorAll('p, td, div');
        elements.forEach(element => {
            if (element.tagName === 'P' && keywordsForP.some(keyword => element.textContent.includes(keyword))) {
                element.style.filter = 'blur(5px)';
            } else if (element.tagName === 'TD') {
                var smallElement = element.querySelector('small');
                if (smallElement && smallKeywordsForTD.some(keyword => smallElement.textContent.includes(keyword))) {
                    element.style.filter = 'blur(5px)';
                }
            }
        });
    }

    function removePrivacyProtection() {
        var elements = document.querySelectorAll('p, td, div');
        elements.forEach(element => {
            element.style.filter = 'none';
        });
    }
})();
