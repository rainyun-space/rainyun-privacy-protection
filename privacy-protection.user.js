// ==UserScript==
// @name         雨云截图隐私保护脚本
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  给包含特定隐私内容的元素添加模糊效果，并提供开关按钮控制
// @author       ndxzzy,ChatGPT
// @match        *://app.rainyun.com/*
// @grant        none
// @updateURL    https://github.com/rainyun-space/privacy-protection/raw/main/privacy-protection.user.js
// @downloadURL  https://github.com/rainyun-space/privacy-protection/raw/main/privacy-protection.user.js
// ==/UserScript==

(function() {
    'use strict';

    var toggleButton = document.createElement('button');
    toggleButton.innerHTML = '打码';
    toggleButton.style.position = 'fixed';
    toggleButton.style.left = '10px';
    toggleButton.style.bottom = '10px';
    toggleButton.style.padding = '5px';
    toggleButton.style.backgroundColor = '#007bff';
    toggleButton.style.color = '#fff';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '3px';
    toggleButton.style.cursor = 'pointer';
    document.body.appendChild(toggleButton);

    var privacyProtectionEnabled = false;
    var clickListenerEnabled = false;

    function togglePrivacyProtection() {
        privacyProtectionEnabled = !privacyProtectionEnabled;
        if (privacyProtectionEnabled) {
            toggleButton.innerHTML = '恢复';
            if (!clickListenerEnabled) {
                document.addEventListener('click', handleClick);
                clickListenerEnabled = true;
            }
        } else {
            toggleButton.innerHTML = '打码';
            removePrivacyProtection();
            if (clickListenerEnabled) {
                document.removeEventListener('click', handleClick);
                clickListenerEnabled = false;
            }
        }
    }

    toggleButton.addEventListener('click', togglePrivacyProtection);

    function handleClick() {
        if (privacyProtectionEnabled) {
            applyPrivacyProtectionMultipleTimes();
        }
    }

    function applyPrivacyProtectionMultipleTimes() {
        var delay = 100;
        for (var i = 0; i < 20; i++) {
            setTimeout(applyPrivacyProtection, delay * (i + 1));
        }
    }

    function applyPrivacyProtection() {
        if (!privacyProtectionEnabled) {
            return;
        }
        var h4Elements = document.querySelectorAll('h4');
        h4Elements.forEach(h4Element => {
            if (h4Element.textContent.includes('公网IP列表') ||
                h4Element.textContent.includes('发票抬头列表') ||
                h4Element.textContent.includes('我的发票') ||
                h4Element.textContent.includes('发起提现') ||
                h4Element.textContent.includes(' 域名管理') ||
                h4Element.textContent.includes(' 我的模板') ||
                h4Element.textContent.includes(' 域名管理') ||
                h4Element.textContent.includes('NAT端口映射管理') ||
                h4Element.textContent.includes('绑定支付宝') ||
                h4Element.textContent.includes('绑定邮箱') ||
                h4Element.textContent.includes('API秘钥')) {
                var divParent = h4Element.parentNode;
                if (divParent.tagName === 'DIV') {
                    divParent.style.filter = 'blur(5px)';
                }
            }
        });
        var elements = document.querySelectorAll('p, td, div');
        elements.forEach(element => {
            if (element.tagName === 'P') {
                if (element.textContent.includes('公网IP') ||
                    element.textContent.includes('服务器ID') ||
                    element.textContent.includes('标签')) {
                    element.style.filter = 'blur(5px)';
                }
            } else if (element.tagName === 'TD') {
                if (element.querySelector('small') && element.querySelector('small').textContent.includes('公网 IP 地址：')) {
                    element.style.filter = 'blur(5px)';
                } else if (element.querySelector('small') && element.querySelector('small').textContent.includes('面板主账户：')) {
                    element.style.filter = 'blur(5px)';
                } else if (element.querySelector('small') && element.querySelector('small').textContent.includes('安装结果输出')) {
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
