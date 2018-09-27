
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        var helloLabel = new cc.LabelTTF("Hello World", "Arial", 38);
        // position the label on the center of the screen
        helloLabel.x = size.width / 2;
        helloLabel.y = size.height / 2 + 200;
        // add the label as a child to this layer
        this.addChild(helloLabel, 5);

        // add "HelloWorld" splash screen"
        this.sprite = new cc.Sprite(res.HelloWorld_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(this.sprite, 0);

        this.initBg();
    },

    initBg: function () {
        var btn1 = this.addBtn(res.btn_di_0002, this.createRoom, this);
        btn1.setPosition(100, 400);
        this.addChild(btn1);

        var btn2 = this.addBtn(res.btn_di_0002, this.searchRoom, this);
        btn2.setPosition(100, 200);
        this.addChild(btn2);
    },

    createRoom: function () {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "waitSearch", "()V");
    },

    searchRoom: function () {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "searchDevices", "()V");
    },

    addBtn: function (normal, callback, targe) {
        var uiButton = new ccui.Button();
        uiButton.loadTextures(normal, normal, normal, ccui.Widget.LOCAL_TEXTURE);

        var touchEvent = function (sender, type) {
            switch (type) {
                case ccui.Widget.TOUCH_BEGAN:
                    break;
                case ccui.Widget.TOUCH_MOVED:
                    break;
                case ccui.Widget.TOUCH_ENDED:
                    callback.call(targe, sender);
                    break;
                default:
                    break;
            }
        };

        uiButton.addTouchEventListener(touchEvent, targe);
        return uiButton;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

