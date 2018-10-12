var CreateRoom = BaseLayer.extend({
    _tipTxt: null,
    _ip: null,
    _layers: null,

    ctor: function (isMaster) {
        this._super();

        this._tipTxt = NumUnit.initLabel(WINSIZE.width / 2, WINSIZE.height - 50, this, 32, "房间");
        this._ip = EnterScene.instance.myIp;

        this.initBg();

        if (!isMaster)  // 房主
            return;

        var btn = NumUnit.initButtonUI(resplist.btn_di_0002, resplist.btn_di_0002, this.onStart, this);
        btn.setPosition(WINSIZE.width - 200, 100);
        this.addChild(btn);
        NumUnit.initLabelBlack(btn.width / 2, btn.height / 2, btn, 24, "开始");
    },

    initBg: function () {
        this._layers = [];

        var ww = 300;
        var hh = 200;
        var gap = 50;
        var px = WINSIZE.width / 2 - gap - ww;
        var py = WINSIZE.height / 2 + gap;
        var index = 0;
        var colors = [cc.color(255, 0, 0, 200), cc.color(0, 255, 0, 200), cc.color(0, 0, 255, 200), cc.color(255, 255, 0, 200)];

        for(var i = 0; i < 2; i++) {
            for(var j = 0; j < 2; j++) {
                var layer = new cc.LayerColor(colors[index], ww, hh);
                layer.setPosition(px + i * (ww + gap), py - j * (hh + gap));
                this.addChild(layer);

                var btn = NumUnit.initToumingBtn(layer.x, layer.y, this, ww, hh, this.selectColor, this);
                btn.setAnchorPoint(0, 0);
                btn.index = index;

                this._layers[index] = layer;
                index++;
            }
        }
    },

    onStart: function () {

    },

    updateRoom: function (ips) {
        cc.log("ips: " + ips);

        for(var i = 0; i < 4; i++) {
            this._layers[i].removeAllChildren();
            this._layers[i].ip = null;
        }

        var dd = ips.split(",");
        for(var i = 0; i < dd.length; i++) {
            if (dd[i] && dd[i].length > 5) {
                NumUnit.initLabelBlack(this._layers[i].width / 2, this._layers[i].height / 2, this._layers[i], 30, dd[i]);

                this._layers[i].ip = dd[i];
            }
        }
    },

    // 选颜色
    selectColor: function (target) {
        if (this._layers[target.index].ip) {
            cc.log("had ip" + target.index);
            return;
        }

        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "selectColor", "(I)V", target.index);
    }
});