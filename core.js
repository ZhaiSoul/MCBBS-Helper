var bkg_page = chrome.extension.getBackgroundPage();
var bbsurl = "http://www.mcbbs.net"
var headurl = bbsurl+"/uc_server/avatar.php?uid=";
var uid = "";
chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
    if (notifId === myNotificationID) {
        if (btnIdx === 0) {
			var url = bbsurl;
			chrome.tabs.create({
			url:bbsurl+"/home.php?mod=space&do=notice"
			});
		}
    }
}),
document.addEventListener('DOMContentLoaded', function () {
		document.getElementById('OpenBBS').addEventListener('click', OnClickOpenBBS);
		document.getElementById('Sign').addEventListener('click', OnClickSign);
		document.getElementById('UserSettings').addEventListener('click', OnClickSettings);
		document.getElementById('NewNotice').addEventListener('click', OnClickOpenMessage);	
		document.getElementById('CYQ').addEventListener('click', OnClickCYQ);	
		document.getElementById('rank').addEventListener('mouseenter', OnMouseEnterExp);
		document.getElementById('rank').addEventListener('mouseleave', OnMouseLeaveExp);
		GetUserInfo(function (array){
			console.log(array);
			uid = array[0];
			if(array!=null){
				if(uid!=0){
					if(array[3]<=0||array[3]==null||array[3]==undefined){
					}else{
						$("#NewNotice").text("提醒("+array[3]+")")
						$("#NewPM").text("消息("+array[4]+")")
					}
					$("#username").html(array[1]);
					$("#rank").html(array[2]);
					$("#Avatar").attr("src",headurl+array[0]);

					/* 显示隐藏的等级与消息框 */
					$("#divmessage").show(400);
					$("#rank").show();
					
					/* 设置允许点击签到和用户设置按钮 */
					$("#Sign").removeAttr("disabled");
					$("#UserSettings").removeAttr("disabled");		

					var uprank = array[5]/array[6];
					console.log(uprank);
					$("#rankexppro").attr("style","width:"+uprank*100+"%");
					$("#rankexp").html(array[5]+"/"+array[6]);
					
				}else{
					$("#username").html("请登录账号");
					$("#UserSettings").hide();
					$("#Sign").hide();
					document.getElementById('Login').addEventListener('click', OnClickLogin);	
					$("#Login").show(200);
				}
			}else{
					$("#username").html("无法连接到服务器");
					$("#UserSettings").hide();
					$("#Sign").hide();
			}
		});
		/*
		GetWebInfo(function(array){
			if(array[3]<0||array[3]==""){
			}else{
				console.log(array);
				$("#NewNotice").html("新提醒("+array[2]+")")
			}
			$("#username").html(array[1]+"("+array[2]+")");
			getDynamic(function(imageUrl) {
				$("#Avatar").attr("src",imageUrl);
			});
		});
		*/
		$(document).ready(function (){
		chrome.tabs.getSelected(null, function (a) {
		if(a.url.match(/:\/\/(.[^\/]+)/)[1] == "www.mcbbs.net"){
			 $("#OpenBBS").hide() 
			 var num = parseInt(10*Math.random());
			 if(num>4){
				 $("#CYQ").html("一键CYQ Attack");
			 }else{
				$("#CYQ").html("一键DDOC");
			 }
		}else{
			$("#CYQ").hide()
			$("#UserSettings").hide() 
		}
		})
	});
});

function OnClickCYQ(){
	alert("啪，你死了，别说了。");
}

function OnMouseEnterExp(){
	$("#rankexpprodiv").animate({  
		marginTop:'5px',  
		opacity:'1'
	});  
}

function OnMouseLeaveExp(){
		$("#rankexpprodiv").animate({  
		marginTop:'-5px',  
		opacity:'0'
	});  
}

function OnClickLogin(){
		var url = bbsurl;
	chrome.tabs.create({
            url:bbsurl+"/member.php?mod=logging&action=login"
        });
}

function OnClickSign(e){
	getNugget();
}

function OnClickOpenBBS(e){
	var url = bbsurl;
	chrome.tabs.create({
            url:bbsurl
        });
}

function OnClickOpenMessage(e){
	var url = bbsurl;
	chrome.tabs.create({
            url:bbsurl+"/home.php?mod=space&do=notice"
        });
}

