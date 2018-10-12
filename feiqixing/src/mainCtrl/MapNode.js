var MapNode = cc.Node.extend({

    _bg:null,

    ctor:function () {
        this._super();

        this.setContentSize(cc.size(EventCost.MAP.width * EventCost.MAP.diss, EventCost.MAP.height * EventCost.MAP.diss));
        this.setAnchorPoint(.5, .5);


        Loading.addPlist(res_load);

        this._bg = NumUnit.initImage(this.width/2, this.height/2, resplist.qipan, this);
        this._bg.setScale(this.width / this._bg.width, this.height / this._bg.height);



        this.showine();
        this.initBorn();
        this.initBirthPoint();
        this.initPath();
        this.initJumpPoint();
        this.initFlyPoint();
    },

    showine:function(){
        if(!EventCost.showLinePonitLabel){
            return;
        }
        var drawNode = new cc.DrawNode();
        this.addChild(drawNode, 2);

        for(var j = 0; j <= EventCost.MAP.height; j++){
            drawNode.drawRect(cc.p(0, j * EventCost.MAP.diss), cc.p(EventCost.MAP.width * EventCost.MAP.diss, j * EventCost.MAP.diss), cc.color.WHITE, 1, cc.color.RED);
            NumUnit.initLabel(-10, j * EventCost.MAP.diss, drawNode, 10, j, cc.color.YELLOW);
            NumUnit.initLabel(EventCost.MAP.width * EventCost.MAP.diss + 10, j * EventCost.MAP.diss, drawNode, 10, j, cc.color.YELLOW);
        }

        for(var i = 0; i <= EventCost.MAP.width; i++){
            drawNode.drawRect(cc.p(i * EventCost.MAP.diss, 0), cc.p(i * EventCost.MAP.diss, EventCost.MAP.height * EventCost.MAP.diss), cc.color.WHITE, 1, cc.color.RED);
            NumUnit.initLabel(i * EventCost.MAP.diss, -10, drawNode, 10, i, cc.color.YELLOW);
            NumUnit.initLabel(i * EventCost.MAP.diss, EventCost.MAP.height * EventCost.MAP.diss + 10, drawNode, 10, i, cc.color.YELLOW);
        }
    },

    // 初始化出生点的全部位置
    initBorn:function(){
        if(!EventCost.showInitPonitLabel){
            return;
        }

        var posX, posY, img ,fontSize = 20;
        // green
        for(var i = 0; i < EventCost.greenPoints.length; i += 2){
            posX = EventCost.greenPoints[i];
            posY = EventCost.greenPoints[i + 1];
            img  = NumUnit.initImage(posX * EventCost.MAP.diss, posY * EventCost.MAP.diss, resplist.qizi_green, this);
        }

        // red
        for(var i = 0; i < EventCost.redPoints.length; i += 2){
            posX = EventCost.redPoints[i];
            posY = EventCost.redPoints[i + 1];
            img  = NumUnit.initImage(posX * EventCost.MAP.diss, posY * EventCost.MAP.diss, resplist.qizi_red, this)
        }

        // blue
        for(var i = 0; i < EventCost.bluePoints.length; i += 2){
            posX = EventCost.bluePoints[i];
            posY = EventCost.bluePoints[i + 1];
            img  = NumUnit.initImage(posX * EventCost.MAP.diss, posY * EventCost.MAP.diss, resplist.qizi_blue, this);
        }

        // yellow
        for(var i = 0; i < EventCost.yellowPoints.length; i += 2){
            posX = EventCost.yellowPoints[i];
            posY = EventCost.yellowPoints[i + 1];
            img  = NumUnit.initImage(posX * EventCost.MAP.diss, posY * EventCost.MAP.diss, resplist.qizi_yellow, this);
        }
    },

    // 初始化出发点
    initBirthPoint:function(){

        var fontSize = 20, img;
        if(EventCost.showBirthPonitLabel){
            // 蓝
            {
                img  = NumUnit.initImage(EventCost.blueBirthPoint[0] * EventCost.MAP.diss, EventCost.blueBirthPoint[1] * EventCost.MAP.diss, resplist.load_img2, this);
                NumUnit.initLabel(img.width / 2, img.height / 2, img, fontSize, "出", cc.color.BLACK);
            }

            // 黄
            {
                img  = NumUnit.initImage(EventCost.yellowBirthPoint[0] * EventCost.MAP.diss, EventCost.yellowBirthPoint[1] * EventCost.MAP.diss, resplist.load_img2, this);
                NumUnit.initLabel(img.width / 2, img.height / 2, img, fontSize, "出", cc.color.BLACK);
            }

            // 绿
            {
                img  = NumUnit.initImage(EventCost.greenBirthPoint[0] * EventCost.MAP.diss, EventCost.greenBirthPoint[1] * EventCost.MAP.diss, resplist.load_img2, this);
                NumUnit.initLabel(img.width / 2, img.height / 2, img, fontSize, "出", cc.color.BLACK);
            }

            // 红
            {
                img  = NumUnit.initImage(EventCost.redBirthPoint[0] * EventCost.MAP.diss, EventCost.redBirthPoint[1] * EventCost.MAP.diss, resplist.load_img2, this);
                NumUnit.initLabel(img.width / 2, img.height / 2, img, fontSize, "出", cc.color.BLACK);
            }
        }


        if(EventCost.showBirthPonitLabel){
            // 中间点
            {
                img  = NumUnit.initImage(EventCost.middBirthPoint[0] * EventCost.MAP.diss, EventCost.middBirthPoint[1] * EventCost.MAP.diss, resplist.load_img2, this);
                NumUnit.initLabel(img.width / 2, img.height / 2, img, fontSize, "摇", cc.color.BLACK);
            }
        }
    },

    initPath:function(){

        var posX, posY, img;
        if(0){
            // green
            for(var i = 0; i < EventCost.greenPath.length; i += 2){
                posX = EventCost.greenPath[i];
                posY = EventCost.greenPath[i + 1];
                img  = NumUnit.initImage(posX * EventCost.MAP.diss, posY * EventCost.MAP.diss, resplist.load_img1, this, 5);
            }
        }

        if(0){
            // red
            for(var i = 0; i < EventCost.redPath.length; i += 2){
                posX = EventCost.redPath[i];
                posY = EventCost.redPath[i + 1];
                img  = NumUnit.initImage(posX * EventCost.MAP.diss, posY * EventCost.MAP.diss, resplist.load_img1, this, 5);
            }
        }


        if(0){
            // yellow
            for(var i = 0; i < EventCost.yellowPath.length; i += 2){
                posX = EventCost.yellowPath[i];
                posY = EventCost.yellowPath[i + 1];
                img  = NumUnit.initImage(posX * EventCost.MAP.diss, posY * EventCost.MAP.diss, resplist.load_img1, this, 5);
            }
        }

        if(0){
            // blue
            for(var i = 0; i < EventCost.bluePath.length; i += 2){
                posX = EventCost.bluePath[i];
                posY = EventCost.bluePath[i + 1];
                img  = NumUnit.initImage(posX * EventCost.MAP.diss, posY * EventCost.MAP.diss, resplist.load_img1, this, 5);
            }
        }
    },


    /*
     初始化跳点
     一开始为2格跳一次
       后面为4格跳一次
     */

    initJumpPoint:function(){
        var posX,
            posY,
            img,
            count     = 0,
            agvNum    = 4,
            firstNum  = 2,
            fontSize  = 16;

        // green
        {
            count = 0;
            for(var i = 0; i < EventCost.greenPath.length - 12; i += 2){
                posX = EventCost.greenPath[i];
                posY = EventCost.greenPath[i + 1];
                count ++;
                if(count == firstNum){
                    EventCost.greenJumpPonit.push(posX);
                    EventCost.greenJumpPonit.push(posY);
                }else if(count > firstNum && ((count - firstNum) % agvNum == 0)){
                    EventCost.greenJumpPonit.push(posX);
                    EventCost.greenJumpPonit.push(posY);
                }
            }

            if(EventCost.showJumpPonitLabel){
                for(var i = 0; i < EventCost.greenJumpPonit.length; i += 2){
                    posX = EventCost.greenJumpPonit[i];
                    posY = EventCost.greenJumpPonit[i + 1];
                    img  = NumUnit.initImage(posX * EventCost.MAP.diss, posY * EventCost.MAP.diss, resplist.load_img1, this, 5);
                    NumUnit.initLabel(img.width / 2, img.height / 2, img, fontSize, "绿", cc.color.BLACK);
                }
            }
        }


        // red
        {
            count = 0;
            for (var i = 0; i < EventCost.redPath.length - 12; i += 2) {
                posX = EventCost.redPath[i];
                posY = EventCost.redPath[i + 1];
                count++;
                if (count == firstNum) {
                    EventCost.redJumpPonit.push(posX);
                    EventCost.redJumpPonit.push(posY);
                } else if (count > firstNum && ((count - firstNum) % agvNum == 0)) {
                    EventCost.redJumpPonit.push(posX);
                    EventCost.redJumpPonit.push(posY);
                }
            }


            if (EventCost.showJumpPonitLabel){
                for(var i = 0; i < EventCost.redJumpPonit.length; i += 2){
                    posX = EventCost.redJumpPonit[i];
                    posY = EventCost.redJumpPonit[i + 1];
                    img  = NumUnit.initImage(posX * EventCost.MAP.diss, posY * EventCost.MAP.diss, resplist.load_img1, this, 5);
                    NumUnit.initLabel(img.width / 2, img.height / 2, img, fontSize, "红", cc.color.BLACK);
                }
            }
        }

        // yellow
        {
            count = 0;
            for(var i = 0; i < EventCost.yellowPath.length - 12; i += 2){
                posX = EventCost.yellowPath[i];
                posY = EventCost.yellowPath[i + 1];
                count ++;
                if(count == firstNum){
                    EventCost.yellowJumpPonit.push(posX);
                    EventCost.yellowJumpPonit.push(posY);
                }else if(count > firstNum && ((count - firstNum) % agvNum == 0)){
                    EventCost.yellowJumpPonit.push(posX);
                    EventCost.yellowJumpPonit.push(posY);
                }
            }

            if(EventCost.showJumpPonitLabel){
                for(var i = 0; i < EventCost.yellowJumpPonit.length; i += 2){
                    posX = EventCost.yellowJumpPonit[i];
                    posY = EventCost.yellowJumpPonit[i + 1];
                    img  = NumUnit.initImage(posX * EventCost.MAP.diss, posY * EventCost.MAP.diss, resplist.load_img1, this, 5);
                    NumUnit.initLabel(img.width / 2, img.height / 2, img, fontSize, "黄", cc.color.BLACK);
                }
            }
        }

        // blue
        {
            count = 0;
            for(var i = 0; i < EventCost.bluePath.length - 12; i += 2){
                posX = EventCost.bluePath[i];
                posY = EventCost.bluePath[i + 1];
                count ++;
                if(count == firstNum){
                    EventCost.blueJumpPonit.push(posX);
                    EventCost.blueJumpPonit.push(posY);
                }else if(count > firstNum && ((count - firstNum) % agvNum == 0)){
                    EventCost.blueJumpPonit.push(posX);
                    EventCost.blueJumpPonit.push(posY);
                }
            }


            if(EventCost.showJumpPonitLabel){
                for(var i = 0; i < EventCost.blueJumpPonit.length; i += 2){
                    posX = EventCost.blueJumpPonit[i];
                    posY = EventCost.blueJumpPonit[i + 1];
                    img  = NumUnit.initImage(posX * EventCost.MAP.diss, posY * EventCost.MAP.diss, resplist.load_img1, this, 5);
                    NumUnit.initLabel(img.width / 2, img.height / 2, img, fontSize, "蓝", cc.color.BLACK);
                }
            }
        }
    },

    // 显示可以飞的点
    initFlyPoint:function(){
        if(EventCost.showFlyPonitLabel){
            var img, posX, posY, fontSize = 16;
            var points = EventCost.greenFlyPonit.concat(EventCost.redFlyPonit).
                                                   concat(EventCost.yellowFlyPonit).
                                                   concat(EventCost.blueFlyPonit);

            for(var i = 0; i < points.length; i += 2){
                posX = points[i];
                posY = points[i + 1];
                img  = NumUnit.initImage(posX * EventCost.MAP.diss, posY * EventCost.MAP.diss, resplist.load_img1, this, 5);
                NumUnit.initLabel(img.width / 2, img.height / 2, img, fontSize, "飞", cc.color.BLACK);
            }

        }
    },

    onExit:function () {
        this._super();
    }
});