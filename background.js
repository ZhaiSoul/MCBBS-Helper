CheckUpdate();

if((getOption("HotThreadPush")==="false"?false:true)==true){
    console.log("推送热门贴");
    GetHotThread();
}
chrome.tabs.onActivated.addListener(function (e) {
	var time = Math.floor(Date.now() / 10000000);
    if (time != localStorage.Time) {
        chrome.tabs.get(e.tabId, getNugget);
        localStorage.Time = time;
        GetHotThread();
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
<<<<<<< HEAD
    periodInMinutes: 30
=======
    periodInMinutes: 10
>>>>>>> a00ae1deb644bb0515eed00204355cd312cae069
});
GetMessage();