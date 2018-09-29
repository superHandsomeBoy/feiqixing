/**
 * Created by Administrator on 2014/11/3.
 */

var Loading = {};

Loading.iskickout = -1;     // 被T下线 (-1 正常)

Loading.add = function (noshow) {
    if (Loading.bg) {
        cc.log("重复Loading");
        return;
    }
    Loading.bg = new cc.LayerColor(cc.color(0, 0, 0, 1));

    cc.eventManager.addListener(cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: function () {
            return true;
        }
    }), Loading.bg);
    cc.director.getRunningScene().addChild(Loading.bg, 250);


    if (noshow) {
        var delay3 = cc.delayTime(10);
        var func3 = cc.callFunc(function () {
            Loading.remove();
        }, this);
        Loading.bg.runAction(cc.sequence(delay3, func3));
        return;
    }

    var delay = cc.delayTime(1);
    var delay2 = cc.delayTime(10);
    var callfunc = cc.callFunc(function () {

        Loading.createImg();

        if (Loading.bg)
            Loading.bg.setOpacity(50);
    }, this);
    var func2 = cc.callFunc(function () {
        NumUnit.prompts(LANSTR.network_poor);
        Loading.remove();
    }, this);

    Loading.bg.runAction(cc.sequence(delay, callfunc, delay2, func2));
};

Loading.remove = function () {
    if (!Loading.bg) {
        cc.log("没有Loading");
        return;
    }

    Loading.bg.stopAllActions();
    cc.eventManager.removeListeners(Loading.bg);
    Loading.bg.removeFromParent(true);
    Loading.bg = null;
};

Loading.createImg = function () {
    if (!Loading.bg)
        return;

    var gap = 25;
    var gap2 = 45;
    var xx = WINSIZE.width / 2;
    var yy = WINSIZE.height / 2;

    var aa = [];
    for (var i = 0; i < 6; i++) {
        var angle = (90 - i * 60) / 180 * Math.PI;
        var x1 = xx + gap * Math.cos(angle);
        var y1 = yy + gap * Math.sin(angle);
        var x2 = xx + gap2 * Math.cos(angle);
        var y2 = yy + gap2 * Math.sin(angle);

        aa[i] = NumUnit.initImage(x1, y1, resPlist.load_img2, Loading.bg);
        aa[i].p1 = cc.p(x1, y1);
        aa[i].p2 = cc.p(x2, y2);
    }

    var index = 0;
    var move1 = cc.moveTo(0.1, aa[index].p2);
    var move2 = cc.moveTo(0.1, aa[index].p1).easing(cc.easeBackOut());
    var fun = cc.callFunc(function (target) {
        target.setSpriteFrame("load_img2.png");

        var move1 = cc.moveTo(0.1, aa[index].p2);
        var move2 = cc.moveTo(0.1, aa[index].p1).easing(cc.easeBackOut());

        aa[index].setSpriteFrame("load_img1.png");
        aa[index++].runAction(cc.sequence(move1, move2, fun));

        if (index >= 6) {
            index = 0;
        }
    }, this);

    aa[index].setSpriteFrame("load_img1.png");
    aa[index++].runAction(cc.sequence(move1, move2, fun));
};