function OnClickSettings(e){
	var url = bbsurl;
	chrome.tabs.create({
            url:bbsurl+"/home.php?mod=spacecp"
        });
}

/*
传统读取Cookie和正则截取网页获取信息
function GetUID(callback){
	bkg_page.chrome.cookies.get({
		url: "http://www.mcbbs.net",
		name: "ZxYQ_2132_st_p"
	}, function (a) {
		if(a==null){
			_imageurl = (headurl+"3038") ,chrome.notifications.create({type: "basic", iconUrl: "icon.png", title: "MCBBS扩展插件", message: "登录失败，无法检测到cookies"});
		}else{
		 console.log("已获取到cookie，uid:"+(a.value.split("%"))[0]);
		 uid = (a.value.split("%"))[0];
		 callback(uid);
		}
	})
}

function GetWebInfo(callback){
	GetUID(function (getuid){
		var xmlHttpAnother = new XMLHttpRequest();
		var userHome = bbsurl+"/misc.php?mod=faq";
		xmlHttpAnother.open('GET', userHome);
		xmlHttpAnother.onload = function (e) {
			if (xmlHttpAnother.readyState === 4) {
				if (xmlHttpAnother.status === 200) {
					var UIDRegex = /<script\ type=\"[^"]*\">[^<、]*discuz_uid\ =\ '?(\d*)?/;
					var usernameRegex = /<a\ href=\"[^"]*\"\ [^>]* title=\"访问我的空间\">*(\S[^</]*)/;
					var RankRegex = /<a\ href=\"[^"]*\"\ id=\"g_upmine\"[^>]*>*(\S[^</]*)/;
					var promptRegex = /<a\ href=\"[^"]*\"\ id=\"myprompt\"[^>]*>[^(]*\(?(\d*)\)?/;
					var BBSUID = xmlHttpAnother.responseText.match(UIDRegex)[1];
					var BBSUsername = xmlHttpAnother.responseText.match(usernameRegex)[1];
					var BBSRank = xmlHttpAnother.responseText.match(RankRegex)[1];
					var BBSprompt = xmlHttpAnother.responseText.match(promptRegex)[1];				
					var arr = new Array(4);
					arr[0] = BBSUID;
					arr[1] = BBSUsername;
					arr[2] = BBSRank;
					arr[3] = BBSprompt;
					console.log(arr);
					callback(arr);
				}
			}
		}
		xmlHttpAnother.send(null);
	});
}
function GetMessage(){	
	console.log("开始获取新提醒 "+Date());
	GetWebInfo(function(array){
		if(array[2]<0||array[2]==""){
			
		}else{
			console.log(array);
			chrome.notifications.create({type: "basic", iconUrl: "icon.png", title: "MCBBS扩展插件",buttons: [{
					title: "点击查看"
			}], message: "你有"+array[2]+"条新提醒，请点击查看！"},function(id) {
        myNotificationID = id;
			});
		}
	});
}

function GetWebInfo(callback){
	GetUID(function (getuid){
		var xmlHttpAnother = new XMLHttpRequest();
		var userHome = bbsurl+"/misc.php?mod=faq";
		xmlHttpAnother.open('GET', userHome);
		xmlHttpAnother.onload = function (e) {
			if (xmlHttpAnother.readyState === 4) {
				if (xmlHttpAnother.status === 200) {
					var UIDRegex = /<script\ type=\"[^"]*\">[^<、]*discuz_uid\ =\ '?(\d*)?/;
					var usernameRegex = /<a\ href=\"[^"]*\"\ [^>]* title=\"访问我的空间\">*(\S[^</]*)/;
					var RankRegex = /<a\ href=\"[^"]*\"\ id=\"g_upmine\"[^>]*>*(\S[^</]*)/;
					var promptRegex = /<a\ href=\"[^"]*\"\ id=\"myprompt\"[^>]*>[^(]*\(?(\d*)\)?/;
					var BBSUID = xmlHttpAnother.responseText.match(UIDRegex)[1];
					var BBSUsername = xmlHttpAnother.responseText.match(usernameRegex)[1];
					var BBSRank = xmlHttpAnother.responseText.match(RankRegex)[1];
					var BBSprompt = xmlHttpAnother.responseText.match(promptRegex)[1];				
					var arr = new Array(4);
					arr[0] = BBSUID;
					arr[1] = BBSUsername;
					arr[2] = BBSRank;
					arr[3] = BBSprompt;
					console.log(arr);
					callback(arr);
				}
			}
		}
		xmlHttpAnother.send(null);
	});
}

function getDynamic(callback) {
	
	GetUID(function(getuid){
		var _imageurl = "";
		_imageurl = headurl+getuid;
		console.log(_imageurl);
		callback(_imageurl);
	})
}
*/

