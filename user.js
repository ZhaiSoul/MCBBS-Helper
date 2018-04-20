/**
 * Created by zzzz on 3/17/17.
 */

function UserBBS(bbsUrlPrefix, updateCallback) {
    this.uid = null;
    // {
    //   avatar: 'http://xxxxxx&size=medium',
    //   username: 'gamerteam',
    //   grouptitle: 'Lv.9 xxx',
    //   credits: '6666',
    //   creditslower: '10000'
    // }
    this.userInfo = null;

    this.pm = 0;
    this.notice = 0;

    var self = this;
    var headUrlPrefix = bbsUrlPrefix + "/uc_server/avatar.php?uid=";//头像API
    var userProfileUrl = bbsUrlPrefix + "/api/mobile/index.php?module=profile";//用户信息API

    function saveToStorage(callback) {
        callback = callback || function () {};
        var storage = chrome.storage.local;
        if (self.uid) {
            storage.set({'uid': self.uid, 'info': self.userInfo,'cookies': self.cookies}, callback.bind(undefined));
        } else {
            storage.remove(['uid', 'info', 'cookies'], callback.bind(undefined));
        }
    }

    function loadFromStorage(callback) {
        callback = callback || function () {};
        var storage = chrome.storage.local;
        storage.get(['uid', 'info','cookies'], function (data) {
            if (data.uid) {
                self.uid = data.uid;
                self.userInfo = data.info;
                self.cookies = data.cookies;
            } else {
                self.uid = null;
                self.userInfo = null;
                self.cookies = null;
            }
            callback();
        });
    }

    this.syncUserInfo = function (callback) {
        callback = callback || function () {};
        $.ajax({
            url: bbsUrlPrefix + '/api/mobile/index.php?module=profile',
            contentType: 'MCBBSHelper Plugin/1.0(zhaisoul.650@gmail.com)'
        }).done(function (data) {
            var json = data['Variables'];
            self.uid = json['member_uid'];
            self.userInfo = {
                avatar: json['member_avatar']
                    .replace('size=small', 'size=middle')
                    .replace(/http:\/\/[^\/]+/, bbsUrlPrefix),
                username: json['member_username'],
                grouptitle: json['space'].group.grouptitle,
                credits: json['space'].credits,
                creditslower: json['space'].creditslower || json['space'].credits
            };
            self.cookies ={
                auth : json["auth"],
                saltkey : json["saltkey"],
                cookiepre : json["cookiepre"]
            };
            self.pm = json['space'].newpm || 0;
            self.notice = json['space'].newprompt || 0;
            saveToStorage(function () {
                updateCallback();
                callback();
            });
        });
    };

    loadFromStorage(updateCallback);
}