var bkg_page = chrome.extension.getBackgroundPage();
var bbsurl = 'http://www.mcbbs.net';

var updateserver = 'https://api.zhaisoul.com/MCBBS-Helper/v1/update.json';
//API地址
var headurl = bbsurl + "/uc_server/avatar.php?uid=";//头像API
var userprofile = bbsurl + "/api/mobile/index.php?module=profile";//用户信息API
var forumindex = bbsurl + "/api/mobile/index.php?module=forumindex";
//每次调用API都将缓存消息、提醒、用户名等信息（反正有啥用得到的信息就缓存）

var mcbbs = new UserBBS(bbsurl, function () {
	$('#bbs-new-pm').text(mcbbs.pm > 0 ? '消息(' + mcbbs.pm + ')' : '消息');
	$('#bbs-new-notice').text(mcbbs.notice > 0 ? '提醒(' + mcbbs.notice + ')' : '提醒');
	if (mcbbs.userInfo) {
		$('#bbs-username').html(mcbbs.userInfo.username);
		$('#bbs-rank').html(mcbbs.userInfo.grouptitle);
		$('#bbs-avatar').attr('src', mcbbs.userInfo.avatar);

		$('#bbs-message-wrapper').show(100);
		$('#bbs-rank').show();

		$('#bbs-sign').removeAttr('disabled');
		$('#bbs-user-settings').removeAttr('disabled');
		$('#bbs-rank-progress-bar').css('width', mcbbs.userInfo.credits / mcbbs.userInfo.creditslower * 100 + '%');
		$('#bbs-rank-progress-bar a').html(mcbbs.userInfo.credits + '/' + mcbbs.userInfo.creditslower);
	} else {
		$('#bbs-username').html('请登录账号');
		$('#bbs-user-settings').hide();
		$('#bbs-sign').hide();
		$('#bbs-login').show(200);
	}
});

chrome.notifications.onButtonClicked.addListener(function (notifId, btnIdx) {
	console.debug("目前有这些链接："+ThreadURL+"\n接下来应该输出"+notifId+"的链接\n试图获得的链接为："+ThreadURL[notifId]);
	if (notifId === myNotificationID) {
		if (btnIdx === 0) {
			chrome.tabs.create({ url: bbsurl + "/home.php?mod=space&do=notice" });
		}
	}else{
		if (btnIdx === 0) {
			chrome.tabs.create({ url: ThreadURL[notifId] });
			chrome.notifications.clear(notifId)
		}
	}
});

document.addEventListener('DOMContentLoaded', function () {
	$('#bbs-open').click(OnClickOpenBBS);
	$('#bbs-sign').click(OnClickSign);
	$('#bbs-user-settings').click(OnClickSettings);
	$('#bbs-cyq-attack').click(OnClickCYQ);
	$('#bbs-rank').hover(OnMouseEnterExp, OnMouseLeaveExp);
	$('#bbs-login').click(OnClickLogin);
	$('#bbs-i-feel-lucky').click(GetHotThread);
	$(function () {
		chrome.tabs.getSelected(null, function (a) {
			if (bbsurl.indexOf(a.url.match(/:\/\/(.[^\/]+)/)[1]) >= 0) {
				$("#bbs-open").hide();
				$("#bbs-cyq-attack").html(Math.random() > 0.4 ? "一键CYQ Attack" : "一键DDOC").show();
				$("#bbs-user-settings").show();
				if(a.url.indexOf(".html")>=0||a.url.indexOf("portal.php?mod=view")>=0){
					$("#bbs-WeiboShare").show();
					$("#bbs-WeiboShare").click(shareToWeibo);
					$("#bbs-QzoneShare").show();
					$("#bbs-QzoneShare").click(shareToQzone);
				}
			} else {
				$("#bbs-cyq-attack").hide();
				$("#bbs-user-settings").hide();

			}
		});
		mcbbs.syncUserInfo();
	});
});

function CheckUpdate() {
	var a = getOption("Version");
	var b = String(chrome.app.getDetails().version);
	if (a === "0.0.0") {
		console.log("无版本号信息，正在进入向导模式");
		setOption("Version", chrome.app.getDetails().version);
		chrome.tabs.create({ url: chrome.extension.getURL("welcome.html?mod=fristrun") });
	} else {
		$.ajax({
			url: updateserver,
			contentType: 'MCBBSHelper Plugin/1.0(zhaisoul.650@gmail.com)'
		}).done(function (data) {
			if(data["version"]==b) {
				console.log("当前为最新版本。");
				var c = compareVersion(a, b);
				if (c < 0) {
					console.log("更新完成，正在打开更新信息");
					chrome.tabs.create({ url: chrome.extension.getURL("welcome.html?mod=new") });
					setOption("Version", chrome.app.getDetails().version);
				} else if (c > 0) {
					console.log("新安装的为老旧版本");
					setOption("Version", chrome.app.getDetails().version);
				} else {
					console.log("系统记录的版本与当前插件版本相同");
				}
			}else{
				console.log("检测到新版本"+data["version"]+"，正在等待Chrome自动更新");
				setTimeout(function () {
					console.log("超过30秒没有更新成功，提示用户手动更新");
					chrome.notifications.create({
						type: "basic",
						iconUrl: "icon.png",
						title: "MCBBS扩展插件有新版本了！",
						buttons: [{ title: "立即更新" }],
						message: "MCBBS扩展插件已经有新版本了，如果你无法使用Chrome的自动更新，建议你现在手动更新。"
					}, function (id) {
						ThreadURL[id] = data["url"];
					});
				}, 30000);
				
			}
		});
	}
}

