CheckUpdate();

if((getOption("HotThreadPush")==="false"?false:true)==true){
    console.log("推送热门贴");
    GetHotThread();
    GetHotThread();
}
chrome.tabs.onActivated.addListener(function (e) {
	var time = Math.floor(Date.now() / 10000000);
    if (time != localStorage.Time) {
        chrome.tabs.get(e.tabId, getNugget);
        localStorage.Time = time;
        if((getOption("HotThreadPush")==="false"?false:true)==true){ GetHotThread(); }
    }
});
chrome.alarms.onAlarm.addListener(function (a) {
    switch (a.name) {
    case "GetMessage":
        return GetMessage(), !0;
    default:
        return !1
    }
});

chrome.alarms.create("GetMessage", {
    periodInMinutes: 30
});
GetMessage();