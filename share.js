function shareToWeibo(e){
    chrome.tabs.getSelected(function(tabs) {
        console.log("当前的标签是:",tabs);
        chrome.tabs.create({
            url: "http://service.weibo.com/share/share.php?appkey=429409060&pic=http%3a%2f%2fwww.mcbbs.net%2ftemplate%2fmcbbs%2fimage%2flogo_sc.png&title="
            +encodeURIComponent("#Minecraft# #我的世界# "+(tabs.title.replace(/【新提醒】/g,"")).replace("- Minecraft(我的世界)中文论坛 -","").replace("- Minecraft(我的世界)中文论坛 -","")+" （来源：@我的世界中文社区 | 使用MCBBS助手分享）")
            +"&url="+encodeURIComponent(tabs.url)
        })
    });

}

function shareToQzone(e){
    chrome.tabs.getSelected(function(tabs) {
        chrome.tabs.create({
            url:"https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?pics=http%3a%2f%2fwww.mcbbs.net%2ftemplate%2fmcbbs%2fimage%2flogo_sc.png&title="
            +encodeURIComponent("【我的世界中文论坛】"+(tabs.title.replace(/【新提醒】/g,"")).replace("- Minecraft(我的世界)中文论坛 -","").replace("- Minecraft(我的世界)中文论坛 -",""))
            +"&url="+encodeURIComponent(tabs.url)
        })
    }); 
}