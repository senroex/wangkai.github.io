function faceDetectionJquery(options,value, callback) {
    $(value).faceDetection({
        complete: function(faces) {
            if (faces === false) {
                return console.log('jquery.facedetection returned false');
            }
            options.boost = Array.prototype.slice
                .call(faces, 0)
                .map(function(face) {
                    return {
                        x: face.x,
                        y: face.y,
                        width: face.width,
                        height: face.height,
                        weight: 1.0
                    };
                });

            callback();
        }
    });
}

var vue = new Vue({
    el: '#app',
    data() {
        return {
            url:{
                infos:'mine/infos',
                count:'mine/index',
                behavior:'behavior/count/1,10',
                qrcode:'wechatComm/getQRCode',
                checkcode:'wechatComm/checkQRCode/',
                checkScanCode:'activity/getActivityByCode',
                activityByCodeConfirm:'activity/activityByCodeConfirm',
                getCertificateStep:'wechatComm/getCertificateStep',

                sass:'vote/info'
            },
            qrcodeStr:'',
            qrcode:null,
            user: {
                "wechat": {
                    "sysOrgCode": "A05A01A01A07",
                    "tdcommunityId": null,
                    "headImg": "http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIEqgfgVhYADicbEhiabJGjflHUD7aTENgf2ibgTQx4rQDBIXiaBMMAKkWwmaZV6Vic9cY0RTsrW2Wp6Yw/132",
                    "tcbaseuserId": "ff8080817027c0bd01702e47bbb12c35",
                    "createBy": null,
                    "createDate": "2020-02-10 16:46:35",
                    "nickName": "Joe",
                    "bpmStatus": null,
                    "wechatOpenId": "ovTOFwYFj9jJwqjMBTEwgdBGBMNA",
                    "wechatUnionId": null,
                    "sysCompanyCode": "A05A01A01A07",
                    "createName": null,
                    "updateName": null,
                    "updateBy": null,
                    "updateDate": null,
                    "inDate": "2020-02-10 16:46:35",
                    "partyId": null,
                    "id": "ff8080817027c0bd01702e4760662bde"
                },
                "baseuser": {
                    "realname": "王凯",
                    "sysOrgCode": "A05A01A01",
                    "idcard": "",
                    "mobile": "18518513293",
                    "isRent": null,
                    "createBy": null,
                    "headImage": "http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIEqgfgVhYADicbEhiabJGjflHUD7aTENgf2ibgTQx4rQDBIXiaBMMAKkWwmaZV6Vic9cY0RTsrW2Wp6Yw/132",
                    "houseno": null,
                    "createDate": "2020-02-10 16:46:58",
                    "nickName": "Joe",
                    "bpmStatus": "1",
                    "sysCompanyCode": null,
                    "createName": null,
                    "updateName": null,
                    "updateBy": null,
                    "updateDate": null,
                    "manager": null,
                    "password": null,
                    "address": null,
                    "id": "ff8080817027c0bd01702e47bbb12c35"
                }
            },
            count:{
                esBind:{}
            },
            behavior:{
                "praiseCount": 0,
                "reviewCount": 0,
                "browseCount": 0,
                "collectCount": 0,
                "focusCount": 0
            },
            showType:0,
            resultMap:{
                type:0,
                activity:{},
                signup:0
            },
            scanCode:'',
            certificateLevel:-1,

            sass:{"number":"07693309","comm":"南湖东园北","code":"0","orgCode":"A05A01A01","street":"东湖街道","daily":"dailyff8080816fff9dc1016fffaa97be00","idcard":"37028419931020431x","village":"南湖东园一区","createDate":"2020年02月10日","backTime":""},
            images:'https://www.qicaidonghu.cn/server/plug-in/mobile/images/vote/green.png',
            fontColor:'black',
            cardSysOrgCode:'',
            zhang:'',

        }
    },
    methods: {
        //重填问卷
        reWriteCard(){
            app.dialog.confirm('是否确定重填自排查表，此操作会删除您之前填写的内容，确认继续？', function () {
                httpData('vote/delMineWrite',function s(result){
                    app.dialog.close();
                    routerPage('wechatRouter/pages/vote/survey?id='+result);
                },function e(result) {
                    alert('操作失败，请稍后重试');
                },'POST',{},
                function b() {
                    app.dialog.progress();
                },function c() {
                    app.dialog.close();
                });
            });
        },
        //填写体温
        gotoVote(){
            if(!!this.sass.daily){
                routerPage('wechatRouter/pages/vote/survey?id='+this.sass.daily);
            }
        },
        showQRCode(){
            if(this.user.welfare != undefined && this.user.welfare != null){
                if(this.qrcodeStr == ''){
                    this.initQRCode();
                }else{
                    this.checkQRCodes();
                }
                this.showType = 1;
            }else{
                app.dialog.confirm('您还不是志愿者，是否现在认证?', function () {
                    routerPage('wechatRouter/pages/needCertification/volunteer?src='+encodeURIComponent(window.location.href));
                });
            }ActivityApiController
        },
        gotoCertificate(type){
            if(type == 1)
                routerPage('wechatRouter/pages/certification/certificateOne?src='+encodeURIComponent(window.location.href));
            else if(type == 2)
                routerPage('wechatRouter/pages/certification/certificateTwo?src='+encodeURIComponent(window.location.href));
            else if(type == 3)
                routerPage('wechatRouter/pages/certification/certificateThree?src='+encodeURIComponent(window.location.href));
        },
        //定时去获取扫码状态
        checkQRCodes(){
            var _this = this;
            if(this.showType === 1 && this.qrcodeStr != '') {
                httpData(_this.url.checkcode + _this.qrcodeStr, function s(result) {
                    if(result == 2){
                        _this.showToast('消费成功');
                        _this.showType = 0;
                        _this.qrcodeStr = '';
                    }else{
                        setTimeout(function(){
                            _this.checkQRCodes();
                        },2000);
                    }
                }, function e() {
                }, 'GET');
            }
        },
        initQRCode(){
            var _this = this;
            httpData(this.url.qrcode,function s(result) {
                if(_this.qrcode == null) {
                    _this.qrcode = new QRCode(document.getElementById("qrcode"), {
                        width: 200,
                        height: 200
                    });
                }
                _this.qrcode.makeCode(result);

                _this.qrcodeStr = result;

                _this.checkQRCodes();
            },function e() {

            },'GET');

            setTimeout(function(){
                _this.initQRCode();
            },240000);
        },
        //获取信息
        getInfos(){
            var _this = this;
            httpData(this.url.infos,function s(d){
                _this.user = JSON.parse(d);

                if(!!_this.user.baseuser){
                    if(!!_this.user.baseuser.mobile)
                        _this.user.baseuser.mobile = _this.user.baseuser.mobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2");

                    if(!!_this.user.baseuser.idcard){
                        if(_this.user.baseuser.idcard.length == 15){
                            _this.user.baseuser.idcard = _this.user.baseuser.idcard.replace(/^(\d{6})\d{6}(\d+)/,"$1******$2");
                        }
                        if(_this.user.baseuser.idcard.length == 18){
                            _this.user.baseuser.idcard = _this.user.baseuser.idcard.replace(/^(\d{6})\d{8}(\d+)/,"$1********$2");
                        }
                    }
                }
            },function e(){
            },'GET',{},function b() {
            },function c() {
            });
        },
        getCount(){
            var _this = this;
            httpData(this.url.count,function s(d){
                _this.count = JSON.parse(d);
            },function e(){
            },'GET',{},function b() {
            },function c() {
            });
        },
        getBehavior(){
            var _this = this;
            httpData(this.url.behavior,function s(d){
                _this.behavior = JSON.parse(d);
            },function e(){
            },'GET',{},function b() {
            },function c() {
            });
        },
        gotoDetail(type){
            if(type === '1'){
                //投票调查
            }else if(type === '2'){
                //一键反馈
                routerPage('wechatRouter/pages/takePicture/index');
            }else if(type === '3'){
                //办事预约
                routerPage('wechatRouter/pages/mine/order');
            }else if(type === '4'){
                //物业预约服务
                routerPage('wechatRouter/pages/estate/ownerAppoint');
            }else if(type === '5'){
                //物业问题反馈
                routerPage('wechatRouter/pages/estate/ownerfeedback');
            }else if(type === '6'){
                //去认证
                routerPage('wechatRouter/pages/certification/index?src='+encodeURIComponent(window.location.href));
            }else if(type === '7'){
                //我的物业解绑后重新绑定
                routerPage('wechatRouter/pages/estate/ownerProperty');
            }else if(type === '8'){
                //我参加的活动
                routerPage('wechatRouter/pages/mine/activity?type=1');
            }else if(type === '9'){
                //我享受的服务
                routerPage('wechatRouter/pages/mine/activity?type=2');
            }else if(type === '10'){
                //我的阅读历史
                routerPage('wechatRouter/pages/mine/article?type=1');
            }else if(type === '11'){
                //我的点赞历史
                routerPage('wechatRouter/pages/mine/article?type=2');
            }else if(type === '12'){
                //我的评论历史
                routerPage('wechatRouter/pages/mine/article?type=3');
            }else if(type === '13'){
                //我的收藏历史
                routerPage('wechatRouter/pages/mine/article?type=4');
            }else if(type === '14'){
                //我的关注历史
                routerPage('wechatRouter/pages/mine/article?type=5');
            }else if(type === '20'){
                //我的建言献策
                routerPage('wechatRouter/pages/party/partySuggestMine');
            }else if(type === '21'){
                //我的组织生活
                routerPage('wechatRouter/pages/party/partyActivityMine');
            }
        },
        gotoList(type){
            routerPage('wechatRouter/pages/mine/score?type='+type);
        },
        //扫码
        scanQRCode(){
            var _this = this;
            scanQRCode(function (codes) {
                var code = _this.getUrlParams(codes,'code');
                _this.scanCode = code;
                httpData(_this.url.checkScanCode,function s(result) {
                    result = JSON.parse(result);

                    if(result.type == 1){
                        if(!!result.activity.posterUrl)
                            result.activity.posterUrl = showPicture(result.activity.posterUrl,480);
                    }else if(result.type == 2){
                        if(!!result.activity.picture)
                            result.activity.picture = showPicture(result.activity.picture,480);
                    }
                    _this.resultMap = result;
                    _this.scanPopup.open();
                },function e(result) {
                    alert(result);
                },'POST',{code:encodeURIComponent(code)},function b() {
                });

            });
        },
        getUrlParams(codes,name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); //定义正则表达式
            var r = codes.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        choiseService(id){
            var _this = this;
            var message = '';
            if(this.resultMap.signup === '0'){
                if(this.resultMap.activity.leaveMessage === '1' || this.resultMap.activity.leaveMessage === '2') {
                    var messageTips = _this.resultMap.activity.messageTips || '请输入您的留言';
                    app.dialog.prompt('<span style="font-size: 14px;color: #3396fb">  <i class="zmdi zmdi-info " style="font-size: 20px;color: #3396fb;vertical-align: middle"></i> ' + messageTips + '</span>', function (text) {
                        message = text;
                        //强制留言
                        if (_this.resultMap.activity.leaveMessage == '2' && message == '') {
                            _this.showToast(messageTips);
                            return;
                        }
                        _this.submitActivitySignUp(message);
                    }, function () {
                    })
                }else {
                    _this.submitActivitySignUp(message);
                }
            }else{
                _this.submitActivitySignUp(message);
            }
        },
        submitActivitySignUp(message){
            var _this = this,message = message || '';
            httpData(_this.url.activityByCodeConfirm,function s(result) {
                _this.showToast('签到成功');
                _this.scanPopup.close();
            },function e(result) {
                alert(result);
            },'POST',{code:encodeURIComponent(_this.scanCode),message:message},function b() {
            });
        },
        //获取认证等级
        getCertificateStep(){
            var _this = this;
            httpData(_this.url.getCertificateStep,function s(result) {
                _this.certificateLevel = result;
            },function e(result) {

            },'GET');
        },
        //获取卡片
        getSass(){
            var _this = this;
            httpData(this.url.sass,function s(result){
                result = JSON.parse(result);
                if(!!result.code){
                    _this.sass = result;
                    var param = _this.sass.card;
                    if(!!param && !!param.sysOrgCode){
                        _this.cardSysOrgCode = param.sysOrgCode;
                    }
                    var zhang = _this.sass.zhang;
                    if(!!zhang && !!zhang.param1){
                        _this.zhang = zhang.param1;
                    }
                    if(_this.sass.code == '0'){
                        //蓝色
                        if(!!param && !!param.param1){
                            _this.images = param.param1;
                        }else{
                            _this.images = "/server/plug-in/mobile/images/vote/green.png";
                        }
                    }else if(_this.sass.code == '1'){
                        //红色
                        if(!!param && !!param.param2){
                            _this.images = param.param2;
                        }else {
                            _this.images = "/server/plug-in/mobile/images/vote/red.png";
                        }
                    }else if(_this.sass.code == '2'){
                        if(!!param && !!param.param3){
                            _this.images = param.param3;
                        }else {
                            //黄色
                            _this.images = "/server/plug-in/mobile/images/vote/yellow.png";
                            if(_this.sass.orgCode == 'A05A01A01' && !!_this.sass.brown && _this.sass.brown == '1'){
                                _this.images = "/server/plug-in/mobile/images/vote/brown.png";
                            }else if(_this.sass.orgCode == 'A05A01A01' && !!_this.sass.brown && _this.sass.brown == '2'){
                                _this.images = "/server/plug-in/mobile/images/vote/black.jpg";
                                _this.fontColor = 'white';
                            }else if(_this.sass.orgCode == 'A05A01A01' && !!_this.sass.brown && _this.sass.brown == '7'){
                                _this.images = "/server/plug-in/mobile/images/vote/yellow.png";
                                _this.fontColor = 'black';
                            }
                        }
                    }else if(_this.sass.code == 'white_use'){
                        _this.images = "/server/plug-in/mobile/images/vote/white.png";
                    }else if(_this.sass.code == 'white_expire'){
                        _this.images = "/server/plug-in/mobile/images/vote/white.png";
                    }
                    if(_this.sass.vImages){
                        var image = new Image();
                        image.crossOrigin = "anonymous";
                        image.src = showPicture(_this.sass.vImages,'480');
                        var width = document.body.clientWidth - 12;
                        var options = {
                            width: 240,
                            height: 220,
                            minScale: 1,
                            ruleOfThirds: true
                        }
                        try {
                            image.onload = function() {
                                SmartCrop.crop(image, options,
                                    function (result) {
                                        var selectedCrop = result.topCrop;
                                        var canvasimg = document.createElement('canvas');
                                        var ctx = canvasimg.getContext('2d');
                                        canvasimg.width = selectedCrop.width;
                                        canvasimg.height = selectedCrop.height;
                                        image.width = image.width;
                                        image.height = image.height;
                                        ctx.drawImage(image, selectedCrop.x, selectedCrop.y, selectedCrop.width, selectedCrop.width, 0, 0, selectedCrop.width, selectedCrop.height);
                                        var ext = _this.sass.vImages.substring(_this.sass.vImages.lastIndexOf(".") + 1).toLowerCase();
                                        var dataURL = canvasimg.toDataURL("image/" + ext);
                                        // $(".imageIco1 img").attr("src", dataURL);
                                        _this.sass.base64 = dataURL;
                                        _this.$forceUpdate();
                                    });
                            }
                        }catch (e) {
                            console.log(e);
                        }
                    }

                    if(!_this.sass.vImages && _this.sass.orgCode == 'A05A01A06'){
                        app.dialog.confirm('您未上传身份证件，是否立即补传？', function () {
                            app.dialog.close();
                            routerPage('wechatRouter/pages/certification/certificateTwo?src='+encodeURIComponent(window.location.href));
                        });
                    }
                }
            },function e(result) {

            },'GET');
        },
        pictureClick(url){
            url = showPicture(url,480);
            var photos = [url];
            var myPhotoBrowserPopupDark = app.photoBrowser.create({
                photos :photos,
                theme: 'dark',
                type: 'standalone',
                routableModals:false,
                swipeToClose:true,
                initialSlide:2,
                toolbar:false,
            });
            myPhotoBrowserPopupDark.open(0);
        },
    },
    mounted(){
        this.getInfos();
        this.getCount();
        this.getBehavior();

        this.getSass();

        this.scanPopup = app.popup.create({
            el: '#popup-about',
            animate:true
        });

        this.getCertificateStep();

        this.checkSubscribe();

    }
});