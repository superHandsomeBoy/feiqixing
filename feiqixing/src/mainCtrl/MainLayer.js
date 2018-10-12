var MainLayer = cc.Node.extend({

    _mapData:null,

    // 色子
    _dicesNode:null,
    // 色字当前摇次数
    _timeCount:0,
    // 色字摇的总次数
    _timeEnd:0,
    // 色字是否播放中
    _dicesAni:false,


    // 棋盘
    _mapNode:null,

    // 棋子总信息
    _allQizi:null,

    _allColor:null,

    // 游戏状态
    _gameStatu: null,

    // 色子翻的数
    _diceNum:null,

    // 当前移动的颜色色子
    _nowMoveKey:null,

    // 提示操作
    _tipsTxt:null,

    // 选择移动倒计时
    _time:null,

    ctor:function () {
        this._super();

        WINSIZE = cc.winSize;

        MainLayer.instance = this;

        this._gameStatu = EventCost.Game_State.star;
        this._timeCount = 0;
        this._timeEnd = 10;
        this._dicesAni = false;
        this._allQizi = {};
        this._nowMoveKey = "red";
        this._diceNum = 0;
        this.initMap();

        // 初始化地图
        var node = new MapNode();
        node.setPosition(WINSIZE.width / 2, WINSIZE.height / 2);
        this.addChild(node);
        this._mapNode = node;

        this._tipsTxt = NumUnit.initLabel(30, WINSIZE.height/2, this, 26, "", cc.color.RED, null, 200, null, 0);

        this._time = NumUnit.initLabel(WINSIZE.width - 100, WINSIZE.height/2, this, 24, "", cc.color.RED, null, null, null, 1);

        this.initSezi();
        this.initTouchIfon();

        this.joinPlay();

        EventDispatcher.shared().addListener("testmove", function (cmd, data) {
            // 检查游戏是否结束
            if(this.isGameOver()){
                return;
            }

            var color = data[0];
            var index = data[1];
            var moveNum = data[2];

            if(this._allQizi[color]){
                if(this._allQizi[color][index]){
                    this._allQizi[color][index].move(moveNum, false);
                }
            }
        }, this);

        // 指定颜色操作
        EventDispatcher.shared().addListener(SVRCMD.moveopp, function (cmd, data) {
            this._nowMoveKey = data;
        }, this);
    },

    joinPlay:function(){

        var list = [EventCost.greenInfo, EventCost.redInfo, EventCost.yellowInfo, EventCost.blueInfo];
        var endList = [];
        for(var j = 0; j < list.length; j++){
            if(this._allColor[list[j].color]){
                continue;
            }
            endList.push(list[j]);
        }

        list = endList;
        var num = Math.floor(Math.random() * list.length);
        var info = list[num];
        if(!this._allQizi[info.color]){
            this._allQizi[info.color] = {};
        }

        this._allColor[info.color] = 1;
        // gamePlayer.initPlayer(info.color, 1);

        for(var i = 0; i < EventCost.QiziNums; i++){
            var qizi = new Qizi(info, i + 1);
            this._mapNode.addChild(qizi, 2);

            this._allQizi[info.color][qizi.getIndex()] = qizi;
        }
    },

    initSezi:function(){
        if(this._dicesNode){
           this._dicesNode.removeFromParent();
           this._dicesNode = null;
        }

        this._dicesNode = new cc.Node();
        this._dicesNode.setContentSize(cc.size(EventCost.defaultWidth, EventCost.defaultHeight));
        this._dicesNode.setAnchorPoint(.5, .5);
        this._dicesNode.setPosition(WINSIZE.width  - 100, 100);
        this.addChild(this._dicesNode);

        // 初始化色子
        for(var i = 0; i < 7; i++){
            var dice = new Dice(i);
            dice.setPosition(this._dicesNode.width/2, this._dicesNode.height/2);
            this._dicesNode.addChild(dice);
            if(i != 0){
                dice.visible = false;
            }
        }
    },

    initTouchIfon:function(){
        var self = this;
        var clickDice = null;
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                clickDice = false;
                if(!self._dicesNode){
                    return false;
                }
                var pos = touch.getLocation();
                if(cc.rectContainsPoint(self._dicesNode.getBoundingBox(), pos)){
                    clickDice = true;
                    return true;
                }
                return false;
            },
            onTouchEnded: function (touch, event) {
                if(clickDice && !self._dicesAni && self._diceNum == 0){
                    self.showTips("");
                    self._dicesAni = true;
                    self.showSeziAni();
                    self.schedule(self.sche_SeziAni, 0.1);
                }
            }
        }), this);
    },

    showSeziAni:function(){
        if(!this._dicesNode){
            return;
        }

        var allChildren = this._dicesNode.getChildren();
        var num = Math.floor((Math.random() * (allChildren.length - 1))) + 1;
        this.showTargetSezi(num);
    },

    showTargetSezi:function(num){
        if(!this._dicesNode){
            return;
        }

        var allChildren = this._dicesNode.getChildren();
        if(allChildren.length <= 0){
            return;
        }

        for(var i = 0; i< allChildren.length; i++) {
            allChildren[i].visible = false;
        }

        allChildren[num].visible = true;

        this._diceNum = num;
    },

    // 显示摇色字的那面
    showRoll:function(){
        this.showTargetSezi(0);
    },


    sche_SeziAni:function(){
        if(this._timeCount >= this._timeEnd){
            this._timeCount = 0;
            this._dicesAni = false;
            this.unschedule(this.sche_SeziAni);

            this.starMove();
            return;
        }

        this.showSeziAni();
        this._timeCount ++;
    },


    starMove:function(){
        if(Object.keys(this._allQizi).length <= 0){
            return;
        }

        if(!this._allQizi[this._nowMoveKey]){
            return;
        }

        // 可移动的点
        var autoMoveTimes = 0;
        var moveObj = null;
        var haveBirth = 0;
        for(var i in this._allQizi[this._nowMoveKey]){
            // 只要有在等候
            if(this._allQizi[this._nowMoveKey][i].getStatu() == EventCost.QiziStatu.WAIT){
                autoMoveTimes ++;
                moveObj = this._allQizi[this._nowMoveKey][i];
            }

            if(this._allQizi[this._nowMoveKey][i].getStatu() == EventCost.QiziStatu.BIRTH){
                haveBirth ++;
            }


        }
        /*
            说明当前可以移动的色字只有一个并且摇到的非出生数字，系统自动移动
         */

        this.setDoit(this._nowMoveKey, false);

        if(this.isBirthNum() && haveBirth > 0){
            // 自行选择
            this.setDoit(this._nowMoveKey, true);
            this.showTips("可以控制新的出生或可以控制其他移动");
        }else if(autoMoveTimes == 1){
            moveObj.checkIsCanMove(this._diceNum,false);
        }else if(autoMoveTimes <= 0){
            cc.log("没有可操作的，跳过");
            this.showTips("没有可操作的,需要摇到" + EventCost.birthNum.toString() + "进行起飞");
            this.showRoll();
        }else{
            this.setDoit(this._nowMoveKey, true);
            this.showTips("选择一个控制移动");
        }
    },

    showTips:function(txt){
        if(!this._tipsTxt){
            return;
        }
        this._tipsTxt.setString(txt);
    },

    setDoit:function(key, b){
        for(var i in this._allQizi[key]){
            this._allQizi[key][i].setDoit(b);
        }
    },

    // 是否为出生数字
    isBirthNum:function(){
        for(var i = 0; i < EventCost.birthNum.length; i++){
            if(this._diceNum == EventCost.birthNum[i]){
                return true;
            }
        }
        return false;
    },

    // 初始化地图数据
    initMap:function(){
        this._mapData = [];
        for(var i = 0; i <= EventCost.MAP.width; i++){
            if(!this._mapData[i]){
                this._mapData[i] = [];
            }
            for(var j = 0; j <= EventCost.MAP.height; j++){
                this._mapData[i][j] = 0;
            }
        }
        cc.log("init map success");
    },


    check:function(color){
        if(Object.keys(this._allQizi).length <= 0){
            return false;
        }
        if(!this._allQizi[color]){
            return false;
        }

        if(Object.keys(this._allQizi[color]).length <= 0){
            return false;
        }

        var isOver = true;
        for(var j in this._allQizi[color]){
            if(!this._allQizi[color][j].isEnd()){
                isOver = false;
                break;
            }
        }
        if(isOver){
            var msg = "游戏结束,%s色棋子优先全部到达;";
            cc.log(cc.formatStr(msg, color));
            this._gameStatu = EventCost.Game_State.end;
        }
    },


    isGameOver:function(){
        return this._gameStatu == EventCost.Game_State.end;
    },


    // 开始检查操作
    starCheck:function(){
        this._time.setString(EventCost.moveOppTime);
        this.schedule(this.checkTimeOut, 1);
    },

    // 检查操作计时
    checkTimeOut:function(){
        if(!this._time){
            return;
        }
        var tt = this._time.getString() * 1;
        if(tt <= 0){
            this.unschedule(this.checkTimeOut);
            return;
        }
        tt --;
        this._time.setString(tt);
    },

    onExit:function () {
        EventDispatcher.shared().removeListenerByDelgate(this);
        this._super();
    }
});

var MainScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MainLayer();
        this.addChild(layer);
    }
});

MainLayer.instance = null;