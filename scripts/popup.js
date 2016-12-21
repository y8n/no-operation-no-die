$(function() {
    var addWebsite = $('.add-website');
    var disableWebsite = $('.disable-website');
    var enableWebsite = $('.enable-website');
    var removeWebsite = $('.remove-website');
    var setting = $('footer');

    var currentTab = {};

    loadUrlList(function(isMatch, avaliable) {
        if (isMatch) {
            removeWebsite.show().on('click', removeHandler);
            if (avaliable) {
                disableWebsite.show().on('click', disabledHandler);
            } else {
                enableWebsite.show().on('click', enabledHandler);
            }
        } else {
            addWebsite.show().on('click', addHandler);
        }
    });

    function addHandler() {
        chrome.storage.local.get('urlList', function(items) {
            var list = items.urlList || [];
            list.push({
                name: currentTab.title,
                url: currentTab.url,
                avaliable: true
            });
            chrome.storage.local.set({
                urlList: list
            });
        });
        window.location.reload();
    }

    function removeHandler() {
        chrome.storage.local.get('urlList', function(items) {
            var list = items.urlList || [];
            var temp = list.filter(function(item) { // 过滤出所有符合该站点条件的配置
                return !isMatch(item);
            });
            chrome.storage.local.set({
                urlList: temp
            });
        });
        window.location.reload();
    }

    function disabledHandler() {
        chrome.storage.local.get('urlList', function(items) {
            var list = items.urlList || [];
            list.forEach(function(item) {
                if (isMatch(item)) {
                    item.avaliable = false;
                }
            });
            chrome.storage.local.set({
                urlList: list
            });
        });
        window.location.reload();
    }

    function enabledHandler() {
        chrome.storage.local.get('urlList', function(items) {
            var list = items.urlList || [];
            var find = list.find(function(item) {
                return item.url === currentTab.url;
            });
            if (find) { // 如果有完全匹配的，只启用这一个，否则启用最先匹配的
                find.avaliable = true;
            } else {
                find = list.find(function(item) {
                    return isMatch(item);
                });
                find.avaliable = true;
            }
            chrome.storage.local.set({
                urlList: list
            });
        });
        window.location.reload();
    }
    setting.on('click', openOptionsHandler);

    function openOptionsHandler() {
        window.open(chrome.extension.getURL('options.html'));
    }


    function loadUrlList(cb) {
        getCurrentTab(function(tab) {
            currentTab = tab;
            chrome.storage.local.get(['urlList'], function(items) {
                var urlList = items['urlList'];
                if (urlList) {
                    var match = urlList.find(function(item) {
                        return isMatch(item);
                    });
                    if (match) {
                        cb(match, match.avaliable);
                    } else {
                        cb();
                    }
                } else {
                    cb();
                }
            });
        });
    }

    function getCurrentTab(callback) {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
            callback(tabs[0]);
        });
    }

    function isMatch(item) {
        return currentTab.url.indexOf(item.url) !== -1;
    }
});