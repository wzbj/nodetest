var VideoPlay=function(ele){
    if (ele!=""){
        this.oVideoWrap=$(ele);
        this.oOPerBtn=$(ele).find(".oper-btn");
        this.oOPerBtns=$(".oper-btn");
        this.oVideo=$(ele).find(".video");
        this.oCurrentTime=$(ele).find(".current-time");
        this.oDuration=$(ele).find(".duration");
        this.oControl=$(ele).find(".control");
        this.oVideoScreen=$(ele).find(".video-screen");
        this.oDragBtn=$(ele).find(".drag-btn");
        this.oProgressBar=$(ele).find(".progress-bar");
        this.oPlayProgressBar=$(ele).find(".play-progress-bar");
        this.oScreenTimeWrap=$(ele).find(".screen-time-wrap");
        this.oScreenCurrentTime=$(ele).find(".screen-currenttime");
        this.oScreenDuration=$(ele).find(".screen-duration");
        this.oFullBtn=$(ele).find(".full-btn");
        this.oLoading=$(ele).find(".loading");
        this.oVideos=$("video");
        this.iDuration=0;
        this.iCurrentTime=0;
        this.timer;
        this.fnTimer;
        this.bMoving=false;
        this.init();
    }

};
VideoPlay.prototype={
    init:function(){
        var _this=this;
        _this.bindEvent();
        _this.eventVideo();
        _this.hideControl(1);
        _this.touchScreenTime();
    },
    bindEvent:function(){
        var _this=this;
        _this.oOPerBtn.on("click",function(){//点击暂停、开始按钮
            if($(this).hasClass("play")){
                _this.pauseStyle();
            }else{
                _this.startStyle();
            }
        });

        //点击屏幕
        _this.oVideoScreen.on("touchstart",function(){
            _this.showHideControl();
        });

        _this.setDragBtn();

        //点击全屏
        _this.oFullBtn.on("click",function(){
            if($(this).hasClass("full-btn")){
                _this.setFullScreen();
            }else{
                _this.setUnFullScreen();
            }
        });

        //监听屏幕方向
        $(window).on("orientationchange",function(){
            _this.orientation();
        });

    },
    orientation:function(){
        var _this=this;
        if(window.orientation==0 || window.orientation==180){//竖屏
            _this.setUnFullScreen();
        }else if(window.orientation==90 || window.orientation==-90){//横屏
            _this.setFullScreen();
        }
    },
    startStyle:function(){
        var _this=this;
        _this.oOPerBtn.removeClass("pause").addClass("play");
        _this.oVideo[0].pause();
    },
    pauseStyle:function(){
        var _this=this;
        //如果有其他视频，则暂停播放其他视频
        if (_this.oVideos.length>0){
            for (var i=0;i<_this.oVideos.length;i++){
                _this.oVideos[i].pause();
            }
            _this.oOPerBtns.removeClass("pause").addClass("play");
        }
        //播放当前视频
        _this.oOPerBtn.removeClass("play").addClass("pause");
        _this.oVideo[0].play();
    },
    getCurrentime:function(){
        var _this=this;
        _this.timer=setInterval(function(){
            _this.iCurrentTime=_this.oVideo[0].currentTime;
            _this.oCurrentTime.text(secondToDate(_this.oVideo[0].currentTime).substring(3,8));
            _this.iDuration=_this.oVideo[0].duration;
            setTimeout(function(){
                _this.oDuration.text(secondToDate(_this.iDuration));
            },1000);
            if(!_this.bMoving) {
                _this.setProgress(_this.oVideo[0].currentTime);
            }
        },1000);
    },
    eventVideo:function(){
        var _this=this;
        //正在播放中
        _this.oVideo[0].addEventListener("playing",function(){
            _this.getCurrentime();
            _this.oLoading.addClass("hide");
        });

        //播放
        _this.oVideo[0].addEventListener("play",function(){
            _this.oLoading.addClass("hide");
        });

        //监听等待
        _this.oVideo[0].addEventListener("waiting",function(){
            _this.oLoading.removeClass("hide");
        });

        //播放结束
        _this.oVideo[0].addEventListener("ended",function(){
            _this.startStyle();
            _this.oLoading.addClass("hide");
        });

    },
    showHideControl:function(){//显示隐藏底部控制面板
        var _this=this;
        clearTimeout(_this.fnTimer);
        if(_this.oControl.attr("data-show")=='1'){
            _this.hideControl(0);
        }else{
            _this.showControl();
        }
    },
    hideControl:function(flag){
        var _this=this;
        if(flag==1){
            _this.fnTimer=setTimeout(function(){
                TweenMax.to(_this.oControl,0.3,{y:55,onComplete:function(){
                    _this.oControl.attr("data-show",'0');
                }});
            },5000);
        }else{
            TweenMax.to(_this.oControl,0.3,{y:55,onComplete:function(){
                _this.oControl.attr("data-show",'0');
            }});
        }

    },
    showControl:function(){
        var _this=this;
        TweenMax.to(_this.oControl,0.3,{y:0,onComplete:function(){
            _this.oControl.attr("data-show",'1');
            _this.hideControl(1);
        }});
    },
    setDragBtn:function(){//拖拽进度条
        var _this=this,startX,moveX,bMove=false;
        _this.oDragBtn.on("touchstart",function(e){
            var touchPros= e.touches[0];
            _this.bMoving=true;
            if(!bMove) {
                startX = touchPros.pageX - touchPros.target.parentNode.offsetLeft;
            }
        }).on("touchmove",function(e){
            bMove=true;
            _this.bMoving=true;
            var touchPros= e.touches[0];
            moveX=touchPros.pageX-startX;
            if(moveX<=0){
                moveX=0;
            }else if(moveX>=_this.oProgressBar.width()-$(this).width()){
                moveX=_this.oProgressBar.width()-$(this).width();
            }
            $(this).css("left",moveX+"px");
            _this.oPlayProgressBar.width(moveX+"px");
        }).on("touchend",function(){
            _this.bMoving=false;
            var fCurrentTime=moveX/(_this.oProgressBar.width()-$(this).width())*_this.iDuration;
            _this.seekTo(fCurrentTime);
        });
    },
    seekTo:function(pTime){
        var _this=this;
        _this.oVideo[0].currentTime=pTime;
    },
    setProgress:function(pTime){
        var _this=this;
        var iProgressWidth=pTime/_this.iDuration*(_this.oProgressBar.width()-_this.oDragBtn.width());
        _this.oPlayProgressBar.width(iProgressWidth+"px");
        _this.oDragBtn.css("left",iProgressWidth+"px");
    },
    touchScreenTime:function(){//触屏显示时间
        var oHammer,_this=this,iCurrentTime= 0,iDirection=0;
        oHammer=new Hammer(_this.oVideoScreen[0]);
        oHammer.on("panstart",function(e){
            iCurrentTime=_this.iCurrentTime;
        });
        oHammer.on("panmove",function(e){
            iDirection= e.direction;
            if(iDirection==2){//左
                iCurrentTime--;
                if(iCurrentTime<=0){
                    iCurrentTime=0;
                }
                _this.oScreenTimeWrap.removeClass("hide");
                _this.setScreenTime(iCurrentTime);
            }
            if(iDirection==4){//右
                iCurrentTime++;
                if(iCurrentTime>=_this.iDuration){
                    iCurrentTime=_this.iDuration;
                }
                _this.oScreenTimeWrap.removeClass("hide");
                _this.setScreenTime(iCurrentTime);
            }
        });
        oHammer.on("panend",function(){
            _this.seekTo(iCurrentTime);
            _this.oScreenTimeWrap.addClass("hide");
        });
    },
    setScreenTime:function(pTime){
        var _this=this;
        _this.oScreenCurrentTime.text(secondToDate(pTime));
        _this.oScreenDuration.text(secondToDate(_this.iDuration));
    },
    setFullScreen:function(){//全屏
        var _this=this,iWindowHeight;
        _this.oFullBtn.removeClass("full-btn").addClass("unfull-btn")
        setTimeout(function() {
            iWindowHeight=$(window).height()+"px";
            //只有播放时才全屏
            var zIndex=0;
            if (!_this.oOPerBtn.hasClass("play")){
                zIndex = 99;
            }else{
                zIndex=98;
            }
            _this.oVideoWrap.css({"width":"100%","height":iWindowHeight,"position":"absolute","z-index":zIndex,"left":"0px","top":"0px","background":"black"}); 
            _this.oVideo.css({"width":"100","height":"100%","position":"absolute","z-index":"999999","left":"0px","top":"0px"});
        }, 300);
    },
    setUnFullScreen:function(){//取消全屏
        // var _this=this;
        // _this.oFullBtn.removeClass("unfull-btn").addClass("full-btn");
        // _this.oVideoWrap.css({"width":"5.65rem","height":"3.17rem","position":"relative","z-index":1});

        var _this=this;
        _this.oFullBtn.removeClass("unfull-btn").addClass("full-btn");
        _this.oVideoWrap.css({"width":"5.65rem","height":"3.17rem","position":"relative","z-index":"1","left":"0px","top":"0px"});
    }
};