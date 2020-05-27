/**
 * Created by hanji on 2018/8/9.
 */
/**
 * 替换微信的域名信息
 * @param content
 */
function replaceWechatNames(content){


}

/**
 * 图片路径进行格式化
 * @param prefix
 * @param url
 * @param type
 */
function showPicture(url,type){
    // PICTURE_SERVER_PATH = "https://mongo.qicaidonghu.cn/pic/";
    // return !!url?(url.startsWith("http")?url:PICTURE_SERVER_PATH+url):"";
    if(url == undefined || url == null)
        return '';
    type = type || 0;
    if(type == 0){
        return !!url?(url.startsWith("http")?url:PICTURE_SERVER_PATH+url):"";
    }else if(type == 480) {
        return url.startsWith("http") ? url : PICTURE_SERVER_PATH + url.split('.')[0] + "Zoom." + url.split('.')[1];
    }
}

String.prototype.endWith=function(endStr){
    var d=this.length-endStr.length;

    return (d>=0&&this.lastIndexOf(endStr)==d)

}

function refresh() {
    window.location.reload(true);
}

//选择图片
function imageChoise() {
    jQuery(".ac-4").click();
}

/**
 * 统一路径跳转
 * @param url
 */
function routerPage(url){
    var sear=new RegExp('=');
    if(sear.test(url)){
        url+='&street='+commStreetName;
    }else{
        url+='?street='+commStreetName;
    }
    window.location.href="/server/rest/wechat/"+url;
}

/**
 * 统一路径跳转
 * @param url
 */
