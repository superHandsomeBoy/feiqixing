var SearchRoom = BaseLayer.extend({
    _tipTxt: null,
    _roomBg: null,
    _btns: null,
    _ips: null,
    _searching: false,
    _index: -1,

    ctor: function () {
        this._super();

        this._index = -1;
        this._searching = true;
        this._tipTxt = NumUnit.initLabel(WINSIZE.width / 2, WINSIZE.height - 50, this, 32, "查找中...");

        this._roomBg = new cc.Node();
        this.addChild(this._roomBg);

        var btn = NumUnit.initButtonUI(resplist.btn_di_0002, resplist.btn_di_0002, this.onJoin, this);
        btn.setPosition(WINSIZE.width - 200, 100);
        this.addChild(btn);
        NumUnit.initLabelBlack(btn.width / 2, btn.height / 2, btn, 24, "加入");
    },

    showRoom: function (ips) {
        this._searching = false;
        this._tipTxt.setString("查找完毕");

        this._roomBg.removeAllChildren();
        this._btns = [];

        cc.log("ips: " + ips);
        var dd = ips.split(",");
        this._ips = dd;

        for (var i = 0; i < dd.length; i++) {
            var btn = NumUnit.initButtonByScale9(resplist.btn_di_0014, resplist.btn_di_0014, WINSIZE.width / 2, WINSIZE.height - 100 - i * 50, this._roomBg, 300, 36, this.onSelect, this);
            btn.img = NumUnit.initScale9Sprite(btn.width / 2, btn.height / 2, btn.width, btn.height, btn, 1);
            btn.img.visible = false;
            btn.index = i;
            btn.ip = dd[i];
            this._btns[i] = btn;

            var txt = NumUnit.initLabelBlack(btn.width / 2, btn.height / 2, btn, 24, dd[i]);
            txt.setLocalZOrder(2);
        }
    },

    onSelect: function (target) {
        for(var i = 0; i < this._btns.length; i++) {
            if (this._btns[i].index == target.index) {
                this._btns[i].img.visible = true;
                this._index = i;
            } else {
                this._btns[i].img.visible = false;
            }
        }
    },

    onJoin: function () {
        if (this._searching) {
            NumUnit.prompts("查找中");
            return;
        }
        if (this._index < 0) {
            NumUnit.prompts("请选择房间");
            return;
        }

        EnterScene.instance.addRoom(this._ips[this._index]);

        this.onClose();
    }
});