function compareVersion(a, b) {
	if (a === b) return 0;
	for (var c = a.split("."), d = b.split("."), e = Math.min(c.length, d.length), f = 0; f < e; f++) {
		if (parseInt(c[f]) > parseInt(d[f])) return 1;
		if (parseInt(c[f]) < parseInt(d[f])) return - 1
	}

	return c.length > d.length ? 1 : c.length < d.length ? -1 : 0
}

function OnClickCYQ() {
	alert("啪，你死了，别说了。");
}

function OnMouseEnterExp() {
	$("#bbs-rank-progress-bar-wrapper").animate({
		marginTop: '5px',
		opacity: '1'
	});
}

function OnMouseLeaveExp() {
	$("#bbs-rank-progress-bar-wrapper").animate({
		marginTop: '-5px',
		opacity: '0'
	});
}

function OnClickLogin() {
	var url = bbsurl;
	chrome.tabs.create({
		url: bbsurl + "/member.php?mod=logging&action=login"
	});
}

function OnClickSign(e) {
	getNugget();
}

function OnClickOpenBBS(e) {
	chrome.tabs.create({
		url: bbsurl
	});
}

function OnClickSettings(e) {
	chrome.tabs.create({
		url: bbsurl + "/home.php?mod=spacecp"
	});
}

var myNotificationID = null;

function GetMessage() {
	if((getOption("NoticePush")==="false"?false:true)==true){
		console.log("开始获取新提醒 " + Date());
		mcbbs.syncUserInfo(function () {
			var messageCount = Number(mcbbs.notice) + Number(mcbbs.pm);
			if (messageCount > 0) {
				chrome.notifications.create({
					type: "basic",
					iconUrl: "icon.png",
					title: "MCBBS扩展插件",
					buttons: [{ title: "点击查看" }],
					message: "你有" + messageCount + "条新提醒，请点击查看！"
				}, function (id) {
					myNotificationID = id;
					setTimeout(function () {
						chrome.notifications.clear(id);
					}, 15000);
				});
			}
		});
	}
}

function getNugget() {
	console.log("开始自动签到");
	$.get(bbsurl + '/home.php?mod=task&do=apply&id=10').fail(getNuggetFailed).done(function (data) {
		$.get(bbsurl + '/home.php?mod=task&do=draw&id=10').fail(getNuggetFailed).done(function () {
			var regex = /<div id="messagetext" class="alert_\w*">\s*<p>([^<]*)/;
			var result = (regex.exec(data) || [])[1];

			var avatarUrl = "icon.png";
			if (mcbbs.userInfo)
				avatarUrl = mcbbs.userInfo.avatar;

			chrome.notifications.create({
				type: "basic",
				iconUrl: avatarUrl,
				title: "每日金粒领取 - " + new Date().toLocaleDateString(),
				message: result
			});
		});
	});
}

function getNuggetFailed() {
	chrome.notifications.create({
		type: "basic",
		iconUrl: "icon.png",
		title: "获取金粒失败",
		message: "网络出错了？"
	});
}

function FidToName(fid) {
	return new Promise((resolve) => {
		console.debug("通过fid找版块名中");
		chrome.storage.local.get("fid", (data) => {
			if (!data.length) GetForumIndex();

			for (let forum of data["fid"]) {
				if (forum.fid == fid) return resolve(forum["name"])
			}
		})

	});
}

function GetForumIndex() {
	$.ajax({
		url: forumindex,
		contentType: 'MCBBSHelper Plugin/1.0(zhaisoul.650@gmail.com)'
	}).done(function (data) {
		var json = data["Variables"]["forumlist"];
		console.log("保存版块列表至缓存中");
		var storage = chrome.storage.local;
		if (json) {
			storage.set({ 'fid': json });
		} else {
			storage.remove(['fid']);
		}
	})
}

var myHotThreadID = null;
var ThreadURL = [];

async function GetHotThread() {
	console.log("开始获取热门贴");
	var hotThread = await fetch(bbsurl + '/api/mobile/index.php?module=hotthread',{
		method :'get',contentType:'MCBBSHelper Plugin/1.0(zhaisoul.650@gmail.com)'
	})
	//console.log(data.json());
	var data = await hotThread.json();
	/*
	$.ajax({
		url: bbsurl + "/api/mobile/index.php?module=hotthread",
		contentType: 'MCBBSHelper Plugin/1.0(zhaisoul.650@gmail.com)'
	}).done(function (data) {
		*/
	var json = data['Variables']["data"];
	var randomThread = json[randomFrom(0, json.length)];
	var forumname = await FidToName(randomThread["fid"]);
	console.debug("应该接收"+forumname);
	//FidToName(randomThread["fid"]).then(forumname => {

	/*
	if(myHotThreadID!=null){
		console.log("手动清理通知");
		chrome.notifications.clear(myHotThreadID);
		myHotThreadID = null;
	}
	*/

	chrome.notifications.create({
		type: "basic",
		iconUrl: "icon.png",
		title: "MCBBS扩展插件-大家在看什么",
		buttons: [{ title: "点击查看" }],
		message: "【" + forumname + "】 " + randomThread["subject"],
		contextMessage:"最后回复时间："+randomThread["lastpost"].replace("&nbsp;"," "),
	}, function (id) {
		console.debug("该通知的id为"+id);
		ThreadURL[id] = bbsurl+"/thread-"+randomThread["tid"]+"-1-1.html";
		console.debug(ThreadURL);
		setTimeout(function () {
			console.log("自动清理通知");
			chrome.notifications.clear(id);
			//myHotThreadID = null;
			delete ThreadURL[id];
		}, 9000);
	});
	//});
}

function randomFrom(lowerValue, upperValue) {
	return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
}
