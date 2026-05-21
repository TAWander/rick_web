(function(window, document) {
    'use strict';

    var CONFIG = {
        ENABLE_PASSWORD: false,
        PASSWORD: '1591144',
        ENABLE_CANVAS_RENDER: true,
        ENABLE_CONTEXT_MENU_BLOCK: true,
        ENABLE_DRAG_BLOCK: true,
        ENABLE_SELECT_BLOCK: false,
        ENABLE_KEYBOARD_BLOCK: false,
        ENABLE_TOUCH_BLOCK: true,
        ENABLE_DEVTOOLS_DETECT: false
    };

    function initPasswordProtection() {
        if (!CONFIG.ENABLE_PASSWORD) return;

        var hasAccess = sessionStorage.getItem('hasAccess');
        if (hasAccess === 'true') return;

        var password = prompt('请输入访问密码：');
        if (password !== CONFIG.PASSWORD) {
            document.body.innerHTML = '<h1 style="text-align:center;margin-top:50px;color:red;">密码错误，拒绝访问</h1>';
            return false;
        }

        sessionStorage.setItem('hasAccess', 'true');
        return true;
    }

    function blockContextMenu() {
        if (!CONFIG.ENABLE_CONTEXT_MENU_BLOCK) return;

        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });
    }

    function blockDragAndDrop() {
        if (!CONFIG.ENABLE_DRAG_BLOCK) return;

        document.addEventListener('dragstart', function(e) {
            e.preventDefault();
            return false;
        });

        document.addEventListener('drag', function(e) {
            e.preventDefault();
            return false;
        });

        document.addEventListener('drop', function(e) {
            e.preventDefault();
            return false;
        });
    }

    function blockTextSelection() {
        if (!CONFIG.ENABLE_SELECT_BLOCK) return;

        document.addEventListener('selectstart', function(e) {
            e.preventDefault();
            return false;
        });

        document.addEventListener('mouseup', function(e) {
            window.getSelection().removeAllRanges();
        });

        document.addEventListener('copy', function(e) {
            e.preventDefault();
            return false;
        });
    }

    function blockKeyboardShortcuts() {
        if (!CONFIG.ENABLE_KEYBOARD_BLOCK) return;

        document.addEventListener('keydown', function(e) {
            var ctrlPressed = e.ctrlKey || e.metaKey;
            
            if (ctrlPressed && e.key.toLowerCase() === 's') {
                e.preventDefault();
                return false;
            }

            if (ctrlPressed && e.key.toLowerCase() === 'u') {
                e.preventDefault();
                return false;
            }

            if (e.key === 'F12') {
                e.preventDefault();
                return false;
            }

            if (ctrlPressed && e.shiftKey && e.key.toLowerCase() === 'i') {
                e.preventDefault();
                return false;
            }

            if (ctrlPressed && e.key.toLowerCase() === 'j') {
                e.preventDefault();
                return false;
            }

            if (e.key === 'PrintScreen') {
                e.preventDefault();
                return false;
            }
        });
    }

    function blockTouchLongPress() {
        if (!CONFIG.ENABLE_TOUCH_BLOCK) return;

        var touchTimer = null;

        document.addEventListener('touchstart', function(e) {
            touchTimer = setTimeout(function() {
                e.preventDefault();
            }, 500);
        });

        document.addEventListener('touchend', function() {
            if (touchTimer) {
                clearTimeout(touchTimer);
                touchTimer = null;
            }
        });

        document.addEventListener('touchmove', function() {
            if (touchTimer) {
                clearTimeout(touchTimer);
                touchTimer = null;
            }
        });

        document.addEventListener('touchcancel', function() {
            if (touchTimer) {
                clearTimeout(touchTimer);
                touchTimer = null;
            }
        });
    }

    function detectDevTools() {
        if (!CONFIG.ENABLE_DEVTOOLS_DETECT) return;

        var devtoolsOpen = false;
        var threshold = 160;

        var checkInterval = setInterval(function() {
            var widthThreshold = window.outerWidth - window.innerWidth > threshold;
            var heightThreshold = window.outerHeight - window.innerHeight > threshold;
            var orientationChanged = window.orientation !== undefined;

            if (!devtoolsOpen && (widthThreshold || heightThreshold)) {
                devtoolsOpen = true;
                handleDevToolsOpen();
            } else if (devtoolsOpen && !widthThreshold && !heightThreshold) {
                devtoolsOpen = false;
            }
        }, 500);

        function handleDevToolsOpen() {
            document.body.innerHTML = '<h1 style="text-align:center;margin-top:50px;color:red;">检测到开发者工具，页面已关闭</h1>';
            clearInterval(checkInterval);
            sessionStorage.removeItem('hasAccess');
        }

        var lastTime = new Date();
        setInterval(function() {
            var now = new Date();
            if (now - lastTime > 100) {
                handleDevToolsOpen();
            }
            lastTime = now;
        }, 100);
    }

    function renderImagesToCanvas() {
        if (!CONFIG.ENABLE_CANVAS_RENDER) return;

        var images = document.querySelectorAll('img');
        
        images.forEach(function(img) {
            if (img.classList.contains('u-logo-image')) return;

            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            
            canvas.width = img.naturalWidth || img.width || 400;
            canvas.height = img.naturalHeight || img.height || 300;
            
            canvas.style.width = img.style.width || 'auto';
            canvas.style.height = img.style.height || 'auto';
            canvas.style.maxWidth = '100%';
            canvas.style.display = 'block';
            
            var tempImg = new Image();
            tempImg.crossOrigin = 'anonymous';
            
            tempImg.onload = function() {
                ctx.drawImage(tempImg, 0, 0, canvas.width, canvas.height);
                
                var parent = img.parentNode;
                parent.replaceChild(canvas, img);
            };
            
            tempImg.onerror = function() {
                console.error('Failed to load image:', img.src);
            };
            
            tempImg.src = img.src;
        });
    }

    function addGlobalStyles() {
        var style = document.createElement('style');
        style.textContent = `
            canvas {
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                pointer-events: auto;
            }
            img {
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
        `;
        document.head.appendChild(style);
    }

    function init() {
        if (!initPasswordProtection()) return;

        addGlobalStyles();
        blockContextMenu();
        blockDragAndDrop();
        blockTextSelection();
        blockKeyboardShortcuts();
        blockTouchLongPress();
        detectDevTools();

        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(renderImagesToCanvas, 100);
        });

        if (document.readyState === 'complete') {
            setTimeout(renderImagesToCanvas, 100);
        }
    }

    init();

    window.Protector = {
        config: CONFIG,
        reinit: init,
        renderImages: renderImagesToCanvas
    };

})(window, document);