Loading.loadingLayer = cc.Layer.extend({
    cb: null,
    _show: false,
    _sprite: null,
    _length: 0,
    _count: 0,
    _label: null,
    _loadingBar: null,

    _isaddOver: false, // 是否加载完资源

    initBg: function (show, type) {
        var size = cc.winSize;
        this._show = show;

        this._sprite = new cc.Sprite();
        this._sprite.setPosition(0, 0);
        this.addChild(this._sprite);

        //loading背景图
        var res = "res/star_bg.png";
        if (type == 1)
            res = "res/star_bg2.png";
        else if (type == 2)
            res = "res/ui_loading_0005.png";
        var bg = NumUnit.initImage(size.width / 2, size.height / 2, res, this._sprite);

        if (type == 1) {
            //进度条底图
            var loadingbg = NumUnit.initImage(size.width / 2, 50, resPlist.ui_loading_0003_01, this._sprite, 1);
            loadingbg.setScaleX(0.5);

            var loadingBar = this._loadingBar = new cc.ProgressTimer(new cc.Sprite(resPlist.ui_loading_0003_02));
            loadingBar.setType(cc.ProgressTimer.TYPE_BAR);
            loadingBar.setMidpoint(cc.p(0, 0.5));
            loadingBar.setBarChangeRate(cc.p(1, 0));
            loadingBar.setPosition(loadingbg.x, loadingbg.y);
            loadingBar.setPercentage(0);
            loadingBar.setScaleX(0.5);
            this._sprite.addChild(loadingBar, 2);

            this._loadingBar.liang = NumUnit.initImage(0, loadingBar.height/2, resPlist.ui_loading_0003_03, loadingBar);
        }

        if (type == 1) {
            this._label = cc.LabelTTF.create("0%", font.font_name, 24);
            this._label.setPosition(size.width / 2, loadingbg.y);
        } else {
            if (show)
                this._label = cc.LabelTTF.create("Loading... 0%", font.font_name, 24);
            else
                this._label = cc.LabelTTF.create("Loading...", font.font_name, 24);
            this._label.setPosition(size.width / 2, 180);
        }
        this._label.setColor(gameColor.zhanghao_yellow5);

        var tipslabel = NumUnit.initLabel(size.width/2, 100, this._sprite, 22, LANSTR.zyjyz, gameColor.zhanghao_yellow5);
        if(type == 1){
            this._label.setColor(cc.hexToColor("#ffffff"));
            tipslabel.setColor(cc.hexToColor("#ffffff"));
        }
        this._sprite.addChild(this._label, 2);
    },

    initData: function (txt) {
        var self = this;

        gamePlayer.mapAlldata = JSON.parse(txt);
        gamePlayer.mapDatas = [];
        gamePlayer.mapCitydatas = {};
        gamePlayer.mapRoaddatas = {};
        gamePlayer.mapInvisible = {};
        var percent = 100 * this.per;

        var layers = gamePlayer.mapAlldata.layers;

        var i = 0;
        var delay = cc.delayTime(0.1);
        var fun = cc.callFunc(function () {
            var layer = layers[i];
            if (!layer) {
                self.stopAllActions();

                self._isaddOver = true;
                if (Loading.iskickout != -1) {
                    Game.kickOutPrompt(Loading.iskickout);
                    Loading.iskickout = -1;
                } else {
                    self.cb();
                }
                return;
            }

            if (!layer.visible) {
                gamePlayer.mapInvisible[i] = true;
            }
            var data = layer.data;
            var mapNumY = layer.height;
            var mapNumX = layer.width;

            gamePlayer.mapDatas[i] = [];
            for (var j = 0; j < mapNumY; j++) {
                gamePlayer.mapDatas[i][j] = [];

                for (var k = 0; k < mapNumX; k++) {
                    var obj = {};
                    obj.tile_id = data[j * mapNumX + k];
                    obj.pos = cc.p(k, j);
                    gamePlayer.mapDatas[i][j][k] = obj;

                    // todo 城池层 (见 map.json)
                    if (i == MapWorld.CITY_LAYER) {
                        if(obj.tile_id == 3) {                      // 城池
                            if (!gamePlayer.mapCitydatas[j]) {
                                gamePlayer.mapCitydatas[j] = {};
                            }
                            gamePlayer.mapCitydatas[j][k] = obj;
                        } else if(obj.tile_id == 1) {               // 道路
                            if (!gamePlayer.mapRoaddatas[j]) {
                                gamePlayer.mapRoaddatas[j] = {};
                            }
                            gamePlayer.mapRoaddatas[j][k] = obj;
                        }
                    }
                }
            }

            i++;

            percent += 1;
            self.updateLabel(percent);
        }, self);

        self.runAction(cc.sequence(delay, fun).repeatForever());
    },

    onEnter: function () {
        this._super();
        this.schedule(this.startLoading, 0.3);
    },

    startLoading: function () {

        var self = this;
        self.unschedule(self.startLoading);
        var res = self.resources;
        self._length = res.length;
        self._count = 0;
        cc.loader.load(self.resources, function (result, allCount, count) {
            self._count = count;
        }, function () {

            Loading.addPlist(self.resources);

            if (self.per < 1 && !gamePlayer.mapAlldata) {
                cc.loader.loadTxt("res/map/map.json", function (err, txt) {
                    self.initData(txt);
                });
            } else {
                self._isaddOver = true;

                if (Loading.iskickout != -1) {
                    Game.kickOutPrompt(Loading.iskickout);
                    Loading.iskickout = -1;
                } else {
                    self.cb();

                    // Loading.loadRes2 用
                    if (!Loading.loadscene) {
                        self.removeFromParent();
                    }
                }
            }
        });
        self.schedule(self._updatePercent);
    },

    _updatePercent: function () {
        var self = this;
        var count = self._count + 1;
        var length = self._length;
        var percent = (count / length * 100 * self.per) | 0;
        percent = Math.min(percent, 100 * self.per);

        self.updateLabel(percent);
        if (count >= length)
            self.unschedule(self._updatePercent);
    },

    updateLabel: function (percent) {
        var self = this;
        if (self._loadingBar) {
            self._label.setString(percent + "%");
            self._loadingBar.setPercentage(percent);
            if(self._loadingBar.liang){
                self._loadingBar.liang.x = self._loadingBar.width  * percent / 100;
            }
        } else {
            if (self._show)
                self._label.setString("Loading... " + percent + "%");
            else
                self._label.setString("Loading...");
        }
    },

    initWithResources: function (resources, cb, per) {
        this.cb = cb;
        this.resources = resources || [];
        this.per = (per === undefined) ? 1 : per;
    }
});