function GetMessage(){	
	console.log("开始获取新提醒 "+Date());
	GetUserInfo(function(array){
		if(array[3]<=0||array[3]==null||array[3]==undefined){
		}else{
			console.log(array);
			chrome.notifications.create({type: "basic", iconUrl: "icon.png", title: "MCBBS扩展插件",buttons: [{
					title: "点击查看"
			}], message: "你有"+array[3]+"条新提醒，请点击查看！"},function(id) {
        myNotificationID = id;
			});
		}
	});
}

function GetUserInfo(callback){
	var xmlHttpAnother = new XMLHttpRequest();
	var userHome = bbsurl+"/api/mobile/index.php?module=profile";
	xmlHttpAnother.open('GET', userHome);
	xmlHttpAnother.onload = function (e) {
		if (xmlHttpAnother.readyState === 4) {
			if (xmlHttpAnother.status === 200) {
				obj = JSON.parse(xmlHttpAnother.responseText);
				var arr = new Array(7);
				arr[0] = obj.Variables.member_uid;
				if(obj.Variables.member_uid!=0){
					arr[1] = obj.Variables.member_username;
					arr[2] = obj.Variables.space.group.grouptitle;
					arr[3] = obj.Variables.space.newprompt;
					arr[4] = obj.Variables.space.newpm;
					arr[5] = obj.Variables.space.credits;
					obj.Variables.space.group.creditslower!=undefined ? arr[6] = obj.Variables.space.group.creditslower : arr[6] = arr[5];
					console.log(arr);
				}
				callback(arr);
			}else{
				console.log("无法连接到服务器");
				callback(null);
			}
		}
	}
	xmlHttpAnother.send(null);
}

var myNotificationID = null;


function getNugget() {
	console.log("开始自动签到");
	var xmlHttp = new XMLHttpRequest(), xmlHttpAnother = new XMLHttpRequest();
	xmlHttp.open('GET', 'http://www.mcbbs.net/home.php?mod=task&do=apply&id=10', true);
	xmlHttp.onload = function (e) {
		if (xmlHttp.readyState === 4) {
			if (xmlHttp.status === 200) {
				xmlHttpAnother.open('GET', 'http://www.mcbbs.net/home.php?mod=task&do=draw&id=10', true);
				xmlHttpAnother.onload = function (e) {
					if (xmlHttpAnother.readyState === 4) {
						if (xmlHttpAnother.status === 200) {
							var regex = /<div\ id=\"messagetext\"\ class=\"alert_\w*">\s*<p>([^<]*)</;
							var result = (regex.exec(xmlHttp.responseText) || [])[1];
							
							var options = {
							type: "basic",
							title: "每日金粒领取 - "+new Date().toLocaleDateString(),
							message: result
							}
							GetUserInfo(function(array) {
								if(array!=null){
									var xhr = new XMLHttpRequest();
									xhr.open("GET", headurl+array[0]+"&size=big");
									xhr.setRequestHeader("Access-Control-Allow-Origin", "http://attachment.mcbbs.net");
									xhr.responseType = "blob";
									xhr.onload = function(){
										var blob = this.response;
										options.iconUrl = window.URL.createObjectURL(blob);
										chrome.notifications.create(options);
									};
									xhr.send(null);
								}
							});
						} else {
							chrome.notifications.create({type: "basic", iconUrl: "icon.png", title: "获取金粒失败", message: "网络出错了？"});
						}
					}
				}
				xmlHttpAnother.send(null);
			} else {
				chrome.notifications.create({type: "basic", iconUrl: "icon.png", title: "获取金粒失败", message: "网络出错了？"});
			}
		}
	}
	xmlHttp.send(null);
    
}
