var Qizi = ccui.Button.extend({

    // 总数据
    _data:null,

    // 当前位置
    _curPox:null,

    // 下一个位置
    _nextPos:null,

    // 状态
    _statu:null,

    // 序号
    _index:null,

    // 是否可操作
    _isDoIt:null,


    ctor:function (data, index) {

        this._data = data;
        this._index = index;
        var sp = "qizi_%s.png";
        sp = cc.formatStr(sp, this._data.color);
        var texType = ccui.Widget.PLIST_TEXTURE;
        this._super(sp, sp, sp, texType);
        this._isDoIt = false;

        this.addTouch();

        // 默认点
        var pos = this.getDefaultPoint();
        this.setPosition(EventCost.switchPos(pos[0], pos[1]));


        this.setQiziStatu(EventCost.QiziStatu.BIRTH);
    },

    getDefaultPoint:function(){
      var pos = this._index  * 2;
      return [this._data.init[pos - 2], this._data.init[pos - 1]];
    },


    setDoit:function( doit ){
        this._isDoIt =  doit;
    },


    isDoit:function(){
        return this._isDoIt;
    },

    addTouch: function () {
        var _this = this;
        var touchEvent = function (sender, type) {
            switch (type) {
                case ccui.Widget.TOUCH_BEGAN:
                    break;
                case ccui.Widget.TOUCH_MOVED:
                    break;
                case ccui.Widget.TOUCH_ENDED:
                    _this.doOpp(sender);
                    break;
                case ccui.Widget.TOUCH_CANCELED:
                    break;
                default:
                    break;
            }
        };
        this.setSwallowTouches(true);
        this.addTouchEventListener(touchEvent, this);
    },

    doOpp: function (sender) {
        // 是否可操作
        if(!this._isDoIt){
            return;
        }

        // 如果是在飞机场上，则出来
        if(this._statu == EventCost.QiziStatu.BIRTH && MainLayer.instance.isBirthNum()){
            this.initBirth();
            return;
        }
        this.checkIsCanMove(MainLayer.instance._diceNum, false);
    },

    // 出发点
    initBirth:function(){
        this.setPosition(EventCost.switchPos(this._data.birth[0], this._data.birth[1]));
        this._curPox = this._data.birth;

        this.setQiziStatu(EventCost.QiziStatu.WAIT);
        MainLayer.instance.showRoll();
    },

    checkIsCanMove:function(num, isBack){
        if(this._statu != EventCost.QiziStatu.WAIT){
            var msg = "";
            if(this._statu == EventCost.QiziStatu.END){
                msg = "%s号%s色棋子已经到目的地，无法操作";
            }else  if(this._statu == EventCost.QiziStatu.BIRTH){
                msg = "%s号%s色棋子还在出发地，无法操作";
            }else  if(this._statu == EventCost.QiziStatu.MOVE){
                msg = "%s号%s色棋子还在移动中，无法操作";
            }

            cc.log(cc.formatStr(msg, this._index, this._data.color));
            return ;
        }
        this.move(num, isBack);
    },

    move:function(num, isBack){

        if(this._statu == EventCost.QiziStatu.END){
            var msg = "%s号%s色棋子已经到目的地，无法操作";
            cc.log(cc.formatStr(msg, this._index, this._data.color));
            return;
        }

        this.setQiziStatu(EventCost.QiziStatu.MOVE);

        var times = --num;
        // 移动停止的时候 优先检测是否到达终点，在去检测是否可以跳，或者可以飞
        var nextPos = this.getNextPos(isBack);
        if(times < 0){
            if(nextPos[0] == 0 && nextPos[1] == 0){
                var msg = "%s号%s色棋子已经到目的地";
                cc.log(cc.formatStr(msg, this._index, this._data.color));

                this.setQiziStatu(EventCost.QiziStatu.END);

                // 到达后检查是否游戏结束
                MainLayer.instance.check(this._data.color);
                return;
            }

            // 优先检测是否可以飞
            this.checkFlyPoints( this._curPox[0],  this._curPox[1], 1, 1);
            return;
        }
        if(nextPos[0] == 0 && nextPos[1] == 0){
            if(times >= 0){
                // 倒退
                isBack = true;
                nextPos = this.getNextPos(isBack);
            }
        }

        var move = cc.moveTo(EventCost.QiziMoveTime, EventCost.switchPos(nextPos[0], nextPos[1]));
        var moveEndFunc = cc.callFunc(function () {
            this._curPox = nextPos;


            if(times >= 0){
                this.move(times, isBack);
            }

        }, this);
        this.runAction(cc.sequence(move, moveEndFunc));
    },

    getNextPos:function(isBack){
        var currentPosX = this._curPox[0];
        var currentPosY = this._curPox[1];

        // 如果是初始点,则默认给路径的第一个位置
        if(currentPosX == this._data.birth[0] && currentPosY == this._data.birth[1]){
            return [this._data.path[0], this._data.path[1]];
        }


        var posX, posY;
        var isFindNext = false;
        for(var i = 0; i < this._data.path.length; i+= 2){
            posX = this._data.path[i];
            posY = this._data.path[i + 1];

            // 检查到相同位置，则代表下一个点是下一个位置
            if(currentPosY == posY && currentPosX == posX){
                if(isBack){
                    return [this._data.path[i - 2], this._data.path[i - 1]];
                }
                isFindNext = true;
                continue;
            }
            if(isFindNext){
                return [posX, posY]
            }
        }
        return [0, 0];
    },

    checkJumpPoints:function(x, y, flyTimes, jumpTimes){
        var xx = 0, yy = 0;
        var isFind = false;
        for(var i = 0; i < this._data.jumpPoint.length; i+= 2){
            xx = this._data.jumpPoint[i];
            yy = this._data.jumpPoint[i + 1];
            if(x == xx && y == yy){
                isFind = true;
                continue;
            }
            if(isFind){
                break;
            }
        }

        if(isFind && jumpTimes > 0){
            var move = cc.moveTo(EventCost.QiziMoveTime, EventCost.switchPos(xx, yy));
            var moveEndFunc = cc.callFunc(function () {
                this._curPox = [xx, yy];
                jumpTimes --;
                this.checkFlyPoints(this._curPox[0], this._curPox[1], flyTimes, jumpTimes);

            }, this);
            this.runAction(cc.sequence(move, moveEndFunc));
        }else{
            this.setQiziStatu(EventCost.QiziStatu.WAIT);
            MainLayer.instance.showRoll();
        }
    },

    setQiziStatu:function(statu){
        this._statu = statu;
    },

    checkFlyPoints:function(x, y, flyTimes, jumpTimes){
        var xx = 0, yy = 0;
        var isFind = false;
        for(var i = 0; i < this._data.flyPoint.length; i+= 2){
            xx = this._data.flyPoint[i];
            yy = this._data.flyPoint[i + 1];
            if(x == xx && y == yy){
                isFind = true;
                continue;
            }
            if(isFind){
                break;
            }
        }

        if(isFind && flyTimes > 0){
            var move = cc.moveTo(EventCost.QiziMoveTime, EventCost.switchPos(xx, yy));
            var moveEndFunc = cc.callFunc(function () {
                this._curPox = [xx, yy];
                flyTimes --;
                this.checkJumpPoints(this._curPox[0], this._curPox[1], flyTimes, jumpTimes);

            }, this);
            this.runAction(cc.sequence(move, moveEndFunc));
        }else{
            this.checkJumpPoints(this._curPox[0], this._curPox[1], flyTimes, jumpTimes);
        }
    },

    getIndex:function(){
        return this._index;
    },

    getStatu:function(){
        return this._statu;
    },

    isEnd:function(){
        return this._statu == EventCost.QiziStatu.END;
    },

    onExit:function () {
        this._super();
    }

});