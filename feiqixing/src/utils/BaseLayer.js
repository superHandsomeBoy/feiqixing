/**
 * Created by Administrator on 2014/5/20.
 */

var BaseLayer = cc.Layer.extend({

    bgTouch: false,     // 点击背景是否关闭界面
    onEase: true,       // 是否要缓动
    onEase2: false,       // 是否要缓动(二级界面效果)
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
        this.onEase = true;
        this.onEase2 = false;
        this.releaseResNow = true;
        this._closeFunc = null;
        this.swallowToucheEventCallback = null;
        this.setContentSize(this._winsizie);
        this.addMark();

        GuideUIMoving = true;
    },

    onEnter: function () {
        this._super();

        if (this._bgLayer && this.onEase && this.onEase2) {
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

        if (!this.onEase2) {
            this.setScale(0.7);
            this.setOpacity(255);
            var scale = cc.scaleTo(0.15, 1);
            var fade = cc.fadeIn(0.15);
            var fun = cc.callFunc(this.setUIMoveEnd, this);

            this.runAction(cc.sequence(cc.spawn(scale, fade), fun));
        } else {
            this.setScale(0.5);
            this.setOpacity(255);
            var scale = cc.scaleTo(0.12, 1.1);
            var fade = cc.fadeIn(0.17);
            var scale2 = cc.scaleTo(0.05, 1);
            var fun = cc.callFunc(this.setUIMoveEnd, this);

            // this.runAction(cc.sequence(cc.spawn(scale, fade), scale2, fun));
            this.runAction(cc.sequence(scale, scale2, fun));

            if (this._bgLayer) {
                this._bgLayer.setOpacity(0);
                this._bgLayer.runAction(cc.fadeTo(0.17, 165));
            }
        }
    },

    setUIMoveEnd: function () {
        GuideUIMoving = false;
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
        if (this.onEase && this.onEase2) {
            var scale = cc.scaleTo(0.1, 0.5);
            var fade = cc.fadeOut(0.1);
            var fun = cc.callFunc(this.onCloseEase, this);

            this.runAction(cc.sequence(cc.spawn(scale, fade), fun));
        } else {
            this.onCloseEase();
        }
    },

    onCloseEase: function () {
        if (MapWorld.instance) {
            MapWorld.instance.setCameraVisible(true);
        }
        if (this._closeFunc) {
            this._closeFunc.call();
        }
        this.removeFromParent(true);
        //SoundManager.playEffect(res.btn_flip);
    },

    setCloseFunc:function (func) {
       this._closeFunc =  func;
    },

    isContinue:function () {
        if(Cache.skillViewHasExist || Cache.heroViewHasExist || Cache.zhaomuViewHasExist || Cache.outsiteViewHasExist
            || Cache.xiaochangViewHasExist){
            return true;
        }
        return false;
    },

    onExit: function () {
        EventDispatcher.shared().removeListenerByDelgate(this);
        var children = this.getChildren();
        for (var i in children) {
            EventDispatcher.shared().removeListenerByDelgate(children[i]);
        }

        TouchTips.removeTouchTips();

        // if (!this.releaseResNow) {
        //     this._super();
        //     return;
        // }
        // if(Cache.skillViewHasExist || Cache.heroViewHasExist || Cache.zhaomuViewHasExist || Cache.outsiteViewHasExist){
        //     this._super();
        //         return;
        // }

        for (var k in this._resPlist) {
            if(this._resPlist[k].indexOf("cardlist_mid") >= 0){
                if(this.isContinue()){
                    continue;
                }
            }
            cc.spriteFrameCache.removeSpriteFramesFromFile(this._resPlist[k]);
            cc.loader.release(this._resPlist[k]);
        }
        for (var j in this._resPngs) {
            if(this._resPngs[j].indexOf("cardlist_mid") >= 0){
                if(this.isContinue()){
                    continue;
                }
            }
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