function SaveUser(){
    
    var newJson         = {};
    newJson.name        = encodeURI(mcbbs.userInfo.username);
    newJson.auth        = mcbbs.cookies.auth;
    newJson.saltkey     = mcbbs.cookies.saltkey;
    newJson.cookiepre   = mcbbs.cookies.cookiepre;
    

    var allJson = GetAllUser();
    var isExisted = false;
    for(var json of allJson){
        if(json["name"]==encodeURI(mcbbs.userInfo.username)){
            isExisted = true;
            break;
        }
    }
    if (!isExisted){
        console.log("正在保存 "+mcbbs.userInfo.username+" 的Cookies");
        allJson.push(newJson);
        setOption("Cookies",JSON.stringify(allJson));
    }

    newJson = null;
    allJson = null;
}

function ChangeUser(username){
    console.log("正在切换至 "+username+" 账号");
    var allJson = GetAllUser();
        for(var json of allJson){
            if(json["name"] ==encodeURI(username)){
                chrome.cookies.set(
                    { url:"http://www.mcbbs.net", name: json["cookiepre"]+"auth", value: auth, 
                    httpOnly: true, path: '/', 
                    expirationDate: new Date().getTime() / 1000 + 3000000},
                    function(cookie){ }
                );
                chrome.cookies.set(
                    { url:"http://www.mcbbs.net", name:json["cookiepre"]+"saltkey", value:saltkey, 
                    httpOnly:true, path: '/', 
                    expirationDate: new Date().getTime() / 1000 + 3000000},
                    function(cookie){ }
                );
                break;
            }
        }
        mcbbs.syncUserInfo();
    }

function DeleteUser(username){
    var allJson = GetAllUser();
    for(var json of allJson){
        if(json["name"] ==encodeURI(username)){
            console.log("正在清理 "+username+" 账号的登录信息");
            allJson.remove(json);
            break;
        }
    }
}

function GetAllUser(){
    return JSON.parse(getOption("Cookies"));
}