CheckUpdate();
chrome.tabs.onActivated.addListener(function (e) {
	var time = Math.floor(Date.now() / 10000000);
    if (time != chrome.storage.time) {
        chrome.tabs.get(e.tabId, getNugget);
        chrome.storage.time = time;
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
    periodInMinutes: 3
});
GetMessage();