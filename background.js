CheckUpdate();
chrome.tabs.onActivated.addListener(function (e) {
	var time = Math.floor(Date.now() / 10000000);
    if (time != localStorage.time) {
        chrome.tabs.get(e.tabId, getNugget);
        localStorage.time = time;
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
    periodInMinutes: 10
});
GetMessage();