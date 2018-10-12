
var WINSIZE = null;
var CUSTOMWINSIZE =  {w:1136, h:640};

cc.game.onStart = function(){
    if(!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
        document.body.removeChild(document.getElementById("cocosLoading"));

    // Pass true to enable retina display, on Android disabled by default to improve performance
    cc.view.enableRetina(cc.sys.os === cc.sys.OS_IOS ? true : false);

    // Adjust viewport meta
    cc.view.adjustViewPort(true);

    // Uncomment the following line to set a fixed orientation for your game
    // cc.view.setOrientation(cc.ORIENTATION_PORTRAIT);

    if(!cc.sys.isNative) {
        cc.view.setDesignResolutionSize(CUSTOMWINSIZE.w, CUSTOMWINSIZE.h, cc.ResolutionPolicy.SHOW_ALL);
    } else {
        var vws = cc.winSize;

        var bl = vws.width / vws.height;
        if(bl < 1.5) {
            cc.log("当前屏幕宽高比:"+bl+" 模式：SHOW_ALL");
            CUSTOMWINSIZE = {w:1136,h:760};
            cc.view.setDesignResolutionSize(CUSTOMWINSIZE.w, CUSTOMWINSIZE.h, cc.ResolutionPolicy.SHOW_ALL);
        }else{
            cc.log("当前屏幕宽高比:"+bl+" 模式：FIXED_WIDTH");
            cc.view.setDesignResolutionSize(CUSTOMWINSIZE.w, CUSTOMWINSIZE.h, cc.ResolutionPolicy.FIXED_WIDTH);
        }
    }

    // The game will be resized when browser size change
    cc.view.resizeWithBrowserSize(true);

    cc.loader.loadJs(["src/Files.js", "src/EnterScene.js"], function (err) {
        cc.loader.loadJs(jsFiles, function (err) {
            cc.loader.load(res_load, function () {
                var sc = new EnterScene();
                cc.director.runScene(sc);
            });
        });
    });
};
cc.game.run();