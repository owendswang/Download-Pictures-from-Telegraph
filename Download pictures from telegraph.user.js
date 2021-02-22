// ==UserScript==
// @name         Download pictures from telegraph
// @name:zh-CN   下载Telegraph图片
// @version      0.1
// @description  Download pictures from telegra.ph
// @description:zh-CN 下载“telegra.ph”页面上的图片
// @author       OWENDSWANG
// @match        https://telegra.ph/*
// @exclude      https://telegra.ph/
// @run-at       document-end
// @grant        GM_download
// ==/UserScript==

(function() {
    'use strict';

    function download(imgSrcList) {
        imgSrcList.forEach(function(src) {
            var fileName = src.split('/')[src.split('/').length - 1];
            fileName = fileName.split('?')[0];
            GM_download(src, fileName);
        })
    }

    var figureList = document.getElementsByTagName('figure');
    var imgSrcList = [];
    for (var i = 0; i < figureList.length; i++) {
        var img = figureList[i].getElementsByTagName('img')[0];
        var src = img.getAttribute('src');
        imgSrcList.push(src);
    }

    if (imgSrcList.length > 0) {
        var addressList = document.getElementsByTagName('address');
        for (var j = 0; j < addressList.length; j++) {
            if (addressList[j].getAttribute("dir") == 'auto') {
                var button = document.createElement('button');
                button.innerHTML = 'Download';
                // button.setAttribute('style', 'margin-left: 10px;');
                button.style.marginLeft = '10px';
                button.style.paddingLeft = '15px';
                button.style.paddingRight = '15px';
                button.style.backgroundColor = 'rgba(0,0,0,0)';
                button.style.border = '2px solid rgba(0,0,0,0.5)';
                button.style.borderRadius = '5px';
                button.type = 'button';
                // button.setAttribute('type', 'button');
                button.addEventListener('mouseover', function(event) {
                    this.style.backgroundColor = 'rgba(0,0,0,0.1)';
                });
                button.addEventListener('mouseout', function(event) {
                    this.style.backgroundColor = 'rgba(0,0,0,0)';
                });
                button.onclick = function(){
                    download(imgSrcList);
                };
                addressList[j].appendChild(button);
            }
        }
    }
})();
