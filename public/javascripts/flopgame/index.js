console.log(module.foo);
$(function () {
    var httpUrl = module.foo;
    var $cards = $(".cardbox .animate"),//所有卡牌
        $phone = $("#phone"),//手机号遮罩层
        $mask = $("#mask"),//红包遮罩层
        $adress = $("#adress"),//信息遮罩层
        $success = $(".success"),
        // length = $cards.length,
        // index = length,//轮流滚动的卡牌下标
        clickTime = 0;
        // timer;//轮流提示定时器
    // init();
    // function init() {
    //     //卡牌轮流选中动画
    //     setTimeout(function () {
    //         timer = setInterval(function () {
    //             // bool = true;//卡牌归位，可以点击
    //             $cards.eq(index - 1).removeClass("active");
    //             index %= 11;
    //             $cards.eq(index).addClass("active");
    //             index++;
    //         }, 1000);
    //     }, 1000);
    // }

    //点击卡牌翻转


    $.ajax({
        // url:'/LuckDraw/addPrize',
        url: httpUrl+'/New/AccountTag/accountTagList',
        type:"POST",
        dataType:"json",
        success:function(data){
            
        }
    })

    $(".cardbox").on("click", ".animate", function () {
        var phoneNumber = sessionStorage.getItem("telephone");
        if(!phoneNumber){
            //遮罩层显示
            $phone.show();
            //输入手机号
            $(".close").click(function () {
                $phone.hide();
            })
            //确认手机号
            $(".surephone").click(function () {
                var telephone = '86' + $('#telephone').val();
                $phone.hide();
                sessionStorage.setItem("telephone",telephone);
            })
        }else{
            if (new Date() - clickTime > 1000) {//两次点击的间隔不能小于1秒
                // clearInterval(timer);//清除轮流选中动画
                $cards.removeClass("active");//清除轮流滚动类名
                $(this).addClass("open-card");//添加翻牌动画
    
                //动画监听
                $(this).on("animationend", function () {
                    $(this).removeClass("open-card");//移除翻牌动画
                    //遮罩层显示
                    $.ajax({
                        // url:'/LuckDraw/addPrize',
                        url:'/LuckDraw/addPrize',
                        type:"POST",
                        dataType:"json",
                        data:{
                            phoneNumber:phoneNumber
                        },
                        success:function(data){
                            if(data.code == '200'){
                                // console.log(data);
                                $(".picture").attr('src','');
                                if(data.data.prize == '周边棒球帽'){
                                    $(".picture").attr('src','http://jimu-activity-web.cdn.bcebos.com/flopgame/gift2.png');
                                    $(".sure").hide();
                                    $(".get").show();
                                }else if(data.data.prize == '周边礼盒'){
                                    $(".picture").attr('src','http://jimu-activity-web.cdn.bcebos.com/flopgame/gift4.png'); 
                                    $(".sure").hide();
                                    $(".get").show();
                                }else if(data.data.prize == '《惊天魔盗团》门票'){
                                    $(".picture").attr('src','http://jimu-activity-web.cdn.bcebos.com/flopgame/gift3.png');
                                    $(".sure").hide();
                                    $(".get").show();
                                }else if(data.data.prize == '《惊天魔盗团》无门槛代金券'){
                                    $(".picture").attr('src','http://jimu-activity-web.cdn.bcebos.com/flopgame/gift1.png'); 
                                    $(".sure").hide();
                                    $(".get").show();
                                }else if(data.data.prize == '未中奖'){
                                    $(".picture").attr('src','http://jimu-activity-web.cdn.bcebos.com/flopgame/nogift.png');
                                    $(".get").hide();
                                    $(".sure").show();
                                }
                                if(data.data.msg == '您已经参与过抽奖了!'){
                                    $(".picture").attr('src','http://jimu-activity-web.cdn.bcebos.com/flopgame/already.png');
                                    $(".get").hide();
                                    $(".sure").show();
                                }else if(data.data.msg == '您还不是积目用户!'){
                                    $(".picture").attr('src','http://jimu-activity-web.cdn.bcebos.com/flopgame/nogmu.png');
                                    $(".get").hide();
                                    $(".sure").hide();
                                    $(".register").show();
                                }

                                if(data.data.type == '2'){
                                    //领取奖品
                                    $(".get").click(function () {
                                        $mask.hide();
                                        $adress.show();
                                        $(".sureadress").click(function () {
                                            var gmuname = $('.gmuname').val();
                                            var gmuphone = $('.gmuphone').val();
                                            var gmuadress = $('.gmuadress').val();
                                            // console.log(gmuname);
                                            // console.log(gmuphone);
                                            // console.log(gmuadress);
                                            $.ajax({
                                                url:'/LuckDraw/addAddress',
                                                type:"POST",
                                                dataType:"json",
                                                data:{
                                                    addressee:gmuname,
                                                    phoneNumber:gmuphone,
                                                    address:gmuadress
                                                },
                                                success:function(data){
                                                    if(data.code == '200'){
                                                        console.log(data);
                                                        $adress.hide();
                                                        $success.show();
                                                        setTimeout(function(){
                                                            $success.hide();
                                                        },2000);
                                                    }else{
                                                        
                                                    }
                                                }
                                            })

                                        });
                                    });
                                }else{
                                    $(".get").click(function () {
                                        $mask.hide();
                                        $success.show();
                                        setTimeout(function(){
                                            $success.hide();
                                        },1000);
                                    })
                                }
                            }else{
                                
                            }
                        }
                    })

                    $mask.show();
                    //关闭弹出层
                    $(".close,.sure").click(function () {
                        $mask.hide();
                    });

                    //点击注册
                    $(".register").click(function () {
                        window.location.href='http://i.eomchat.com/i/';
                    });

                    $(this).off("animationend");//解绑动画监听
                });
            }
        }
    });
    //中奖信息提示
    // $(".close,.operation").click(function () {
    //     clickTime = new Date();//时间更新
    //     index = length;//卡牌选中重新从第一张开始
    //     init();
    // });
});