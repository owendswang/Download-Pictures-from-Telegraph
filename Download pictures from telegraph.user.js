// ==UserScript==
// @name         Download pictures from telegraph
// @name:zh-CN   下载Telegraph页面图片
// @version      0.4.2
// @description  Download pictures from telegra.ph
// @description:zh-CN 下载“telegra.ph”页面上的图片
// @author       OWENDSWANG
// @match        https://telegra.ph/*
// @exclude      https://telegra.ph/
// @icon         https://avatars.githubusercontent.com/u/9076865?s=40&v=4
// @license      MIT
// @homepage     https://greasyfork.org/zh-CN/scripts/422130-download-pictures-from-telegraph
// @supportURL   https://github.com/owendswang/Download-Pictures-from-Telegraph
// @run-at       document-end
// @grant        GM_download
// ==/UserScript==

(function() {
    'use strict';

    function download(imgSrcList, imgNameHeader) {
        var i = 1;
        var padLength = imgSrcList.length.toString().length;
        imgSrcList.forEach(function(src) {
            // var fileName = src.split('/')[src.split('/').length - 1];
            // fileName = fileName.split('?')[0];
            var ext = src.split('.')[src.split('.').length - 1];
            var fileName = imgNameHeader + ' (' + i.toString().padStart(padLength, '0') + ').' + ext;
            fileName = fileName.replace(/[<>|\|*|"|\/|\|:|?]/g, '_');
            GM_download(src, fileName);
            i += 1;
        })
    }

    var addressList = document.getElementsByTagName('address');
    for (var j = 0; j < addressList.length; j++) {
        if (addressList[j].getAttribute("dir") == 'auto') {
            // header button
            var button = document.createElement('button');
            var figureList = document.getElementsByTagName('figure');
            button.innerHTML = '<b>Download</b> (' + figureList.length.toString() + ' images in total)';
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
            button.onclick = function() {
                var imgSrcList = [];
                var pageTitle = document.getElementsByTagName('h1')[0].textContent;
                for (var i = 0; i < figureList.length; i++) {
                    var img = figureList[i].getElementsByTagName('img')[0];
                    var src = img.getAttribute('src');
                    imgSrcList.push(src);
                }
                download(imgSrcList, pageTitle);
            };
            addressList[j].appendChild(button);

            // bottom button
            var divButtonBottom = document.createElement('div');
            divButtonBottom.style.display = 'flex';
            divButtonBottom.style.justifyContent = 'center';
            var buttonBottom = document.createElement('button');
            buttonBottom.innerHTML = '<b>Download</b> (' + figureList.length.toString() + ' images in total)';
            buttonBottom.style.margin = '10px';
            buttonBottom.style.paddingTop = '10px';
            buttonBottom.style.paddingBottom = '10px';
            buttonBottom.style.paddingLeft = '20px';
            buttonBottom.style.paddingRight = '20px';
            buttonBottom.style.backgroundColor = 'rgba(0,0,0,0)';
            buttonBottom.style.border = '2px solid rgba(0,0,0,0.5)';
            buttonBottom.style.borderRadius = '5px';
            buttonBottom.type = 'button';
            buttonBottom.addEventListener('mouseover', function(event) {
                this.style.backgroundColor = 'rgba(0,0,0,0.1)';
            });
            buttonBottom.addEventListener('mouseout', function(event) {
                this.style.backgroundColor = 'rgba(0,0,0,0)';
            });
            buttonBottom.onclick = function() {
                var imgSrcList = [];
                var pageTitle = document.getElementsByTagName('h1')[0].textContent;
                for (var i = 0; i < figureList.length; i++) {
                    var img = figureList[i].getElementsByTagName('img')[0];
                    var src = img.getAttribute('src');
                    imgSrcList.push(src);
                }
                download(imgSrcList, pageTitle);
            };
            divButtonBottom.appendChild(buttonBottom);
            document.getElementById('_tl_editor').appendChild(divButtonBottom);
        }
    }
})();