Loading.loadingScene = cc.Scene.extend({
    _layer: null,

    ctor: function () {
        this._super();

        this._layer = new Loading.loadingLayer();
        this.addChild(this._layer);
    },

    initBg: function (show, type) {
        this._layer.initBg(show, type);
    },

    initWithResources: function (resources, cb, per) {
        this._layer.initWithResources(resources, cb, per);
    },

    // 加载完毕
    isLoadOver: function () {
        return this._layer._isaddOver;
    },

    onExit: function () {
        Loading.loadscene = null;
        this._super();
    }
});

// per 显示最大加载量 0.0 - 1.0
// show 显示 %
// type 显示加载进度条
Loading.loadRes = function (resources, cb, per, show, type) {
    if (show === undefined)
        show = true;

    if (Loading.loadscene) {
        Loading.loadscene.initBg(show, type);
        Loading.loadscene.initWithResources(resources, cb, per);
        Loading.loadscene._layer.schedule(Loading.loadscene._layer.startLoading, 0.3);
        cc.log("理论上 只有loadingscene -> loadingscene！！");
    } else {
        Loading.loadscene = new Loading.loadingScene();
        Loading.loadscene.initBg(show, type);
        Loading.loadscene.initWithResources(resources, cb, per);
        cc.director.runScene(Loading.loadscene);
    }
};

// 不切 scene 加载资源
Loading.loadRes2 = function (resources, cb, per, show) {
    if (show === undefined)
        show = true;

    var layer = new Loading.loadingLayer();
    layer.initBg(show);
    layer.initWithResources(resources, cb, per);
    cc.director.getRunningScene().addChild(layer, 99);
};

// 手动删除资源
Loading.removeRes = function (resources) {
    for (var i in resources) {
        if (resources[i].indexOf(".plist") >= 0) {
            cc.spriteFrameCache.removeSpriteFramesFromFile(resources[i]);
            cc.loader.release(resources[i]);
        }
    }
    for (var i in resources) {
        if (resources[i].indexOf(".png") >= 0 || resources[i].indexOf(".jpg") >= 0) {
            cc.textureCache.removeTextureForKey(resources[i]);
            cc.loader.release(resources[i]);
        }
    }
};

Loading.addPlist = function (resources) {
    for (var i in resources) {
        if (cc.isString(resources[i]) && resources[i].indexOf(".plist") >= 0) {
            cc.spriteFrameCache.addSpriteFrames(resources[i]);
        }
    }
};