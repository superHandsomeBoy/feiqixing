var EnterLayer = cc.Layer.extend({
    myIp: null,

    _room: null,
    _search: null,

    ctor:function () {
        this._super();

        WINSIZE = cc.winSize;
        Loading.addPlist(res_load);

        EnterScene.instance = this;
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

    onEnter: function () {
        this._super();

        this.myIp = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getMyIp", "()Ljava/lang/String;");
    },

    // 本机创建房间
    createRoom: function () {
        this._room = new CreateRoom(true);
        this.addChild(this._room, 1);

        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "waitSearch", "()V");
    },

    // 加入房间
    addRoom: function (ip) {
        this._room = new CreateRoom();
        this.addChild(this._room, 1);

        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "selectRoom", "(Ljava/lang/String;)V", ip);
    },

    searchRoom: function () {
        this._search = new SearchRoom();
        this.addChild(this._search, 1);

        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "searchDevices", "()V");
    },

    // 显示可选房间
    showRoom: function (ips) {
        this._search.showRoom(ips);
    },

    // 更新房间人员
    updateRoom: function (ips) {
        this._room.updateRoom(ips);
    },

    // 本机ip
    getMyIp: function (ip) {
        this.myIp = ip;
        this._room.updateRoom(ip);
    }
});

var EnterScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new EnterLayer();
        this.addChild(layer);
    }
});


EnterScene.instance = null;

