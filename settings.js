document.addEventListener('DOMContentLoaded', function () {
    LoadUserInfo();
    LoadSettings();
    $("input[name='checkboxSetting']").click(ChangeSettings)
});

function LoadSettings(){
    console.log("载入设置中");
    $("#cb_NoticePush").prop("checked",getOption("NoticePush")==="false"?false:true);
    $("#cb_HotThreadPush").prop("checked",getOption("HotThreadPush")==="false"?false:true);
}

function ChangeSettings(e){
    var id = e.currentTarget.id.toString();
    var value = $("#"+e.currentTarget.id).prop("checked");
    console.log("修改"+id+"的值为"+value);
    //console.log(id.replace("cb_",""));
    //console.log(value);
    setOption(id.replace("cb_",""),value)
}


function LoadUserInfo(){
    mcbbs.syncUserInfo(function () {
        console.log(mcbbs.userInfo);
        console.log(mcbbs.userInfo.grouptitle);
    });
}