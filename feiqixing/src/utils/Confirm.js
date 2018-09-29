/**
 * Created by Administrator on 2014/6/24.
 *
 * "提示弹窗"
 */
var Confirm = BaseLayer.extend({

    _bg: null,
    _msg: null,
    _title: null,
    _isShowCancelBtn: null,
    _targe: null,
    _confirm_func: null,
    _cancel_func: null,
    _ensureBtn: null,
    _cancelBtn: null,
    _txtEnsure: null,    // 按钮上文字
    _txtCancel: null,
    txt2: null,

    ctor: function (title, msg, targe, func, showCancelBtn, cancelFunc) {
        this._super();
        this.onEase2 = true;

        this._title = title;
        this._msg = msg;
        this._targe = targe;
        this._confirm_func = func;
        this._isShowCancelBtn = showCancelBtn;
        this._cancel_func = cancelFunc;

        this.initBg();
    },

    initBg: function () {
        var bg = this._bg = NumUnit.initScale9Sprite(WINSIZE.width/2,WINSIZE.height/2, 500, 270, this, Scale9.SCALE_82);
        var upbg = NumUnit.initScale9Sprite(bg.width/2, bg.height-24, 498, 47, bg, Scale9.SCALE_83);
        NumUnit.initLabel(upbg.width / 2, upbg.height / 2, upbg, 23, this._title, gameColor.colorcacaae);
        NumUnit.initImage(bg.width/2,bg.height-3,resPlist.erji_xian1,bg);
        NumUnit.initImage(bg.width/2,bg.height-47,resPlist.erji_xian2,bg);

        var btnClose = NumUnit.initButtonUI(resPlist.erji_but, resPlist.erji_but, this.onCancel, this);
        btnClose.setPosition(bg.width - 18, bg.height - 18);
        btnClose.setScale(0.75);
        bg.addChild(btnClose, 3);

        NumUnit.initScale9Sprite(bg.width / 2, 0, 500, 70, bg, Scale9.SCALE_2, 0, 0.5, 0);

        if (typeof (this._msg) === "string") {
            var msg = this.txt2 = NumUnit.initLabel(bg.width / 2, bg.height / 2 + 20, bg, 24, this._msg, gameColor.coloracbede, null, bg.width - 140);
            if (msg.height < 36) {
                msg.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            }
        } else {
            this._msg.setPosition(bg.width / 2, bg.height / 2 + 20);
            bg.addChild(this._msg);
        }

        // 确定按钮
        this.setEnsureBtn(resPlist.btn_di_0006);
        this.setEnsureTxt(LANSTR.confirm);

        // 取消按钮
        if (this._isShowCancelBtn) {
            this.setCancelBtn(resPlist.btn_di_0006);
            this.setCancelTxt(LANSTR.cancel);
        }
    },

    // 设置确认按钮上文字
    setEnsureTxt: function (str) {
        var str2 = NumUnit.getStrSpace(str, 20, this._ensureBtn.width - 30);
        if(this._txtEnsure) {
            this._txtEnsure.setString(str2);
        } else {
            this._txtEnsure = NumUnit.initLabelBlackShadow(this._ensureBtn.width / 2, this._ensureBtn.height / 2, this._ensureBtn, 20, str2);
        }
    },

    // 设置取消按钮上文字
    setCancelTxt: function (str) {
        var str2 = NumUnit.getStrSpace(str, 20, this._cancelBtn.width - 30);
        if(this._txtCancel) {
            this._txtCancel.setString(str2);
        } else {
            this._txtCancel = NumUnit.initLabelBlackShadow(this._cancelBtn.width / 2, this._cancelBtn.height / 2, this._cancelBtn, 20, str2);
        }
    },

    // 设置确认按钮 sprite
    setEnsureBtn: function (res) {
        if(this._ensureBtn) {
            this._ensureBtn.removeFromParent();
        }

        var xx = this._isShowCancelBtn ? this._bg.width / 2 + 120 : this._bg.width / 2;
        var ensureBtn = this._ensureBtn = NumUnit.initButtonUI(res, res, this.onEnsure, this);
        ensureBtn.setPosition(xx, 35);
        ensureBtn.setName("confirm_ok");       // 引导用 (true 不执行下一步)
        ensureBtn.confirm = true;
        this._bg.addChild(ensureBtn, 1);
    },

    // 设置取消按钮 sprite
    setCancelBtn: function (res) {
        if(this._cancelBtn) {
            this._cancelBtn.removeFromParent();
        }

        var cancelBtn = this._cancelBtn = NumUnit.initButtonUI(res, res, this.onCancel, this);
        cancelBtn.setPosition(this._bg.width / 2 - 120, this._ensureBtn.y);
        cancelBtn.setName("confirm_cancel");
        cancelBtn.confirm = true;
        this._bg.addChild(cancelBtn, 1);
    },

    onEnsure: function () {
        this.onClose();
        if (this._confirm_func)
            this._confirm_func.call(this._targe);
    },

    onCancel: function () {
        this.onClose();
        if (this._cancel_func)
            this._cancel_func.call(this._targe);
    }
});
