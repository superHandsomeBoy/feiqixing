var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();

        WINSIZE = cc.winSize;
        Loading.addPlist(res_load);

        this.initBg();
    },

    initBg: function () {
        var btn1 = NumUnit.initButtonUI(resplist.btn_di_0002, resplist.btn_di_0002, this.createRoom, this);
        btn1.setPosition(100, 400);
        this.addChild(btn1);
        NumUnit.initLabelBlack(btn1.width / 2, btn1.height / 2, btn1, 24, "创建");

        var btn2 = NumUnit.initButtonUI(resplist.btn_di_0002, resplist.btn_di_0002, this.searchRoom, this);
        btn2.setPosition(100, 200);
        this.addChild(btn2);
        NumUnit.initLabelBlack(btn2.width / 2, btn2.height / 2, btn2, 24, "加入");
    },

    createRoom: function () {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "waitSearch", "()V");
    },

    searchRoom: function () {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "searchDevices", "()V");
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