function routerPageReplace(url){
    var sear=new RegExp('=');
    if(sear.test(url)){
        url+='&street='+commStreetName;
    }else{
        url+='?street='+commStreetName;
    }
    window.location.replace("/server/rest/wechat/"+url);
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


//统一网络请求封装
function httpData(url,success,error,type,data,beforeSend,complete){
    data = data||{};
    data.street = commStreetName;
    jQuery.ajax({
        url:'/server/rest/wechat/'+url,
        type:type||'POST',
        data:data,
        success:function(result){
            success(result);
        },error:function(result2){
            if(result2.status == 401){

                if(result2.responseText == 'certificateOne'){
                    app.dialog.confirm('需要验证身份才能进入下一步，是否认证?', function () {
                        routerPage('wechatRouter/pages/certification/certificateOne?src=' + encodeURIComponent(window.location.href));
                    });
                }
                if(result2.responseText == 'certificateTwo'){
                    app.dialog.confirm('需要验证身份才能进入下一步，是否认证?', function () {
                        routerPage('wechatRouter/pages/certification/certificateTwo?src=' + encodeURIComponent(window.location.href));
                    });
                }
                if(result2.responseText == 'certificateThree'){
                    app.dialog.confirm('需要验证身份才能进入下一步，是否认证?', function () {
                        routerPage('wechatRouter/pages/certification/certificateThree?src=' + encodeURIComponent(window.location.href));
                    });
                }
                //需要一级认证
                if(result2.responseText == 'verified'){
                    app.dialog.confirm('需要验证身份才能进入下一步，是否认证?', function () {
                        routerPage('wechatRouter/pages/certification/certificateOne?src=' + encodeURIComponent(window.location.href));
                    });
                }
                //需要一级信息
                if(result2.responseText == 'volunteer'){
                    //志愿者认证
                    app.dialog.confirm('您还不是志愿者，是否现在认证?', function () {
                        routerPage('wechatRouter/pages/needCertification/volunteer?src='+encodeURIComponent(window.location.href));
                    });
                }
                //需要认证信息
                if(result2.responseText == 'party'){
                    //志愿者认证
                    app.dialog.confirm('是否现在认证党员?', function () {
                        routerPage('wechatRouter/pages/party/index');
                    });
                }
                if(result2.responseText == 'tenant'){
                    //商家认证
                    app.dialog.confirm('您还没有认证商家，是否现在认证?', function () {
                        routerPage('wechatRouter/pages/needCertification/volunteer?src='+encodeURIComponent(window.location.href));
                    });
                }
                if(result2.responseText == 'owner'){
                    //业主认证
                    app.dialog.confirm('您还没有认证居民，是否现在认证?', function () {
                        routerPage('wechatRouter/pages/needCertification/owner?src='+encodeURIComponent(window.location.href));
                    });
                }
                if(result2.responseText == 'property'){
                    //物业公司认证
                    app.dialog.confirm('您还没有认证物业公司，是否现在认证?', function () {
                        routerPage('wechatRouter/pages/needCertification/propertyNeedC?src='+encodeURIComponent(window.location.href));
                    });
                }
                if(result2.responseText == 'staff'){
                    //员工认证
                    app.dialog.confirm('您还没有认证物业员工，是否现在认证?', function () {
                        routerPage('wechatRouter/pages/needCertification/staff?src='+encodeURIComponent(window.location.href));
                    });
                }
            }else {
                error(result2.responseText, result2.status);
            }
        },beforeSend:function(){
            if(undefined != beforeSend)
                beforeSend();
        },complete:function(){
            if(undefined != complete)
                complete();
        }
    });
}

//通用图片上传
function uploadImage(url,data,success,error,before,complete){
    if(url == '')
        url = "wechatComm/upload";
    data.append('street',commStreetName);
    $.ajax({
        type:'POST',
        url:'/server/rest/wechat/'+url,
        cache:false,
        data: data,
        dataType:'JSON',
        processData: false,
        contentType: false,
        beforeSend:function(){
            if(undefined != before)
                before();
        },success:function(result){
            success(result);
        },error:function(result2){
            error(result2.responseText, result2.status);
        },complete:function(){
            if(undefined != complete)
                complete();
        }
    });
}

//微信接口
function getJsApiTiket(street){
    setTimeout(function(){
        var url = window.location.href;
        httpData('wechatComm/createJsApiSignature',function success(result){
            wxConfig(JSON.parse(result));
        },function error(){

        },'GET',{street:street,url:url});
    },10);
}
var distance,loadFinished = false;
function wxConfig(data,titles,des,image){
    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appId, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature,// 必填，签名
        jsApiList: ['onMenuShareAppMessage','onMenuShareTimeline','getLocation','openLocation','scanQRCode'] // 必填，需要使用的JS接口列表
    });

    wx.ready(function(){
        loadFinished = true;
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        //分享给朋友

        var title = titles || $(".wx_title").html() || $("title").html();
        var desc = des || $(".wx_des").html() || '';
        var url = $(".share_url").val() || window.location.href;
        desc = desc.replace(/<[^>]*>|/g,"");
        desc = desc.replace(/&nbsp;/g,"");
        var imageArr = new Array();
        if(image == null || image == undefined || image == ''){
            $("img").each(function() {
                var src = $(this).attr("src");
                imageArr.push(src);
            });
            if(imageArr.length > 0)
                image = showPicture(imageArr[0]);
        }

        wx.onMenuShareAppMessage({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: image, // 分享图标
            type: 'link', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
            }
        });
        //分享到朋友圈
        wx.onMenuShareTimeline({
            title: title, // 分享标题
            link:url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: image, // 分享图标
            success: function () {
                // 用户点击了分享后执行的回调函数
            }
        });
    });
}
/**
 * 打开微信扫码
 * @param success
 */
function scanQRCode(success){
    wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
            var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            success(result);
        }
    });
}
/**
 * 打开地图
 * @param name
 * @param address
 */
function openLocation(latitude,longtitude,name,address){
    wx.openLocation({
        latitude: latitude, // 纬度，浮点数，范围为90 ~ -90
        longitude: longtitude, // 经度，浮点数，范围为180 ~ -180。
        name: name, // 位置名
        address: address, // 地址详情说明
        scale: 12 // 地图缩放级别,整形值,范围从1~28。默认为最大
    });
}

/**
 * 获取地图的经纬度
 */

function getDistanceLonlat(success,error){
    if(loadFinished) {
        wx.getLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {
                lat2 = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                lng2 = res.longitude; // 经度，浮点数，范围为180 ~ -180。

                success(lng2, lat2);
            }
        });
    }else{
        error();
    }
}

/**
 * 计算两点的距离
 * @param lng1
 * @param lat1
 */
function distanceByLnglat(lat1,lng1) {
    if(loadFinished) {
        wx.getLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {
                lat2 = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                lng2 = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                var radLat1 = Rad(lat1);
                var radLat2 = Rad(lat2);
                var a = radLat1 - radLat2;
                var b = Rad(lng1) - Rad(lng2);
                var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
                s = s * 6378137.0; // 取WGS84标准参考椭球中的地球长半径(单位:m)
                distance = Math.round(s * 10000) / 10000;

                distance = new Number(Math.round(distance / 1000)).toFixed(1);
            }
        });
    }else{
        setTimeout(function () {
            distanceByLnglat(lat1,lng1);
        },1000);
    }
}
function Rad(d) {
    return d * Math.PI / 180.0;
}


