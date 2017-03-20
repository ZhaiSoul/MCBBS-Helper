/**
 * Created by zzzz on 3/17/17.
 */

function UserMCBBS() {
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
    var bbsUrlPrefix = 'http://www.mcbbs.net';

    function saveToStorage(callback) {
        callback = callback || function () {};
        var storage = chrome.storage.local;
        if (self.uid) {
            storage.set({'uid': self.uid, 'info': self.userInfo}, function () {
                callback();
            });
        } else {
            storage.remove(['uid', 'info'], function () {
                callback();
            });
        }
    }

    function loadFromStorage(callback) {
        callback = callback || function () {};
        var storage = chrome.storage.local;
        storage.get(['uid', 'info'], function (data) {
            if (data.uid) {
                self.uid = data.uid;
                self.userInfo = data.info;
            } else {
                self.uid = null;
                self.userInfo = null;
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
                avatar: json['member_avatar'].replace('size=small', 'size=middle'),
                username: json['member_username'],
                grouptitle: json['space'].group.grouptitle,
                credits: json['space'].credits,
                creditslower: json['space'].creditslower || json['space'].credits
            };
            self.pm = json['space'].newpm || 0;
            self.notice = json['space'].newprompt || 0;
            saveToStorage(callback);
        });
    };

    this.update = function (callback) {
        callback = callback || function () {};
        $('#bbs-new-pm').text(self.pm > 0 ? '消息(' + self.pm + ')' : '消息');
        $('#bbs-new-notice').text(self.notice > 0 ? '提醒(' + self.notice + ')' : '提醒');
        if (self.userInfo) {
            $('#bbs-username').html(self.userInfo.username);
            $('#bbs-rank').html(self.userInfo.grouptitle);
            $('#bbs-avatar').attr('src', self.userInfo.avatar);

            $('#divmessage').show(400);
            $('#bbs-rank').show();

            $('#bbs-sign').removeAttr('disabled');
            $('#bbs-user-settings').removeAttr('disabled');
            $('#rankexppro').css('width', self.userInfo.credits / self.userInfo.creditslower * 100 + '%');
            $('#rankexp').html(self.userInfo.credits + '/' + self.userInfo.creditslower);
        } else {
            $('#bbs-username').html('请登录账号');
            $('#bbs-user-settings').hide();
            $('#bbs-sign').hide();
            $('#bbs-login').show(200);
        }
        callback();
    };

    loadFromStorage(self.update);
}