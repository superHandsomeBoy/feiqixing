/**
 * Created by Administrator on 2014/5/20.
 */

var BaseLayer = cc.Layer.extend({

    bgTouch: false,     // 点击背景是否关闭界面
    onEase: false,       // 是否要缓动
    resources: null,    // 要加载的资源
    releaseResNow: true,

    _resPngs: null,
    _resPlist: null,
    _winsizie: null,
    _bgLayer: null,
    _addResEnd: false,  // 资源加载完毕
    _closeFunc:null,

    swallowToucheEventCallback:null,

    ctor: function () {
        this._super();
        this._resPngs = [];
        this._resPlist = [];
        this._winsizie = cc.winSize;
        this._addResEnd = false;
        this.onEase = false;
        this.releaseResNow = true;
        this._closeFunc = null;
        this.swallowToucheEventCallback = null;
        this.setContentSize(this._winsizie);
        this.addMark();
    },

    onEnter: function () {
        this._super();

        if (this._bgLayer && this.onEase) {
            this._bgLayer.setOpacity(0);
        }

        this.addRes(this.resources);
    },

    // 遮罩 屏蔽下层点击
    addMark: function () {
        var bgLayer = this._bgLayer = new cc.LayerColor(cc.color(0, 0, 0, 185), this._winsizie.width * 2, this._winsizie.height * 2);
        bgLayer.setPosition(-this._winsizie.width * 0.5, -this._winsizie.height * 0.5);
        this.addChild(bgLayer, -2);
        var self = this;
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                if ( self.swallowToucheEventCallback) {
                    return self.swallowToucheEventCallback.call(self, touch, event);
                }
                return true;
            },
            onTouchEnded: function (touch, event) {
                if (self.bgTouch && self._addResEnd) {  // 资源加载完 才能删除
                    self.onClose();
                }
            }
        }), bgLayer);
    },

    // 加载资源
    addRes: function (resources) {
        if (!resources || resources.length <= 0) {
            this.initLayer();
            if (this.onEase) {
                this.showEase();
            } else {
                this.setUIMoveEnd();
            }
            this._addResEnd = true;
            return;
        }
        var _this = this;
        Loading.add();
        cc.loader.load(resources, function () {
            for (var i in resources) {
                if (resources[i].indexOf(".plist") >= 0) {
                    _this._resPlist.push(resources[i]);
                    cc.spriteFrameCache.addSpriteFrames(resources[i]);
                } else {
                    _this._resPngs.push(resources[i]);
                }
            }
            Loading.remove();

            _this.initLayer();
            if (_this.onEase) {
                _this.showEase();
            } else {
                _this.setUIMoveEnd();
            }
            _this._addResEnd = true;
        });
    },

    // 加载资源 (基本界面已创建时用)
    addRes2: function (resources) {
        if (!resources || resources.length <= 0) {
            this.initLayer2();
            return;
        }
        var _this = this;
        Loading.add();
        cc.loader.load(resources, function () {
            for (var i in resources) {
                if (resources[i].indexOf(".plist") >= 0) {
                    _this._resPlist.push(resources[i]);
                    cc.spriteFrameCache.addSpriteFrames(resources[i]);
                } else {
                    _this._resPngs.push(resources[i]);
                }
            }
            Loading.remove();

            _this.initLayer2();
        });
    },

    initLayer: function () {

    },

    initLayer2: function () {

    },

    showEase: function () {
        this.setCascadeOpacityEnabled(true);

        this.setScale(0.5);
        this.setOpacity(255);
        var scale = cc.scaleTo(0.12, 1.1);
        var scale2 = cc.scaleTo(0.05, 1);
        var fun = cc.callFunc(this.setUIMoveEnd, this);
        this.runAction(cc.sequence(scale, scale2, fun));

        if (this._bgLayer) {
            this._bgLayer.setOpacity(0);
            this._bgLayer.runAction(cc.fadeTo(0.17, 185));
        }
    },

    setUIMoveEnd: function () {
        // GuideUIMoving = false;
    },

    // 设置灰背景
    setFade: function (opa) {
        this._bgLayer.opacity = opa;
    },

    // 是否吞掉触摸事件
    setSwallowToucheEvent: function (callback) {
        this.swallowToucheEventCallback = callback;
    },

    onClose: function () {
        if (this._closeFunc) {
            this._closeFunc.call();
        }
        this.removeFromParent(true);
    },

    setCloseFunc:function (func) {
       this._closeFunc =  func;
    },

    onExit: function () {
        for (var k in this._resPlist) {
            cc.spriteFrameCache.removeSpriteFramesFromFile(this._resPlist[k]);
            cc.loader.release(this._resPlist[k]);
        }
        for (var j in this._resPngs) {
            cc.textureCache.removeTextureForKey(this._resPngs[j]);
            cc.loader.release(this._resPngs[j]);
        }
        // cc.textureCache.removeUnusedTextures();
        // cc.textureCache.dumpCachedTextureInfo();
        //if (this._bgLayer)
        //    cc.eventManager.removeListeners(this._bgLayer);
        this._super();
    }
});