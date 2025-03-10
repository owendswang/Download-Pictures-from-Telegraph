// ==UserScript==
// @name         Download pictures from telegraph
// @name:zh-CN   下载Telegraph页面图片
// @version      0.6.0
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
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_notification
// @namespace https://www.owendswang.com/
// @downloadURL https://update.greasyfork.org/scripts/422130/Download%20pictures%20from%20telegraph.user.js
// @updateURL https://update.greasyfork.org/scripts/422130/Download%20pictures%20from%20telegraph.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var tlEditor = document.getElementById('_tl_editor');
    var pageTitle = document.getElementsByTagName('h1')[0];

    function saveAs(blob, name) {
        const link = document.createElement("a");
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        link.download = name;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        const timeout = setTimeout(() => {
            URL.revokeObjectURL(link.href);
            link.parentNode.removeChild(link);
        }, 1000);
    }

    async function downloadSingle(url, fileName) {
        try {
            const res = await fetch(url, { browsingTopics: false });
            if (!res.ok) {
                throw new Error(`Response status: ${res.status}`);
            }
            const blob = await res.blob();
            saveAs(blob, fileName);
        } catch(e) {
            console.log(e);
        }
    }

    // 'download' button
    function download(imgSrcList) {
        // console.log(imgSrcList);
        var i = 1;
        var padLength = imgSrcList.length.toString().length;
        var title = pageTitle.textContent.replace('[Click to copy this title]', '').replace('[Copied]', '').replace(/ - Page \d+$/, '');
        imgSrcList.forEach(function(src) {
            // var fileName = src.split('/')[src.split('/').length - 1];
            // fileName = fileName.split('?')[0];
            var ext = src.split('.').length > 1 ? src.split('.')[src.split('.').length - 1] : 'jpg';
            var fileName = title + ' (' + i.toString().padStart(padLength, '0') + ').' + ext;
            fileName = fileName.replace(/[<>|\|*|"|\/|\|:|?]/g, '_');
            // 1. GM_download wouldn't work with urls without file extension
            // GM_download({
            //     url: src,
            //     name: fileName,
            //     onerror(error) {
            //         console.log(error);
            //     }
            // });
            // 2. fetch wouldn't work with cross-site request
            // downloadSingle(src, fileName);
            // 3. GM_xmlhttpRequest works fine
            GM_xmlhttpRequest({
                method: 'GET',
                url: src,
                responseType: 'blob',
                // headers: {},
                onload({ status, response }) {
                    saveAs(response, fileName);
                },
                onerror(error) {
                    console.log(error);
                    GM_notification({
                        text: error.error,
                        title: 'Download Error',
                    });
                }
            });
            i += 1;
        })
    }

    // header 'download' button
    var headerButton = document.createElement('button');
    var figureList = document.getElementsByTagName('figure');
    headerButton.innerHTML = '<b>Download</b> (' + figureList.length.toString() + ' images in total)';
    headerButton.style.marginLeft = '10px';
    headerButton.style.paddingLeft = '15px';
    headerButton.style.paddingRight = '15px';
    headerButton.style.backgroundColor = 'rgba(0,0,0,0)';
    headerButton.style.border = '2px solid rgba(0,0,0,0.5)';
    headerButton.style.borderRadius = '5px';
    headerButton.type = 'button';
    headerButton.addEventListener('mouseover', function(event) {
        this.style.backgroundColor = 'rgba(0,0,0,0.1)';
    });
    headerButton.addEventListener('mouseout', function(event) {
        this.style.backgroundColor = 'rgba(0,0,0,0)';
    });
    headerButton.onclick = function() {
        var imgSrcList = [];
        for (var i = 0; i < figureList.length; i++) {
            var img = figureList[i].getElementsByTagName('img')[0];
            var src = img.getAttribute('src');
            imgSrcList.push(src);
        }
        download(imgSrcList);
    };
    var addressList = document.getElementsByTagName('address');
    addressList[0].appendChild(headerButton);

    // bottom 'download' button
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
        for (var i = 0; i < figureList.length; i++) {
            var img = figureList[i].getElementsByTagName('img')[0];
            var src = img.getAttribute('src');
            imgSrcList.push(src);
        }
        download(imgSrcList);
    };
    divButtonBottom.appendChild(buttonBottom);
    tlEditor.appendChild(divButtonBottom);

    // 'to top' button
    var toTopBtn = document.createElement('button');
    toTopBtn.id = 'to_top_btn';
    toTopBtn.textContent = '▲';
    toTopBtn.style.fontSize = '2rem';
    toTopBtn.style.position = 'fixed';
    toTopBtn.style.bottom = '2rem';
    toTopBtn.style.textAlign = 'center';
    toTopBtn.style.width = '4rem';
    toTopBtn.style.height = '4rem';
    toTopBtn.style.lineHeight = '3rem';
    toTopBtn.style.opacity = '0';
    toTopBtn.style.padding = '0';
    toTopBtn.style.borderWidth = '2px';
    toTopBtn.style.borderStyle = 'solid';
    toTopBtn.style.borderColor = 'gray';
    toTopBtn.style.borderRadius = '5px';
    toTopBtn.style.transition = 'opacity 1s';
    toTopBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
    toTopBtn.addEventListener('mouseover', function(event) {
        this.style.backgroundColor = 'rgba(0,0,0,0.2)';
    });
    toTopBtn.addEventListener('mouseout', function(event) {
        this.style.backgroundColor = 'rgba(0,0,0,0.1)';
    });
    toTopBtn.addEventListener('mousedown', function(event) {
        this.style.backgroundColor = 'rgba(0,0,0,0.3)';
    });
    toTopBtn.addEventListener('mouseup', function(event) {
        this.style.backgroundColor = 'rgba(0,0,0,0.2)';
    });

    function setToTopBtnXPos() {
        var left = (document.body.clientWidth + tlEditor.offsetWidth) / 2;
        var remPx = parseInt(getComputedStyle(document.documentElement).fontSize);
        if (left + toTopBtn.offsetWidth + 2 * remPx < document.body.clientWidth) {
            toTopBtn.style.removeProperty('right');
            toTopBtn.style.left = left.toString() + 'px';
        } else {
            toTopBtn.style.removeProperty('left');
            toTopBtn.style.right = '2rem';
        }
    }
    window.onresize = setToTopBtnXPos;
    setToTopBtnXPos();

    window.onscroll = function() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            toTopBtn.style.opacity = '1';
        } else {
            toTopBtn.style.opacity = '0';
        }
    };

    function topFunction() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    toTopBtn.onclick = topFunction;

    var style4toTopBtn = document.createElement('style');
    style4toTopBtn.textContent = '\
@media only screen and (max-width: 732px) {\
    button#to_top_btn {\
        display: none;\
    }\
';
    document.head.appendChild(style4toTopBtn);
    tlEditor.appendChild(toTopBtn);

    // 'copy title' button
    var copyTip = document.createElement('small');
    copyTip.textContent = '[Click to copy this title]';
    copyTip.style.backgroundColor = 'lightgray';
    copyTip.style.position = 'absolute';
    copyTip.style.right = '0px';
    copyTip.style.bottom = '0px';
    copyTip.style.fontSize = '1rem';
    copyTip.style.fontWeight = 'normal';
    copyTip.style.color = 'gray';
    copyTip.style.lineHeight = '1rem';
    copyTip.style.padding = '0.1rem';
    pageTitle.title = 'Click to copy this title'
    pageTitle.style.position = 'relative';
    pageTitle.addEventListener('mouseover', function(event) {
        this.style.backgroundColor = 'lightgray';
        copyTip.style.display = 'block';
        if (pageTitle.getElementsByTagName('small').length > 0) {
            copyTip.textContent = '[Click to copy this title]';
        } else {
            pageTitle.appendChild(copyTip);
        }
    });
    pageTitle.addEventListener('mouseout', function(event) {
        this.style.backgroundColor = null;
        copyTip.style.display = 'none';
    });
    pageTitle.addEventListener('mousedown', function(event) {
        this.style.backgroundColor = 'darkgray';
        copyTip.style.backgroundColor = 'darkgray';
    });
    pageTitle.addEventListener('mouseup', function(event) {
        this.style.backgroundColor = 'lightgray';
        copyTip.style.backgroundColor = 'lightgray';
    });
    pageTitle.onclick = function() {
        GM_setClipboard(pageTitle.textContent.replace('[Click to copy this title]', '').replace('[Copied]', '').replace(/ - Page \d+$/, ''), 'text');
        copyTip.textContent = '[Copied]';
    };
})();
