
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

    // Setup the resolution policy and design resolution size
    cc.view.setDesignResolutionSize(960, 640, cc.ResolutionPolicy.SHOW_ALL);

    // The game will be resized when browser size change
    cc.view.resizeWithBrowserSize(true);

    cc.loader.loadJs(["src/Files.js", "src/app.js"], function (err) {
        cc.loader.loadJs(jsFiles, function (err) {
            cc.loader.load(res_load, function () {
                var sc = new HelloWorldScene();
                cc.director.runScene(sc);
            });
        });
    });
};
cc.game.run();