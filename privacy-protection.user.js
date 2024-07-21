// ==UserScript==
// @name         雨云截图隐私保护脚本
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  给包含特定隐私内容的元素添加模糊效果，并提供开关按钮控制
// @author       ndxzzy,ChatGPT
// @match        *://app.rainyun.com/*
// @updateURL    https://github.com/rainyun-space/rainyun-privacy-protection/raw/main/privacy-protection.user.js
// @downloadURL  https://github.com/rainyun-space/rainyun-privacy-protection/raw/main/privacy-protection.user.js
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    var privacyProtectionEnabled = false;

    function togglePrivacyProtection() {
        privacyProtectionEnabled = !privacyProtectionEnabled;
        if (privacyProtectionEnabled) {
            applyPrivacyProtection();
        } else {
            removePrivacyProtection();
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
            if (h4Element.textContent.includes('公网IP列表') ||
                h4Element.textContent.includes('面板用户名') ||
                h4Element.textContent.includes('CDN设置') ||
                h4Element.textContent.includes('发票抬头列表') ||
                h4Element.textContent.includes('我的发票') ||
                h4Element.textContent.includes('发起提现') ||
                h4Element.textContent.includes(' 域名管理') ||
                h4Element.textContent.includes(' 我的模板') ||
                h4Element.textContent.includes(' 域名管理') ||
                h4Element.textContent.includes('NAT端口映射管理') ||
                h4Element.textContent.includes('Nat端口映射') ||
                h4Element.textContent.includes('绑定支付宝') ||
                h4Element.textContent.includes('绑定邮箱') ||
                h4Element.textContent.includes('账号变动日志') ||
                h4Element.textContent.includes('API秘钥')) {
                var divParent = h4Element.parentNode;
                if (divParent.tagName === 'DIV') {
                    divParent.style.filter = 'blur(5px)';
                }
            }
        });
        var tableElements = document.querySelectorAll('table');
        tableElements.forEach(tableElement => {
            if (tableElement.textContent.includes('日志ID')) {
                var divParent = tableElement.parentNode;
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
                } else if (element.querySelector('small') && element.querySelector('small').textContent.includes('内网IP：')) {
                    element.style.filter = 'blur(5px)';
                } else if (element.querySelector('small') && element.querySelector('small').textContent.includes('远程连接地址 (RDP/SSH)：')) {
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
