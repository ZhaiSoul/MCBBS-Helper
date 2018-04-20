function getOption(a) {
    return null===localStorage.getItem(a)
    &&localStorage.setItem(a,defaultOptions[a]),
    localStorage.getItem(a)
}

function setOption(a,b,c) {
	return localStorage.setItem(a,b),c&&updateAll(),!0
}

defaultOptions = {
    MessageRefreshTime : "3",
    HotThreadPush : true,
    NoticePush : true,
    Version : "0.0.0",
    Cookies : "[]"
}