//校验手机号
function checkPhone(phone,flag){
    phone = phone || '';
    flag = flag || 1;
    if(flag == 1 && phone.indexOf('****') != -1)
        return true;
    var pattern = /^1[0-9]\d{9}$/;
    return pattern.test(phone);
}

//身份证校验
var Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ];    // 加权因子
var ValideCode = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ];            // 身份证验证位值.10代表X
function checkIdCard(idCard,flag) {
    idCard = idCard || '';
    flag = flag || 1;
    if(flag == 1 && idCard.indexOf("****") != -1){
        return true;
    }
    idCard = trim(idCard.replace(/ /g, ""));               //去掉字符串头尾空格
    if (idCard.length == 15) {
        return isValidityBrithBy15IdCard(idCard);       //进行15位身份证的验证
    } else if (idCard.length == 18) {
        var a_idCard = idCard.split("");                // 得到身份证数组
        if(isValidityBrithBy18IdCard(idCard)&&isTrueValidateCodeBy18IdCard(a_idCard)){   //进行18位身份证的基本验证和第18位的验证
            return true;
        }else {
            return false;
        }
    } else {
        return false;
    }
}
/**
 * 判断身份证号码为18位时最后的验证位是否正确
 * @param a_idCard 身份证号码数组
 * @return
 */
function isTrueValidateCodeBy18IdCard(a_idCard) {
    var sum = 0;                             // 声明加权求和变量
    if (a_idCard[17].toLowerCase() == 'x') {
        a_idCard[17] = 10;                    // 将最后位为x的验证码替换为10方便后续操作
    }
    for ( var i = 0; i < 17; i++) {
        sum += Wi[i] * a_idCard[i];            // 加权求和
    }
    valCodePosition = sum % 11;                // 得到验证码所位置
    if (a_idCard[17] == ValideCode[valCodePosition]) {
        return true;
    } else {
        return false;
    }
}
/**
 * 验证18位数身份证号码中的生日是否是有效生日
 * @param idCard 18位书身份证字符串
 * @return
 */
function isValidityBrithBy18IdCard(idCard18){
    var year =  idCard18.substring(6,10);
    var month = idCard18.substring(10,12);
    var day = idCard18.substring(12,14);
    var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));
    // 这里用getFullYear()获取年份，避免千年虫问题
    if(temp_date.getFullYear()!=parseFloat(year)
        ||temp_date.getMonth()!=parseFloat(month)-1
        ||temp_date.getDate()!=parseFloat(day)){
        return false;
    }else{
        return true;
    }
}
/**
 * 验证15位数身份证号码中的生日是否是有效生日
 * @param idCard15 15位书身份证字符串
 * @return
 */
function isValidityBrithBy15IdCard(idCard15){
    var year =  idCard15.substring(6,8);
    var month = idCard15.substring(8,10);
    var day = idCard15.substring(10,12);
    var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));
    // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法
    if(temp_date.getYear()!=parseFloat(year)
        ||temp_date.getMonth()!=parseFloat(month)-1
        ||temp_date.getDate()!=parseFloat(day)){
        return false;
    }else{
        return true;
    }
}
//去掉字符串头尾空格
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

var minute = 60 * 1000;// 1分钟 
var hour = 60 * minute;// 1小时 
var day = 24 * hour;// 1天 
var month = 31 * day;// 月 
var year = 12 * month;// 年 
/**
 * 返回文字描述的日期
 *
 * @param date
 * @return
 */
function getTimeFormatText(time) {

    if (time == null) {
        return '';
    }
    var diff = new Date().getTime() - Date.parse(new Date(time.replace(/-/g, "/")));
    var r = 0;
    if (diff > year) {
        r = parseInt(diff / year);
        return time;
    }
    if (diff > month) {
        r = parseInt(diff / month);
        return r+"月前";
    }
    if (diff > day) {
        r = parseInt(diff / day);
        return r + "天前";
    }
    if (diff > hour) {
        r = parseInt(diff / hour);
        return r + "小时前";
    }
    if (diff > minute) {
        r = parseInt(diff / minute);
        return r + "分钟前";
    }
    return "刚刚";
}