// ==UserScript==
// @name         TJAD 阅读器
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  Just a Reader for TJAD via Chrome
// @author       atan
// @match        http://*.tjad.cn/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/php-unserialize@0.0.1/php-unserialize.min.js
// @require      https://cdn.jsdelivr.net/npm/crypto-js@4.1.1/crypto-js.min.js
// ==/UserScript==

(function () {
    "use strict";

    let safeUrl = s => s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");


    function genNewUrl(oldUrl) {
        let key = CryptoJS.enc.Utf8.parse("itMkwgYdmMU3afKU");
        return (
            "https://pdf.pinweb.io/n/" +
            safeUrl(
                CryptoJS.AES.encrypt(JSON.stringify(oldUrl), key, {
                    mode: CryptoJS.mode.ECB,
                }).toString()
            )
        );
    }

    // Your code here...
    function addReaderLink() {
        var as = document.querySelectorAll("a[data-size]");
        for (var i = 0; i < as.length; i++) {
            let newUrl = "#";

            if (as[i].href.startsWith("http://read.tjad.cn/")) {
                let docNode = parseLink(as[i].href);
                docNode.doc +='?v=2';
                newUrl = genNewUrl(docNode);
                as[i].parentElement.insertAdjacentHTML(
                    "beforeend",
                    '<a href="' +
                        newUrl +
                        '" target="_blank" class="ml-4 text-red-600">测试新版阅读</a>'
                );
            } else {
                let size = as[i].dataset.size;
                if (size < 20000000) {
                    let payload = {
                        doc: as[i].href.split("?")[0] + "?doc-convert/preview&v=2",
                        u: "vadmin",
                    };
                    newUrl = genNewUrl(payload);
                    as[i].parentElement.insertAdjacentHTML(
                        "beforeend",
                        '<a href="' +
                            newUrl +
                            '" target="_blank" class="ml-4 text-red-600">测试新版阅读</a>'
                    );
                }

            }
        }
    }

    let parseLink = link => PHPUnserialize.unserialize(atob(link.replace("http://read.tjad.cn/t/", "")));
    

    document.addEventListener("inertia:success", (event) => {
        addReaderLink();
    });

    window.addEventListener("load", (event) => {
        addReaderLink();
    });
})();
