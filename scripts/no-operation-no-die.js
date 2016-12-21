/**
 * no-operation-no-die.js
 * 不操作就不会死
 * y8n 2016-12-21
 */
console.log('no-operation-no-die loaded');

var nondStyle = {
    position: 'fixed',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,.5)',
    zIndex: 99999
};
var nondAlertStyle = {
    color: '#a94442',
    backgroundColor: '#f2dede',
    borderColor: '#ebccd1',
    padding: '15px',
    marginBottom: '20px',
    border: '1px solid transparent',
    borderRadius: '4px',
    width: '500px',
    position: 'fixed',
    left: '50%',
    marginLeft: '-250px',
    top: '25%',
    fontSize: '18px',
    fontWeight: 700,
    zIndex: 999999
};
var nondCloseStyle = {
    float: 'right',
    color: '#000',
    textDecoration: 'none',
    fontSize: '24px'
};

setTimeout(function() {
    loadUrlList(function(match) {
        if (match) {
            init();
        }
    });
}, 500);

function loadUrlList(cb) {
    var reg;
    chrome.storage.local.get(['urlList'], function(items) {
        var urlList = items['urlList'];
        if (urlList) {
            var isMatch = urlList.find(function(item) {
                return window.location.href.indexOf(item.url) !== -1 && item.avaliable;
            });
            cb(isMatch);
        }
    });
}

function init() {
    var el = createElement();
    $('body').append(el);
    render();
}

function createElement() {
    return $('<div id="noOperationNoDie"><div class="nond-alert" data-click="0"><span class="nond-content"></span><a href="javascript:;" class="nond-close">&times;</a></div></div>');
}

function render() {
    $('#noOperationNoDie').css(nondStyle);
    $('.nond-alert').css(nondAlertStyle);
    $('.nond-content').text('⚠️该站点为线上环境，请勿随意操作!');
    $('.nond-close').css(nondCloseStyle).on('click', onClickHandler);
}

function onClickHandler() {
    var dataClick = $('.nond-alert').data('click');
    if (dataClick == 0) {
        $('body').append($('.nond-alert'))
        $('.nond-alert').data('click', 2).css({
            top: 0
        });
        $('#noOperationNoDie').remove();
    } else {
        $('.nond-close').off('click', onClickHandler);
        $('.nond-alert').remove();
    }
}