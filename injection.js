// filter urls in images
[].forEach.call(document.getElementsByTagName('img'), function (img) {
    img.src = img.src.replace(/http:\/\/www\.mcbbs\.net/, location.origin)
});
// filter urls in links
[].forEach.call(document.getElementsByTagName('a'), function (a) {
    a.href = a.href.replace(/http:\/\/www\.mcbbs\.net/, location.origin)
});
