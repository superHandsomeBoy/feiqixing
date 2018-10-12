/**
 * Created by Administrator on 2014/11/4.
 */

var NumUnit = {};

/**
 * 文本
 * @param width     width == 0 无限长
 * @param height    height 超过此高度，缩小字体，最小为 2
 * @returns {str}
 */
NumUnit.initLabel = function (xx, yy, parentContent, fontSize, str, fontColor, fontName, width, height, anchorXX, anchorYY, zOrder) {

    fontColor = fontColor || cc.color.WHITE;
    fontName = fontName || "";//Arial  FZZhunYuan-M02S  Founder
    width = width || 0;
    height = height || 0;
    zOrder = zOrder || 0;

    if (str === undefined) str = "";
    if (str === 0) str = "0";
    if (anchorXX === undefined) anchorXX = 0.5;
    if (anchorYY === undefined) anchorYY = 0.5;

    var label = cc.LabelTTF.create(str, fontName, fontSize);
    label.attr({
        anchorX: anchorXX,
        anchorY: anchorYY,
        x: xx,
        y: yy,
        color: fontColor
    });
    label.boundingWidth = width;
    label.boundingHeight = 0;
    //label.setSkewX(45);

    // 设置左对齐（C++上有用）
    label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);

    if (height > 0) {
        while (label.getContentSize().height > height) {
            label.setFontSize(--fontSize);
            if (fontSize <= 2)
                break;
        }
    }

    if (parentContent) {
        parentContent.addChild(label, zOrder);
    }

    return label;
};

/**
 * 描边文本
 * @param width     width == 0 无限长
 * @param height    height 多少都没用，无效果
 */
NumUnit.initLabelBlack = function (xx, yy, parentContent, fontSize, str, fontColor, fontName, width, height, anchorXX, anchorYY) {
    var label = NumUnit.initLabel(xx, yy, parentContent, fontSize, str, fontColor, fontName, width, height, anchorXX, anchorYY);
    label.enableStroke(cc.color.BLACK, 1);
    return label;
};

/**
 * 描边文本 (字体颜色fontColor，描边颜色mbcolor)
 */
NumUnit.initLabelColor = function (xx, yy, parentContent, fontSize, str, fontColor, mbcolor, fontName, width, height, anchorXX, anchorYY) {
    fontColor = fontColor || cc.color.WHITE;
    var label = NumUnit.initLabel(xx, yy, parentContent, fontSize, str, fontColor, fontName, width, height, anchorXX, anchorYY);
    label.enableStroke(mbcolor, 2);
    return label;
};

/**
 * 阴影文本
 */
NumUnit.initLabelBlackShadow = function (xx, yy, parentContent, fontSize, str, fontColor, fontName, width, height, anchorXX, anchorYY) {
    var label = NumUnit.initLabel(xx, yy, parentContent, fontSize, str, fontColor, fontName, width, height, anchorXX, anchorYY);
    label.enableShadow(cc.color(0, 0, 0, 200), cc.size(0, -2), 0);
    return label;
};

/**
 * 两色文本  (只有一行)
 * @param anchorXX 只能是 0, 0.5, 1  (默认 0)    // 0.5 是两字中间 非全部字的中间
 * @returns 返回前、后部分的 Label 数组
 */
NumUnit.initLabelTwoColor = function (xx, yy, parentContent, fontSize, str, fontColor, str2, fontColor2, anchorXX, anchorYY, fontName) {

    if (anchorXX === undefined) anchorXX = 0;
    if (anchorYY === undefined) anchorYY = 0;

    var txt = null;
    var txt2 = null;
    if (anchorXX == 0) {
        txt = NumUnit.initLabel(xx, yy, parentContent, fontSize, str, fontColor, fontName, 0, 0, 0, anchorYY);
        txt2 = NumUnit.initLabel(xx + txt.getContentSize().width, yy, parentContent, fontSize, str2, fontColor2, fontName, 0, 0, 0, anchorYY);
    } else if (anchorXX == 0.5) {
        txt = NumUnit.initLabel(xx, yy, parentContent, fontSize, str, fontColor, fontName, 0, 0, 1, anchorYY);
        txt2 = NumUnit.initLabel(xx, yy, parentContent, fontSize, str2, fontColor2, fontName, 0, 0, 0, anchorYY);
    } else if (anchorXX == 1) {
        txt2 = NumUnit.initLabel(xx, yy, parentContent, fontSize, str2, fontColor2, fontName, 0, 0, 1, anchorYY);
        txt = NumUnit.initLabel(xx - txt2.getContentSize().width, yy, parentContent, fontSize, str, fontColor, fontName, 0, 0, 1, anchorYY);
    }

    return [txt, txt2];
};

/**
 * 三段 两色文本  (只能左中对齐，且只有一行)
 * @returns txt
 */
NumUnit.initLabelThree = function (xx, yy, parentContent, fontSize, str1, str2, str3, fontColor1, fontColor2, fontColor3, fontName) {

    var txt = NumUnit.initLabel(xx, yy, parentContent, fontSize, str1, fontColor1, fontName, 0, 0, 0, 0.5);
    var txt2 = NumUnit.initLabel(txt.x + txt.getContentSize().width, yy, parentContent, fontSize, str2, fontColor2, fontName, 0, 0, 0, 0.5);
    var txt3 = NumUnit.initLabel(txt2.x + txt2.getContentSize().width, yy, parentContent, fontSize, str3, fontColor3, fontName, 0, 0, 0, 0.5);

    return [txt, txt2, txt3];
};

/**
 * 闪红光文本
 * @returns  Label
 */
NumUnit.initLabelLight = function (xx, yy, parentContent, fontSize, str, fontColor, fontName, width, height, anchorXX, anchorYY) {
    var txt = NumUnit.initLabel(xx, yy, parentContent, fontSize, str, fontColor, fontName, width, height, anchorXX, anchorYY);

    var color_action = cc.TintBy.create(0.8, 0, -255, -255);
    var color_back = color_action.reverse();
    var seq = cc.Sequence.create(color_action, color_back);
    txt.runAction(cc.RepeatForever.create(seq));

    return txt;
};

/**
 * BMFont文本
 * @param fontName  font.font_green_fnt
 * @returns {Label}
 */
NumUnit.initLabelBMF = function (xx, yy, parentContent, fontSize, str, fontName, anchorXX, anchorYY) {
    if (anchorXX === undefined) anchorXX = 0.5;
    if (anchorYY === undefined) anchorYY = 0.5;
    if (str === 0)
        str = "0";

    var txt = new cc.LabelBMFont(str, fontName);
    txt.anchorX = anchorXX;
    txt.anchorY = anchorYY;
    txt.scaleX = txt.scaleY = fontSize / 30;
    txt.setPosition(xx, yy);
    if (parentContent) {
        parentContent.addChild(txt);
    }

    return txt;
};

/**
 * 按宽度裁切文本
 * 返回设定宽度的 一定数量的字符 数组
 * @returns {Array}
 */
NumUnit.splitStr = function (str, width, fontName, fontSize) {
    fontName = fontName || font.font_name;

    var getWidth = function (str) {
        var tmpLabel = cc.LabelTTF.create(str, fontName, fontSize);
        return tmpLabel.getContentSize().width;
    };

    var c = str.length,
        i = 0,
        l = parseInt(width / fontSize, 10),
        lines = [];

    while (i < c) {
        var last = '';
        var current = '';

        while (true) {
            if (i + l > c) {
                break;
            }

            var s = str.substr(i, l);
            if (s.indexOf("\n") > 0) {
                l = s.indexOf("\n");
                str = str.replace(/\n/, "");
                break;
            }
            var w = getWidth(s);

            if (w != width) {
                if (w > width) {
                    current = '-';
                    l--;
                } else {
                    current = '+';
                    l++;
                }

                if (last && last != current) {
                    if (current == '+') {
                        l--;
                    }
                    break;
                }

                last = current;

            } else {
                break;
            }
        }

        lines.push(str.substr(i, l));
        i += l;
    }

    return lines;
};

/** 将数字转成三个一逗号 */
NumUnit.formatNum = function (n) {
    var b = parseInt(n).toString();
    var len = b.length;
    if (len <= 3) {
        return b;
    }
    var r = len % 3;
    return r > 0 ? b.slice(0, r) + "," + b.slice(r, len).match(/\d{3}/g).join(",") : b.slice(r, len).match(/\d{3}/g).join(",");
};

NumUnit.formatCurNum = function (num, len) {
    var temp = null;
    if (typeof (num) === "number") {
        temp = parseInt(n).toString();
    }
    var len = len || 0;
    var res;
    if (len == 0) {
        res = temp.replace(/\B(?=(?:\d{3})+\b)/g, ',');
    }
    return res;
};

/*从字符串中返回数字*/
NumUnit.onlyGetNum = function (txt) {
    var value = txt.toString().replace(/[^0-9]/ig, "");
    return parseInt(value);
};

/** 图片 sprite */
NumUnit.initImage = function (xx, yy, textureName, parentContent, index, anchorXX, anchorYY) {

    if (index === undefined)
        index = 0;
    if (anchorXX === undefined)
        anchorXX = 0.5;
    if (anchorYY === undefined)
        anchorYY = 0.5;

    if (typeof(textureName) === "string" && textureName.indexOf("#") >= 0) {
        var has = cc.spriteFrameCache.getSpriteFrame(textureName.slice(1));
        if(!has){
            cc.log("no found textureName: " + textureName);
            textureName = "#icon_di_1.png";
        }
    }

    var img = cc.Sprite.create(textureName);
    img.anchorX = anchorXX;
    img.anchorY = anchorYY;
    img.x = xx;
    img.y = yy;
    if (parentContent) {
        parentContent.addChild(img, index);
    }

    return img;
};

/**
 *  两图片合一
 *  scale 只缩小下层图
 */
NumUnit.initImageTwo = function (xx, yy, textureBottom, textureTop, parentContent, index, anchorXX, anchorYY, scale) {

    if (index === undefined)
        index = 0;
    if (scale === undefined)
        scale = 1;
    if (anchorXX === undefined)
        anchorXX = 0.5;
    if (anchorYY === undefined)
        anchorYY = 0.5;

    var img_bottom = null;
    if (typeof (textureBottom) === "string")
        img_bottom = cc.Sprite.create(textureBottom);
    else
        img_bottom = textureBottom;

    var img_top = null;
    if (typeof (textureTop) === "string")
        img_top = cc.Sprite.create(textureTop);
    else
        img_top = textureTop;

    var wid = img_bottom.width >= img_top.width ? img_bottom.width : img_top.width;
    var hei = img_bottom.height >= img_top.height ? img_bottom.height : img_top.height;

    var img = cc.Sprite.create();
    img.width = wid;
    img.height = hei;
    img.anchorX = anchorXX;
    img.anchorY = anchorYY;
    img.x = xx;
    img.y = yy;

    img_top.scale = scale;
    img_bottom.setPosition(wid / 2, hei / 2);
    img_top.setPosition(wid / 2, hei / 2);
    img.addChild(img_bottom);
    img.addChild(img_top);

    if (parentContent) {
        parentContent.addChild(img, index);
    }

    return img;
};

NumUnit.initNewBgBottom2 = function (parent, title, closeFunc, type, bshowRes) {

    if (bshowRes === undefined)
        bshowRes = 1;

    var bg = new BgLayer2(parent, title, closeFunc, type, bshowRes);
    parent.addChild(bg);

    return bg;
};

NumUnit.initNewBgPromt3 = function (parent, title, closeFunc, noShow, width, height, isTitleImg, isliang) {
    width = width || 846;
    height = height || 556;

    var bg = NumUnit.initScale9Sprite(WINSIZE.width/2, WINSIZE.height/2, width, height, parent, Scale9.SCALE_82);
    if (!noShow) {
        NumUnit.initImage(bg.width/2 - 40, bg.height/2, resPlist.bg_tc, bg);
    }
    var image = null;
    if(isliang)
        image = NumUnit.initImage(bg.width/2, bg.height, resPlist.gonggao2, bg, 3, 0.5, 1);
    else
        image = NumUnit.initScale9Sprite(bg.width / 2, bg.height, width, 47, bg, Scale9.SCALE_83, 3, .5, 1);
    NumUnit.initImage(image.width/2, image.height, resPlist.erji_xian1, image, 0, .5, 1);
    NumUnit.initImage(image.width/2, 0, resPlist.erji_xian2, image, 0, .5, 0);

    if(isTitleImg) {
        NumUnit.initImage(image.width / 2, image.height/2, title, image);
    } else {
        NumUnit.initLabel(image.width / 2, image.height/2, image, 23, title, cc.hexToColor("#cacaae"));
    }
    // var zuo = NumUnit.initImage(title_txt.x - title_txt.width/2 - 28, title_txt.y, resPlist.ui_ty_0054, image);
    // zuo.setScaleX(-1);
    // NumUnit.initImage(title_txt.x + title_txt.width/2 + 28, title_txt.y, resPlist.ui_ty_0054, image);

    if (!closeFunc) {
        closeFunc = function () {
            parent.removeFromParent();
        }
    }
    var bntClose = NumUnit.initButtonUI(resPlist.erji_but, resPlist.erji_but, closeFunc, parent);
    bntClose.setPosition(image.width - bntClose.width / 2, image.height - 23);
    bntClose.setName("btn_close_bg3");
    image.addChild(bntClose);

    return bg;
};

NumUnit.initSmallBgPromt = function (parent, title, closeFunc, width, height) {
    width = width || 497;
    height = height || 248;

    var bg = NumUnit.initScale9Sprite(WINSIZE.width/2, WINSIZE.height/2, width, height, parent, Scale9.SCALE_82);
    NumUnit.initScale9Sprite(bg.width / 2, bg.height / 2, width + 34, height + 34, bg, Scale9.SCALE_59);
    var image = NumUnit.initImage(bg.width / 2, bg.height - 18, resPlist.ui_ty_0053, bg, 1);
    var title_txt = NumUnit.initLabel(image.width / 2, image.height / 2, image, 26, title);
    var zuo = NumUnit.initImage(title_txt.x - title_txt.width/2 - 28, title_txt.y, resPlist.ui_ty_0054, image);
    zuo.setScaleX(-1);
    NumUnit.initImage(title_txt.x + title_txt.width/2 + 28, title_txt.y, resPlist.ui_ty_0054, image);

    if (!closeFunc) {
        closeFunc = function () {
            parent.removeFromParent();
        }
    }
    var bntClose = NumUnit.initButtonUI(resPlist.ui_ty_0050, resPlist.ui_ty_0051, closeFunc, parent);
    bntClose.setPosition(image.width - bntClose.width / 2, image.height - 23);
    image.addChild(bntClose);

    return bg;
};

/**
 * 物品、装备裁切外框
 * @param textureBottom // 底图（被遮罩） string || cc.Sprite
 * @param textureTop    // 表面图 可为 null  || string || cc.Sprite
 * @param textureMask   // 遮罩图 resPlist.team_frame_mask || resPlist.hun_mask || resPlist.bag_ma
 * @param scale         // 只对 textureBottom / img_bottomsk
 */
NumUnit.initClippingImage = function (xx, yy, textureBottom, textureTop, textureMask, parentContent, index, anchorXX, anchorYY, scale) {

    if (index === undefined)
        index = 0;
    if (anchorXX === undefined)
        anchorXX = 0.5;
    if (anchorYY === undefined)
        anchorYY = 0.5;
    if (scale === undefined)
        scale = 1;

    var img_bottom = null;
    if (typeof (textureBottom) === "string")
        img_bottom = cc.Sprite.create(textureBottom);
    else
        img_bottom = textureBottom;

    img_bottom.scale = scale;

    var wid = img_bottom.width;
    var hei = img_bottom.height;

    if (textureTop) {
        var img_top = null;
        if (typeof (textureTop) === "string")
            img_top = cc.Sprite.create(textureTop);
        else
            img_top = textureTop;

        wid = img_bottom.width >= img_top.width ? img_bottom.width : img_top.width;
        hei = img_bottom.height >= img_top.height ? img_bottom.height : img_top.height;
    }

    var img = cc.Node.create();
    img.width = wid;
    img.height = hei;
    img.anchorX = anchorXX;
    img.anchorY = anchorYY;
    img.x = xx;
    img.y = yy;

    // 裁切形状图
    var stencil = cc.Sprite.create(textureMask);
    stencil.setPosition(stencil.width / 2, stencil.height / 2);

    var clipper = cc.ClippingNode.create();
    clipper.attr({
        width: stencil.width,
        height: stencil.height,
        anchorX: 0.5,
        anchorY: 0.5,
        x: wid / 2,
        y: hei / 2
    });
    clipper.setAlphaThreshold(0);
    ////clipper.setInverted(true); // 显示裁切后的部分 true  或 裁切掉的部分 false

    clipper.setStencil(stencil);
    //clipper.addChild(stencil);

    img_bottom.setPosition(clipper.width / 2, clipper.width / 2);
    clipper.addChild(img_bottom);
    img.addChild(clipper);

    // 添加外框
    if (img_top) {
        img_top.setPosition(wid / 2, hei / 2);
        img.addChild(img_top);
    }

    if (parentContent) {
        parentContent.addChild(img, index);
    }

    return img;
};

/**
 *  弹窗底图，屏蔽下层点击，用于点击空白处关闭弹窗的地方
 *  textureName     string || cc.Node
 */
NumUnit.initPopupBg = function (xx, yy, textureName, parentContent, index, anchorXX, anchorYY) {
    if (index === undefined)
        index = 0;
    if (anchorXX === undefined)
        anchorXX = 0.5;
    if (anchorYY === undefined)
        anchorYY = 0.5;

    var bg = null;
    if (typeof (textureName) === "string")
        bg = cc.Sprite.create(textureName);
    else
        bg = textureName;

    bg.anchorX = anchorXX;
    bg.anchorY = anchorYY;
    bg.setPosition(xx, yy);
    if (parentContent) {
        parentContent.addChild(bg, index);
    }

    cc.eventManager.addListener(cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: function (touch, event) {
            var target = event.getCurrentTarget();
            var locationInNode = target.convertToNodeSpace(touch.getLocation());
            var s = target.getContentSize();
            var rect = cc.rect(0, 0, s.width * target.scaleX, s.height * target.scaleY);

            // 点击到背景框
            if (cc.rectContainsPoint(rect, locationInNode)) {
                return true;
            }
            return false;
        }
    }), bg);

    return bg;
};

NumUnit.showOperatePromt = function (parent, txt1, fun1, txt2, fun2, txt3, fun3, index) {
    if (txt1 === undefined)
        txt1 = "";
    if (txt2 === undefined)
        txt2 = "";
    if (txt3 === undefined)
        txt3 = "";
    if (index === undefined)
        index = 0;

    var layer = new BaseLayer();
    layer.onEase2 = true;
    layer.bgTouch = true;
    parent.addChild(layer, index);

    var fun_arr = [fun1, fun2, fun3];
    var yy = 65; // 260
    for (var l = 0; l < fun_arr.length; l++) {
        if (!fun_arr[l])
            continue;
        yy += 65;
    }

    var bg = NumUnit.initScale9Sprite(WINSIZE.width/2, WINSIZE.height/2, 296, yy, layer, Scale9.SCALE_61);
    NumUnit.initImage(bg.width / 2, bg.height - 20, resPlist.chat_23, bg);

    var txt_arr = [txt1, txt2, txt3];

    for (var i = 0, j = 0; i < fun_arr.length; i++) {
        if (!fun_arr[i])
            continue;

        var btn = NumUnit.initButtonUI(resPlist.btn_di_0006, resPlist.btn_di_0006, fun_arr[i], parent);
        btn.setPosition(bg.width/2, bg.height - 80 - 61 * j);
        btn.id = i + 1;
        btn.onClose = function () {
            layer.onClose();
        };

        NumUnit.initLabelBlack(btn.width/2, btn.height/2, btn, 22, txt_arr[i], null, null, null, null, 0.5, 0.5);
        bg.addChild(btn);

        j++;
    }

    return layer;
};

/**
 * 奖励信息
 * @param rewards [{itemid:xx, num:2}]
 */
NumUnit.showRewardGet = function (rewards) {
    if (!rewards)
        return;

    var itemData = [];
    for (var id in rewards) {
        var reward = rewards[id];
        var obj = {};
        var item = Config.taskItem[reward.itemid];
        obj.num = reward.num;
        if (!item) {
            obj.card = gamePlayer.cards[reward.itemid];
        } else {
            if (item.type == ItemType.equip && reward.quality) {
                obj.item = JSON.parse(JSON.stringify(item));
                obj.item.quality = reward.quality;
            } else {
                obj.item = item;
            }
        }

        itemData.push(obj);
    }

    if (itemData.length <= 0)
        return;

    var show = new ShowReward(itemData);
    cc.director.getRunningScene().addChild(show, 10);
};

/**
 * 获取掉落物品 data
 * @param dropid
 */
NumUnit.getDropReward = function (dropid) {
    var itemData = [];
    if (Config.dropItem2[dropid]) {
        for (var j = 0; j < Config.dropItem2[dropid].length; j++) {
            var dropitem = Config.dropItem2[dropid][j];
            var droptype = JSON.parse(dropitem.droptype);
            var dropval = JSON.parse(dropitem.dropval);
            var equipmentdesign = JSON.parse(dropitem.equipmentdesign);
            for (var k = 0; k < droptype.length; k++) {
                var obj = {};

                obj.item = Config.taskItem[droptype[k]];
                if (!obj.item) {
                    obj.card = gamePlayer.cards[droptype[k]];
                }

                if (dropval && dropval.length > k) {
                    obj.num = dropval[k];
                }

                if (equipmentdesign && equipmentdesign.length > k) {
                    var e = Config.equipmentdesign[equipmentdesign[k]];
                    if (e) {
                        obj.equipqualityrate = e.equipqualityrate;
                    }
                }

                itemData.push(obj);
            }
        }
    }
    itemData.sort(function (a, b) {
        if (!a.item)
            return 1;
        else if (!b.item)
            return -1;

        if (a.item.type > b.item.type)
            return -1;
        else if (a.item.type < b.item.type)
            return 1;
        else if (a.item.id < b.item.id)
            return -1;
        else
            return 1;
    });

    return itemData;
};

/**
 * 修正掉落数据 (见 NumUnit.getDropReward)
 * 对装备做处理
 * @param items
 */
NumUnit.onDropRewarData = function (items) {
    var item_arr = [];
    var eq = {};
    var card;
    var item;

    for (var i = 0; i < items.length; i++) {
        card = items[i].card;
        item = items[i].item;
        if (card)
            item_arr.push(items[i]);
        else {
            if (!item) {
                cc.log("error: itemid错误");
            } else if (item.type == ItemType.equip) {
                if (items[i].equipqualityrate) {
                    for (var n = 0; n < items[i].equipqualityrate.length; n++) {
                        if (!items[i].equipqualityrate[n])
                            continue;

                        var dd = JSON.parse(JSON.stringify(items[i]));
                        item = dd.item;
                        item.quality = n+1;

                        eq[item.quality] = dd;
                    }
                }
            } else {
                item_arr.push(items[i]);
            }
        }
    }

    for (var key in eq) {
        item_arr.push(eq[key]);
    }

    return item_arr;
};

/**
 * 道具icon + num + name  (见上 NumUnit.onDropRewarData)
 */
NumUnit.getItemIcon = function (data, scale, noNum) {
    var card = data.card;
    var item = data.item;
    var num = data.num;
    var icon_img = null;
    var name = "";
    var ww = 110;
    var hh = 125;

    if (!scale) {
        scale = 1;
    }

    var layout = new ccui.Layout();
    layout.setContentSize(cc.size(ww * scale, hh * scale));

    var node = new cc.Node();   // 因为 直接缩小 放到list里有问题
    node.setContentSize(ww, hh);
    node.setScale(scale);
    layout.addChild(node);

    if (card) {
        icon_img = NumUnit.initImage(node.width/2, node.height - 50, "#icon_000000" + card.configInfo.quality + "_wujiang.png", node);

        name = card.configInfo.name; //NumUnit.numToCHN(card.configInfo.quality) + "星武将";

    } else if (!item) {
        cc.log("error: itemid错误");
        return;

    } else if (item.type == ItemType.skilling || item.type == ItemType.skilled) {        // 未完成的技能（10%）
        var skillId = item.relation;
        var skill = Config.skill[skillId];
        if(!skill){
            cc.log("error: skillid " + skillId);
            return layout;
        }
        var quality = skill.quality;
        var qualityTxt = "#skill_tong.png";
        if(quality == 5){
            qualityTxt = "#skill_jin.png";
        }else if(quality == 4){
            qualityTxt = "#skill_yin.png";
        }
        icon_img = NumUnit.initImage(node.width/2, node.height - 50, qualityTxt, node);
        if (cc.spriteFrameCache.getSpriteFrame(item.icon + ".png")) {
            NumUnit.initImage(icon_img.width/2, icon_img.height/2, "#" + item.icon + ".png", icon_img);
        }

        name = item.name;

    } else if (item.type == ItemType.equip) {
        if (!cc.spriteFrameCache.getSpriteFrame(item.icon + ".png")) {
            NumUnit.initLabel(node.width/2, node.height - 50, node, 16, item.icon + ".png");
        } else {
            NumUnit.initImage(node.width/2, node.height - 50, resPlist.kuang_bg, node);
            NumUnit.initImage(node.width/2, node.height - 50, resPlist.outsitecity_22, node, 1);
            NumUnit.initImage(node.width/2, node.height - 50, cc.formatStr("#kuang_pinzhi_%s.png", item.quality), node, 2);
        }
        name = TypeConst.colorName[item.quality];

    } else {
        if (!cc.spriteFrameCache.getSpriteFrame(item.icon + ".png")) {
            NumUnit.initLabel(node.width/2, node.height - 50, node, 16, item.icon + ".png");
        } else {
            NumUnit.initImage(node.width/2, node.height - 50, resPlist.kuang_bg, node);
            NumUnit.initImage(node.width/2, node.height - 50, cc.formatStr("#%s.png", item.icon), node, 1);
            NumUnit.initImage(node.width/2, node.height - 50, cc.formatStr("#kuang_pinzhi_%s.png", item.quality), node, 2);
        }
        name = item.name;
    }

    if (item && item.type == ItemType.equip) {

    } else if (num > 0 && !noNum) {
        var txt = NumUnit.initLabelBlack(node.width - 10, 30, node, 18, num, null, null, 0, 0, 1, 0);
        txt.setLocalZOrder(4);
    }

    NumUnit.initLabel(node.width / 2, 12, node, 18, name);

    return layout;
};

/**
 * 9 宫格
 */
NumUnit.initScale9Sprite = function (xx, yy, wid, hei, parentContent, type, index, anchorXX, anchorYY) {
    if (type === undefined)
        type = 1;
    if (index === undefined)
        index = 0;
    if (anchorXX === undefined)
        anchorXX = 0.5;
    if (anchorYY === undefined)
        anchorYY = 0.5;

    var img = null;
    switch (type) {
        case 1:
            img = cc.Scale9Sprite.createWithSpriteFrameName("btn_di_20.png", cc.rect(0, 0, 44, 35));
            break;
        default :
            //img = cc.Scale9Sprite.create(res.aboard_touming, cc.rect(2, 2, 2, 2));
            cc.error("error: cc.Scale9Sprite type is no found....." + type);
            break;
    }

    // if (!img) {
    //     img = cc.Scale9Sprite.create(res.aboard_touming, cc.rect(2, 2, 2, 2));
    //     cc.error("error: cc.Scale9Sprite type is no found....." + type);
    // }

    img.width = wid;
    img.height = hei;
    img.anchorX = anchorXX;
    img.anchorY = anchorYY;

    img.setPosition(xx, yy);

    if (parentContent) {
        parentContent.addChild(img, index);
    }

    return img;
};

/**
 * 颜色点击
 */
NumUnit.initTouchColor = function (xx, yy, textureName, parentContent, callback, targe) {
    if (!targe) {
        targe = parentContent;
    }

    var icon = NumUnit.initImage(xx, yy, textureName, parentContent);

    var isTouch = false;
    cc.eventManager.addListener(cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: function (touch, event) {
            var target = event.getCurrentTarget();
            var location = target.convertToNodeSpace(touch.getLocation());
            isTouch = false;

            if (cc.sys.isNative) {
                if (cc.rectContainsPoint(cc.rect(0, 0, target.width, target.height), location)) {
                    var color = target.getPixelColor(location.x, location.y);
                    isTouch = color.a > 0;
                }
            } else {
                if (cc.rectContainsPoint(cc.rect(0, 0, target.width, target.height), location)) {
                    isTouch = true;
                }
            }

            return isTouch;
        },
        onTouchEnded: function (touch, event) {
            if (!isTouch)
                return;

            var target = event.getCurrentTarget();
            var location = target.convertToNodeSpace(touch.getLocation());
            var back = false;

            if (cc.sys.isNative) {
                if (cc.rectContainsPoint(cc.rect(0, 0, target.width, target.height), location)) {
                    var color = target.getPixelColor(location.x, location.y);
                    back = color.a > 0;
                }
            } else {
                if (cc.rectContainsPoint(cc.rect(0, 0, target.width, target.height), location)) {
                    back = true;
                }
            }

            if (back && callback)
                callback.call(targe, target);
        }
    }), icon);

    return icon;
};


NumUnit.initNode = function(size, xx, yy, parent, zorder,anchorX, anchorY){
    if(anchorX === undefined)
        anchorX = .5;
    if(anchorY === undefined)
        anchorY = .5;
    if(zorder === undefined)
        zorder = 0;

    var node = new cc.Node();
    node.setContentSize(size);
    node.setAnchorPoint(anchorX, anchorY);
    node.setPosition(xx, yy);
    if(parent){
        parent.addChild(node, zorder);
    }
    return node;
};
//type1伐木,2粮食,3炼铁，4采石   bnt目标  type飘起类型
NumUnit.promptsTps = function (str, imagetype, bnt, type) {


    var bg = null;
    if (type == 1) {
        if (typeof(str) !== "string")
            return;
        if (str.length <= 0)
            return;

        var txt = NumUnit.initLabel(0, 0, null, 21, str, gameColor.country_shouge);
        txt.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        var ww = 468;
        if (txt.width > 240) {
            ww = ww - 240 + txt.width;
        }
        if (imagetype == 0) {
            bg = NumUnit.initImage(0, 0, resPlist.ui_mucai, null);

        } else if (imagetype == 1) {
            bg = NumUnit.initImage(0, 0, resPlist.ui_liangcao, null);

        } else if (imagetype == 2) {
            bg = NumUnit.initImage(0, 0, resPlist.ui_tiekuang, null);

        } else if (imagetype == 3) {
            bg = NumUnit.initImage(0, 0, resPlist.ui_shiliao, null);
        }
        var pos = bnt.convertToWorldSpace(cc.p(0, 0));//当前坐标转化为世界坐标
        bg.setPosition(pos.x, pos.y);

        cc.director.getRunningScene().addChild(bg);
        txt.setPosition(bg.width + 15, bg.height / 2);
        bg.addChild(txt);
        var action = cc.moveTo(0.3, pos.x, pos.y + 130);
        var delay = cc.delayTime(1.0);
        //var f4 = cc.fadeOut(0.2);
        var fun = cc.callFunc(function () {
            bg.removeFromParent();
        }, this);

        bg.runAction(cc.sequence(action, delay, fun));
    } else if (type == 2) {

        var node = new cc.Node();
        node.setPosition(WINSIZE.width / 2, WINSIZE.height / 2);
        cc.director.getRunningScene().addChild(node, 11);

        var delay = cc.delayTime(0.4);
        var delay2 = cc.delayTime(3);
        var fun = cc.callFunc(function () {
            NumUnit.addEffectJson(0, 0, node, "lq", "lqcg", 4, 1);
        }, this);

        var grow = new cc.ParticleSystem("res/effect/sparkles.plist");
        grow.positionType = cc.ParticleSystem.TYPE_RELATIVE;
        grow.setPosition(0, 0);
        node.addChild(grow, 3);

        var tail = new cc.ParticleSystem("res/effect/spin.plist");
        tail.positionType = cc.ParticleSystem.TYPE_RELATIVE;
        tail.setPosition(0, 0);
        node.addChild(tail, 3);

        node.runAction(cc.sequence(delay, fun, delay2, cc.removeSelf()));
    }
};

NumUnit.addParticle = function (target, xx, yy, name) {
    var effect = new cc.ParticleSystem(name);
    effect.setPosition(xx, yy);
    effect.positionType = cc.ParticleSystem.TYPE_RELATIVE;
    target.addChild(effect);

    return effect;
};

/**
 * 提示信息条 string | node
 * @param str
 * @param color 字体颜色
 * @param bg_type 底图类型
 * @returns {*}
 */
NumUnit.prompts = function (str, color, bg_type) {
    if(str == undefined){
        return str;
    }

    color = color || gameColor.yellow02;
    var res = "#ui_ty_0029.png";
    if(bg_type == 1)
        res = "#bg_tc_2.png";

    var txt = "";
    if(str instanceof Array){
        txt = str.shift().toString();
    }else{
        txt = str;
    }
    if (typeof(txt) === "string") {
        txt = NumUnit.initLabel(0, 0, null, 21, txt, color);
        txt.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
    }

    var ww = 468;
    if (txt.width > 240) {
        ww = ww - 240 + txt.width;
    }
    var bg = NumUnit.initButtonUI(res, res, function () {
        bg.removeFromParent();
    }, this);
    bg.setScale9Enabled(true);
    if(bg_type == 1) {
        bg.setCapInsets(cc.rect(10, 10, 10, 10));
        bg.setContentSize(ww, 55);
    } else {
        bg.setCapInsets(cc.rect(160, 0, 140, 33));
        bg.setContentSize(ww, 33);
    }
    bg.setPosition(WINSIZE.width / 2, WINSIZE.height / 2);
    cc.director.getRunningScene().addChild(bg);

    txt.setPosition(bg.width / 2, bg.height / 2);
    bg.addChild(txt);

    var action = cc.moveTo(0.3, WINSIZE.width / 2, WINSIZE.height - 100);
    var delay = cc.delayTime(2.7);
    var fun = cc.callFunc(function () {

        bg.removeFromParent();
        if(str instanceof Array){
            if(str.length){
                NumUnit.prompts(str);
            }
        }

    }, this);

    bg.runAction(cc.sequence(action, delay, fun));

};

/**
 * 提示信息条 string | node
 * @param str
 * @param color 字体颜色
 * @param bg_type 底图类型
 * @param str2
 * @param color2 字体颜色
 * @returns {*}
 */
NumUnit.prompts2 = function (str, color, bg_type, str2, color2) {
    if(str == undefined){
        return str;
    }

    color = color || gameColor.yellow02;
    color2 = color2 || gameColor.yellow02;
    var res = "#ui_ty_0029.png";
    if(bg_type == 1)
        res = "#bg_tc_2.png";

    var ww = 468;
    var bg = NumUnit.initButtonUI(res, res, function () {
        bg.removeFromParent();
    }, this);
    bg.setScale9Enabled(true);
    if(bg_type == 1) {
        bg.setCapInsets(cc.rect(10, 10, 10, 10));
        bg.setContentSize(ww, 55);
    } else {
        bg.setCapInsets(cc.rect(160, 0, 140, 33));
        bg.setContentSize(ww, 33);
    }
    bg.setPosition(WINSIZE.width / 2, WINSIZE.height / 2);
    cc.director.getRunningScene().addChild(bg);

    var txt = NumUnit.initLabelTwoColor(bg.width/2, bg.height/2, bg, 21, str, color, "    " + str2, color2, 0.5, 0.5);

    var action = cc.moveTo(0.3, WINSIZE.width / 2, WINSIZE.height - 100);
    var delay = cc.delayTime(2.7);
    var fun = cc.callFunc(function () {

        bg.removeFromParent();
        if(str instanceof Array){
            if(str.length){
                NumUnit.prompts(str);
            }
        }

    }, this);

    bg.runAction(cc.sequence(action, delay, fun));

};

/**
 *  提示弹窗
 */
NumUnit.confirm = function (title, msg, targe, func, showCancelBtn, cancelFunc) {

    cancelFunc = cancelFunc || null;

    if (showCancelBtn === undefined)
        showCancelBtn = false;

    var confirm = new Confirm(title, msg, targe, func, showCancelBtn, cancelFunc);
    cc.director.getRunningScene().addChild(confirm, 200);
    return confirm;
};

/**
 *  提示弹窗(系统用 比Loading.add 更高层)
 */
NumUnit.confirm2 = function (title, msg, targe, func, showCancelBtn, cancelFunc) {
    var confirm = NumUnit.confirm(title, msg, targe, func, showCancelBtn, cancelFunc);
    confirm.setLocalZOrder(255);

    return confirm;
};

/**
 * 给文本加空格(适配宽度)
 */
NumUnit.getStrSpace = function (txt, fontSize, width, fontName) {
    fontName = fontName || font.font_name;

    var getWidth = function (str) {
        var tmpLabel = cc.LabelTTF.create(str, fontName, fontSize);
        return tmpLabel.getContentSize().width;
    };

    var ww = width * 0.8;
    var w1 = getWidth(txt);
    if (w1 >= ww)
        return txt;

    var arr = txt.split("");
    arr.unshift("");
    var len = arr.length;

    var txt1 = txt, txt2 = null;
    while (true) {
        for (var i = 0; i < len; i++) {
            arr[i] += " ";
        }
        txt2 = arr.join("");
        var w2 = getWidth(txt2);
        if (w2 > ww) {       // 当匹配到大于目标宽度时,使用上一次的文本
            return txt1;
        }

        txt1 = txt2;
    }
};

/**
 *  给秒数 获取时间  reutrn "00:00"
 */
NumUnit.getTimeString = function (time) {
    if (time < 0)
        return 0;

    var tm = Math.floor(time / 60);
    var ts = Math.floor(time % 60);
    var str = tm < 10 ? "0" + tm : tm;
    str += ":";
    str += ts < 10 ? "0" + ts : ts;

    return str;
};

/**
 *  给秒数 获取时间  return "00:00:00"
 */
NumUnit.getHourString = function (time, type) {
    if (time < 0)
        time = 0;

    var str = "";
    var th = Math.floor(time / 3600);
    var tm = Math.floor((time % 3600) / 60);
    var ts = Math.floor((time % 3600) % 60);
    if (th < 10) th = "0" + th;
    if (tm < 10) tm = "0" + tm;
    if (ts < 10) ts = "0" + ts;
    if (type == undefined) {
        str = th + ":" + tm + ":" + ts;
    } else if (type == 1) {
        str = cc.formatStr(LANSTR.timeShow, th, tm, ts);
    } else if (type == 2) {
        str = th + ":" + tm;
    } else if (type == 3) {
        str = tm + ":" + ts;
    }
    return str;
};

/**
 *  给毫秒数 获取毫秒级时间  return "00:00:00"
 *  注：time < 3600秒
 */
NumUnit.getMilliString = function (time, type) {
    if (time < 0)
        time = 0;

    var ss = Math.floor(time / 1000);       // 秒
    var mill = Math.floor(time % 1000);     // 毫秒

    var th = Math.floor(ss / 3600);
    var tm = Math.floor((ss % 3600) / 60);
    var ts = Math.floor((ss % 3600) % 60);
    var tms = Math.floor(mill / 1000 * 100);
    if (th < 10) th = "0" + th;
    if (tm < 10) tm = "0" + tm;
    if (ts < 10) ts = "0" + ts;
    if (tms < 10) tms = "0" + tms;

    if (type == 1) {
        return th + ":" + tm + ":" + ts;
    } else if (type == 2) {
        return tm + ":" + ts;
    }

    return tm + ":" + ts + ":" + tms;
};

/**
 *  给时间搓 获取时间  return "00:00:00"
 */
NumUnit.getHourAll = function (time, type) {
    if (time < 0)
        return 0;

    var allTime = new Date(time);
    var hh = allTime.getHours();
    var mm = allTime.getMinutes();
    var ss = allTime.getSeconds();

    hh = hh < 10 ? ("0" + hh) : hh;
    mm = mm < 10 ? ("0" + mm) : mm;
    ss = ss < 10 ? ("0" + ss) : ss;

    var str = "";
    if (type == undefined)
        str = hh + ":" + mm + ":" + ss;
    else if (type == 1)
        str = hh + ":" + mm;
    else if (type == 2)
        str = hh;

    return str;
};
/**
 *  给时间搓 获取年月日  return "00-00-00"
 */
NumUnit.getYMD = function (time, type) {
    if (time < 0)
        return 0;

    var allTime = new Date(time);
    var tYear = allTime.getFullYear();
    var tMou = allTime.getMonth() + 1;
    var tDay = allTime.getDate();
    var tH = allTime.getHours();
    var tM = allTime.getMinutes();
    var tS = allTime.getSeconds();
    var str;
    if (type == undefined) {
        str = tYear + "-" + tMou + "-" + tDay;
    } else if (type == 1) {
        tMou = tMou < 10 ? ("0" + tMou) : tMou;
        tDay = tDay < 10 ? ("0" + tDay) : tDay;
        tH = tH < 10 ? ("0" + tH) : tH;
        tM = tM < 10 ? ("0" + tM) : tM;
        str = tYear + "-" + tMou + "-" + tDay + " " + tH + ":" + tM;
    } else if (type == 2) {
        tH = tH < 10 ? ("0" + tH) : tH;
        tM = tM < 10 ? ("0" + tM) : tM;
        tS = tS < 10 ? ("0" + tS) : tS;
        str = tYear + LANSTR.years + tMou + LANSTR.month + tDay + LANSTR.day + tH + ":" + tM + ":" + tS;
    } else if (type == 3) {
        tH = tH < 10 ? ("0" + tH) : tH;
        tM = tM < 10 ? ("0" + tM) : tM;
        tS = tS < 10 ? ("0" + tS) : tS;
        str = tYear + "/" + tMou + "/" + tDay + "  " + tH + ":" + tM + ":" + tS;
    } else if (type == 4) {
        tH = tH < 10 ? ("0" + tH) : tH;
        tM = tM < 10 ? ("0" + tM) : tM;
        tS = tS < 10 ? ("0" + tS) : tS;
        str = tYear + LANSTR.years + tMou + LANSTR.month + tDay + LANSTR.day;
    } else if(type == 5) {
        tH = tH < 10 ? ("0" + tH) : tH;
        tM = tM < 10 ? ("0" + tM) : tM;
        tS = tS < 10 ? ("0" + tS) : tS;
        str = tMou + "-" + tDay + " " + tH + ":" + tM + ":" + tS;
    } else if (type == 6) {
        tMou = tMou < 10 ? ("0" + tMou) : tMou;
        tDay = tDay < 10 ? ("0" + tDay) : tDay;
        tH = tH < 10 ? ("0" + tH) : tH;
        tM = tM < 10 ? ("0" + tM) : tM;
        tS = tS < 10 ? ("0" + tS) : tS;
        str = tYear + "-" + tMou + "-" + tDay + " " + tH + ":" + tM + ":" + tS;
    }


    return str;
};


/**
 * 字符串开头匹配
 * @param str       要匹配的字符串
 * @param startStr  开头字符串
 * @returns {boolean}
 */
NumUnit.startWith = function (str, startStr) {
    var reg = new RegExp("^" + startStr);
    return reg.test(str);
};


/**
 * 通过角度 获取圆上的坐标
 * @param point 圆心
 * @param r     圆的半径
 * @param du    半径的旋转度数
 * @returns {cc.Point}
 */
NumUnit.getPointByDu = function (point, r, du) {
    var fDushu = du * Math.PI / 180.0;

    var x = (point.x + r * Math.cos(fDushu));
    var y = (point.y + r * Math.sin(fDushu));

    var pos = cc.p(x, y);
    return pos;
};

/**
 * 帧动画 （默认只循环一次）
 * @param name  纹理名
 * @param num   数量 | 数组[起始数字,结束数字,位数]
 * @param times 循环次数
 * @param per 每帧播放时间
 * @param callback 回调
 */
NumUnit.addEffect = function (xx, yy, targe, name, num, times, per, callback, isRestoreOriginalFrame) {
    if (!times && times !== 0)
        times = 1;
    if (!per)
        per = 0.05;
    if (undefined === isRestoreOriginalFrame)
        isRestoreOriginalFrame = true;

    var sprite;
    if (typeof num === 'number') {
        sprite = NumUnit.initImage(xx, yy, "#" + name + "0001.png", targe);
        var sa = cc.Animation.create();
        for (var i = 1; i <= num; i++) {
            var nn = i < 10 ? "000" + i : "00" + i;
            var frameName1 = name + nn + ".png";
            sa.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(frameName1));
        }
    } else {
        var start = num[0];
        var end = num[1];
        var mm = 1;
        for(var j = 0; j < num[2]; j++) {
            mm *= 10;
        }
        var m1 = (mm + start).toString().slice(1, num[2] + 1);
        sprite = NumUnit.initImage(xx, yy, "#" + name + m1 + ".png", targe);
        var sa = cc.Animation.create();
        for (var i = start; i <= end; i++) {
            var nn = (mm + i).toString().slice(1, num[2] + 1);
            var frameName1 = name + nn + ".png";
            sa.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(frameName1));
        }
    }

    sa.setDelayPerUnit(per);
    sa.setRestoreOriginalFrame(isRestoreOriginalFrame);

    var func = cc.callFunc(function () {
        if (callback)
            callback.call(targe);
        sprite.removeFromParent();
        sprite = null;
    }, targe);

    var seq = null;
    if (times == 0) {
        seq = cc.repeatForever(cc.animate(sa));
    } else {
        var repeat = cc.repeat(cc.animate(sa), times);
        seq = cc.sequence(repeat, func);
    }
    sprite.runAction(seq);

    return sprite;
};

/**
 * json 动画 (loop == 1 循环一次)
 */
NumUnit.addEffectJson = function (xx, yy, targe, name, name2, zOrder, loop) {
    if (zOrder === undefined)
        zOrder = 0;
    if (name2 === undefined)
        name2 = name;

    if (!NumUnit.effects[name]) {
        NumUnit.effects[name] = name;
        ccs.armatureDataManager.addArmatureFileInfo("res/effect/" + name + ".json");
    }

    var pAr = new ccs.Armature(name);
    if (loop == 1) {
        pAr.getAnimation().play(name2, -1, 0);
    } else {
        pAr.getAnimation().play(name2);
    }
    pAr.setPosition(xx, yy);
    targe.addChild(pAr, zOrder);

    return pAr;
};
NumUnit.effects = {};

/**
 * 获取最大帧数
 * @param name
 * @returns {number}
 */
NumUnit.getMaxFrameNum = function (name) {
    if (NumUnit.MAX_FRAME[name])
        return NumUnit.MAX_FRAME[name];

    for (var i = 1; i < 99; i++) {
        var num = (10000 + i).toString();
        num = num.substr(1, num.length - 1);

        var newFrame = name + num + ".png";
        if (!cc.spriteFrameCache.getSpriteFrame(newFrame)) {
            NumUnit.MAX_FRAME[name] = i - 1;
            return i - 1;
        }
    }
};
NumUnit.MAX_FRAME = {};

/**
 *  创建UI
 *  没有 addChild
 */
NumUnit.initButtonUI = function (normal, selected, callback, targe, disabled, callback2, callbackEndFunc) {
    if (!disabled)
        disabled = "";

    if (typeof(normal) === "string" && normal.indexOf("#") >= 0) {
        var has = cc.spriteFrameCache.getSpriteFrame(normal.slice(1));
        if(!has){
            cc.log("no found textureName: " + normal);
            normal = "#icon_di_1.png";
        }
    }
    if (typeof(selected) === "string" && selected.indexOf("#") >= 0) {
        var has = cc.spriteFrameCache.getSpriteFrame(selected.slice(1));
        if(!has){
            cc.log("no found textureName: " + selected);
            selected = "#icon_di_1.png";
        }
    }

    var uiButton = new ccui.Button();

    var texType = ccui.Widget.LOCAL_TEXTURE;
    if (normal[0] === "#") {
        texType = ccui.Widget.PLIST_TEXTURE;
        normal = normal.substr(1, normal.length - 1);
        selected = selected.substr(1, selected.length - 1);
        if (disabled.length > 0)
            disabled = disabled.substr(1, disabled.length - 1);
    }

    // 支持长按
    uiButton.target2 = targe;
    uiButton.callback2 = callback2;
    uiButton.callbackEndFunc = callbackEndFunc;
    uiButton.isPress = false;

    uiButton.loadTextures(normal, selected, disabled, texType);
    var touchEvent = function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                if (sender.callback2 && typeof (sender.callback2) == "function") {
                    sender.onPress = function (t) {
                        this.isPress = false;
                        this.callback2.call(this.target2, this);
                    };
                    sender.scheduleOnce(sender.onPress, 0.5);
                    sender.isPress = true;
                }
                break;
            case ccui.Widget.TOUCH_MOVED:
                if (sender.callback2 && typeof (sender.callback2) == "function" && sender.isPress) {
                    sender.isPress = !(cc.pDistance(sender.getTouchBeganPosition(), sender.getTouchMovePosition()) >= 6.0);
                    if (!sender.isPress) {
                        sender.unschedule(sender.onPress);
                    }
                }
                break;
            case ccui.Widget.TOUCH_ENDED:
                if (sender.callback2 && typeof (sender.callback2) == "function") {
                    if (sender.isPress) {
                        sender.unschedule(sender.onPress);
                        sender.isPress = false;
                    }else{
                        if (sender.callbackEndFunc && typeof (sender.callbackEndFunc) == "function") {
                            sender.callbackEndFunc.call(sender.target2, sender);
                        }
                        break;
                    }
                }
                if (callback) {
                    callback.call(targe, sender);
                } else {
                    NumUnit.prompts("回调不存在..." + normal);
                }
                break;
            case ccui.Widget.TOUCH_CANCELED:
                if (sender.callbackEndFunc && typeof (sender.callbackEndFunc) == "function") {
                    sender.callbackEndFunc.call(sender.target2, sender);
                }
                break;
            default:
                break;
        }
    };

    uiButton.addTouchEventListener(touchEvent, targe);
    return uiButton;
};

/**
 * 在其它时区，获取服务器时间
 * @returns {Date}
 */
NumUnit.getServerTimeByZone = function () {
    var serverTime = Cache.getServerTime() + Cache.timezoneOffset * 1000 + new Date().getTimezoneOffset() * 60000;
    return new Date(serverTime);
};

/**
 * 获取元件绝对位置
 * @param view
 * @returns {*}
 */
NumUnit.getRealPosintionInScreen = function (view) {
    if (view == null) {
        return null;
    }
    var rtn = {x: 0, y: 0};
//
//    while(view!=null){
//        rtn.x += view.x;
//        rtn.y += view.y;
//        view = view.getParent();
//    }

    return view.convertToWorldSpace(view.getPosition());
};

/**
 * 编辑框 输入框
 * @param type          底框类型
 * @param size          底框大小
 * @param placeholder   初始文字
 * @param maxlenh       最大长度
 * @param inputflag     是否变密码 boolen  || >0
 * @param color1        设置提示字体的颜色
 * @param bedit         是否可以在原文本继续编辑
 * @returns {cc.EditBox}
 */
NumUnit.initEditbox = function (father, type, xx, yy, size, placeholder, fontsize, maxlenh, zz, inputflag, color, color1, bedit) {
    zz = zz || 0;

    var txt = null;
    if (type == EDITBOX.BOX_2)
        txt = new cc.EditBox(size, cc.Scale9Sprite.create(res.aboard_touming, cc.rect(2, 2, 2, 2)));
    if (type == EDITBOX.BOX_3)
        txt = new cc.EditBox(size, cc.Scale9Sprite.createWithSpriteFrameName("shrukuang_9g.png", cc.rect(2, 2, 2, 2)));
    else if(type == EDITBOX.BOX_4)
        txt = new cc.EditBox(size, cc.Scale9Sprite.createWithSpriteFrameName("chat_11.png", cc.rect(6, 7, 34, 34)));


    if (color == undefined)
        color = cc.color.BLACK;
    if (color1 == undefined)
        color1 = cc.color.GRAY;
    txt.setPlaceholderFont(font.font_name, fontsize);
    if(bedit)
        txt.setString(placeholder);
    else
        txt.setPlaceHolder(placeholder);
    txt.setPlaceholderFontColor(color1);
    txt.setFont(font.font_name, fontsize);
    txt.setPosition(xx, yy);
    txt.setFontColor(cc.color.WHITE);
    txt.setFontColor(color);
    txt.setDelegate(this);
    txt.setMaxLength(maxlenh);
    txt.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
    txt.setReturnType(cc.KEYBOARD_RETURNTYPE_DONE);
    if (inputflag)
        txt.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
    else
        txt.setInputFlag(cc.EDITBOX_INPUT_FLAG_SENSITIVE);
    father.addChild(txt, zz);
    return txt;
};

/**
 * 显示延迟几秒后消失
 */
NumUnit.initFadein = function (target, type) {

    var moveBy = cc.moveBy(0.6, cc.p(0, 150));
    var moveBy1 = cc.moveBy(0.6, cc.p(0, 150));
    target.setOpacity(255);
    var action = cc.fadeOut(0.5);
    var remove = cc.callFunc(function () {
        target.removeFromParent();
    }, this);
    target.runAction(cc.sequence(moveBy, cc.spawn(moveBy1, action), remove));
};

/**
 * 置灰
 * @param fileName  string || cc.Sprite
 * @returns {cc.Sprite}
 */
NumUnit.getGraySprite = function (fileName) {
    var dis = null;
    if (typeof(fileName) === "string")
        dis = cc.Sprite.create(fileName);
    else
        dis = fileName;

    Filter.setGray(dis);

    return dis;
};

/**
 * 置灰
 * @param 九宫格精灵
 * @returns {cc.Sprite}
 */
NumUnit.getGraySpriteByScale9 = function (xx, yy, spriteRes, baseWidth, baseHeight, endWidth, endHeight, parent, zorder) {
    var res = "";
    if(spriteRes && spriteRes[0] == "#"){
        res = spriteRes.replace("#", "");
    }else{
        res = spriteRes;
    }

    if(!zorder){
        zorder = 0;
    }

    var dis = cc.Scale9Sprite.createWithSpriteFrameName(res, cc.rect(0, 0, baseWidth, baseHeight));
    dis.anchorX = .5;
    dis.anchorY = .5;
    dis.width = endWidth;
    dis.height = endHeight;
    dis.x = xx;
    dis.y = yy;

    Filter.setGray(dis);
    parent.addChild(dis, zorder);
    return dis;
};

/**
 * shader 还原
 * @param sprite
 */
NumUnit.resetShaderSprite = function (sprite) {
    Filter.resetShader(sprite);
};

/**
 * 高亮
 * @param fileName  string || cc.Sprite
 * @returns {cc.Sprite}
 */
NumUnit.getLightSprite = function (fileName) {
    var dis = null;
    if (typeof(fileName) === "string")
        dis = cc.Sprite.create(fileName);
    else
        dis = fileName;

    Filter.setLight(dis);

    return dis;
};

/**
 * 高斯模糊
 * @param fileName  string || cc.Sprite
 * @returns {cc.Sprite}
 */
NumUnit.getGaussSprite = function (fileName) {
    var dis = null;
    if (typeof(fileName) === "string")
        dis = cc.Sprite.create(fileName);
    else
        dis = fileName;

    Filter.setGaussBlurs(dis);

    return dis;
};

/**
 * 流光
 * @param fileName  string || cc.Sprite
 * @returns {cc.Sprite}
 */
NumUnit.getFluxaySprite = function (fileName) {
    var dis = null;
    if (typeof(fileName) === "string")
        dis = cc.Sprite.create(fileName);
    else
        dis = fileName;

    Filter.setFluxay(dis);

    return dis;
};

/**
 * 检查敏感字符
 * @param test
 * @returns {boolean}
 */
NumUnit.matchSensitiveWord = function (test) {
    for (var i = 0; i < Config.sensitive_word.length; i++) {
        if (test.indexOf(Config.sensitive_word[i]) > -1) {
            return true;
        }
    }

    return false;
};

/**
 * 替换emoji表情符号
 * @param text
 */
NumUnit.replaceEmojiCharacter = function (text) {

    // Split on surrogate pairs, and preserve the surrogates; this will give
    // you an array that alternates between BMP text and a single surrogate
    // pair: [text, emoji, text, emoji, text...]
    var chunks = text.split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/);

    // A DocumentFragment is a DOM tree that can be manipulated freely without
    // causing a reflow, so it's more performant for heavy tree-building and a
    // good habit to get into
    var rValue = "";

    for (var i = 0, l = chunks.length; i < l; i++) {
        if (i % 2 == 0) {
            // Even-numbered chunks are plain text
            rValue += chunks[i];
        }
        else {
            // Odd-numbered chunks are surrogate pairs
            // We have TWO characters, but we want one codepoint; this is how
            // you decode UTF-16  :(
            var pair = chunks[i];
            var codepoint = (
                0x10000
                | ((pair.charCodeAt(0) - 0xD800) << 10)
                | (pair.charCodeAt(1) - 0xDC00)
            );
            var hex = codepoint.toString(16);  // now it's in hex
            rValue += "?";
        }
    }
    //去除回车和换行
    rValue = rValue.replace(/[\r\n]/g, "");
    return rValue;
};

/**
 * 添加触摸
 * @param  bg bg
 */
NumUnit.addTouchEvent = function (bg, target, touchEvent) {
    cc.eventManager.addListener(cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: false,
        onTouchBegan: function (touches, event) {
            return true;
        },
        onTouchEnded: function (touches, event) {
            var delta = touches.getLocation();
            if (!cc.rectContainsPoint(bg.getBoundingBox(), delta)) {
                touchEvent.call(target);
            }
        }
    }), target);

};

/**
 *  @parentNode : 父节点
 *  @size : 区域
 *
 *  direction: true水平 false 垂直
 */

NumUnit.initListview = function (parentNode, size, xx, yy, anchroX, anchroY, direction) {
    //create listview

    var listview = new ccui.ListView();
    if (direction) {
        listview.setDirection(ccui.ScrollView.DIR_HORIZONTAL);//水平
    } else {
        listview.setDirection(ccui.ScrollView.DIR_VERTICAL);//垂直
    }

    //listview.setTouchEnabled(true);
    listview.setContentSize(size);
    listview.setPosition(xx, yy);
    listview.anchorY = anchroY ? anchroY : 0;
    listview.anchorX = anchroX ? anchroX : 0;
    //listview.setGravity(ccui.ListView.GRAVITY_CENTER_VERTICAL);
    listview.setBounceEnabled(true);

    listview.setScrollBarEnabled(false);//--设置默认滚动条不可见
    parentNode.addChild(listview);
    return listview;
};

/*判断给定时间是不是在今天
 *@param t 给定的UNIX_TIMESTAMP,精确到秒
 * @return true 在今天，false 不在今天
 * */
NumUnit.isToday = function (t) {
    var now = new Date(Cache.getServerTime());
    var mis = now.getTime();
    var h = now.getHours();
    var m = now.getMinutes();
    var s = now.getSeconds();
    var ms = now.getMilliseconds();
    var today_begin = now.getTime() - h * 60 * 60 * 1000 - m * 60 * 1000 - s * 1000 - ms;
    var today_begin_s = Math.round(today_begin / 1000);
    var today_end = today_begin + 24 * 60 * 60 * 1000;
    var today_end_s = Math.round(today_end / 1000);
    if (t >= today_begin_s && t <= today_end_s) {
        return true;
    }
    return false;
};

/**为节点添加遮罩
 *
 * @param rects  遮罩矩形区域
 * @param node   要加遮罩的节点
 * @return 遮罩层数组
 */
NumUnit.addMaskRects = function (rects, node, opacity, zorder) {
    var op = opacity || 100;
    var zo = zorder || 0;
    var layers = [];
    for (var i = 0; i < rects.length; i++) {
        var layer = cc.LayerColor.create(cc.color(0, 0, 0, op), rects[i].width, rects[i].height);
        layer.setPosition(rects[i].x, rects[i].y);
        node.addChild(layer, zo);
        layers.push(layer);
    }
    return layers;
};

//获取当前时间 时+分
NumUnit.getCurTime = function () {
    var nowTime = new Date(Cache.getServerTime());
    var hh = nowTime.getHours();
    var mm = nowTime.getMinutes();
    var ss = nowTime.getSeconds();
    //var txt = "当前时间:%s时%s分%s秒";
    //cc.log(cc.formatStr(txt,hh,mm,ss));
    hh += (mm / 60 + ss / 3600);
    return hh;
};

//当前时间段是否满足一个区域
NumUnit.isFullCon = function (curTime, fristTime, endTime) {
    if (curTime >= fristTime && curTime <= endTime) {
        return true;
    }
    return false;
};

/**返回一个数字或是数字字符串的十进制信息
 *
 * @param num
 * @returns {{is_number: null, is_integer: null, i_number: null, f_number: null}}
 */
NumUnit.getDecimalInfoOfANumber = function (num) {
    var info = {
        is_number: null,
        is_integer: null,
        i_number: null,         //整数位数
        f_number: null          //小数位数
    };
    num = num - 0;
    if (typeof num !== 'number') {
        info.is_number = false;
        return info;
    }
    var str = num + "";
    var dot_pos = str.indexOf(".");
    if (dot_pos == -1) {
        info.is_integer = true;
        info.i_number = str.length;
        info.f_number = 0;
    }
    else {
        info.is_integer = false;
        info.i_number = dot_pos;
        info.f_number = str.length - dot_pos - 1;
    }
    return info;
};

/**获得指定时间倒计时字符串。
 *
 * @param t 指定时间，单位s或是ms
 * @return 倒计时对象cd, cd.h, cd.m, cd.s, cd.ms分别是倒计时的小时，分，秒,毫秒,
 *         若后一个可进位则进位为前一个，比如倒计时cd = {h:0, m: 0, s: 70, ms: 0},表示为cd = {h:0, m: 1, s: 10, ms: 0}
 */
NumUnit.getCountDownOfAssignedTime = function (t) {


    t = (Math.round(t) - 0 + "").length == 13 ? Math.round(t) : Math.round(t * 1000);
    var t = Math.round(t - Cache.getServerTime());
    t = (t + Math.abs(t)) / 2;


    return NumUnit.getHMSOfAPeriod(t, true);
};

NumUnit.getHMSOfAPeriod = function (t, ifMS) {
    var cd = {
        h: 0,
        m: 0,
        s: 0,
        ms: 0,
        colon_str: "",
        chinese_str: ""
    };

    ifMS = ifMS || false;

    if (!ifMS) {
        t *= 1000;
    }

    cd.ms = t % 1000;

    cd.s = (t - cd.ms) / 1000 % 60;

    cd.m = ((t - cd.ms) / 1000 - cd.s) / 60 % 60;

    cd.h = (((t - cd.ms) / 1000 - cd.s) / 60 - cd.m) / 60;
    if (t == 0) {
        return cd;
    }

    var arr = [cd.h, cd.m, cd.s];
    var suf_colon = [":", ":", ""];
    var suf_chinese = [LANSTR.hour, LANSTR.minute, LANSTR.second];

    var sum = 0;
    for (var i = 0; i < 3; i++) {
        var med_str = ("" + arr[i]).length < 2 ? "0" + arr[i] : arr[i];
        sum += arr[i];
        if (sum > 0 || i > 0) {
            cd.colon_str = cd.colon_str + med_str + suf_colon[i];
            cd.chinese_str = cd.chinese_str + arr[i] + suf_chinese[i];
        }
    }

    return cd;
};

/**
 * 数字缩写
 **/
NumUnit.numDispose = function (num) {

    var is = num.toString().indexOf("e+");
    if (is > 0) {
        return NumUnit.getFormatStringFromBigNumber(num);
    } else {
        var txt = NumUnit.onlyGetNum(num);
        var over = NumUnit.getFormatStringFromBigNumber(txt);
        var result = num.toString().replace(txt, over);
        //cc.log(result);
        return result;
    }

};

/** you want a left to right then set the midpoint all the way to cc.p(0,y)<br/>
 * you want a right to left then set the midpoint all the way to cc.p(1,y)<br/>
 * you want a bottom to top then set the midpoint all the way to cc.p(x,0)<br/>
 * you want a top to bottom then set the midpoint all the way to cc.p(x,1)</p>
 *
 * 初始进度条
 * dir: 1 左向右，2右向左 3下向上 4上向下（可自行拓展)
 * */
NumUnit.initProgressTimer = function (sprite, xx, yy, dir, percent, parent, isScale) {
    var pro = new cc.ProgressTimer(new cc.Sprite(sprite));
    pro.setType(cc.ProgressTimer.TYPE_BAR);
    pro.setPosition(xx, yy);
    if (dir == 1) {
        pro.midPoint = cc.p(0, 1);
        pro.barChangeRate = cc.p(1, 0);
    } else if (dir == 2) {
        pro.midPoint = cc.p(1, 0);
        pro.barChangeRate = cc.p(1, 0);
    } else if (dir == 3) {
        pro.midPoint = cc.p(0.5, 1);
        pro.barChangeRate = cc.p(0, 1);
    } else if (dir == 4) {
        pro.midPoint = cc.p(0.5, 0);
        pro.barChangeRate = cc.p(0, 1);
    }

    pro.setPercentage(percent);
    if (isScale)
        pro.setScaleX(-1);
    parent.addChild(pro);
    return pro;
};

NumUnit.createMask = function (xx, yy, width, height, sprite, parent) {
    var stencil = new cc.LayerColor();
    var clipper = new cc.ClippingNode();
    clipper.stencil = stencil;
    clipper.anchorX = 0.5;
    clipper.anchorY = 0.5;
    parent.addChild(clipper, -1);
    //clipper.setInverted(true);
    //var content = new cc.LayerColor(cc.color.BLACK);
    //content.setOpacity(100);
    var content = sprite;
    content.anchorX = 0.5;
    content.anchorY = 0.5;
    sprite.setPosition(parent.width / 2, parent.height / 2);
    clipper.addChild(content);

    stencil.setContentSize(width, height);
    stencil.setPosition(xx, yy);
};

// 是否重复
NumUnit.isRep = function (msg) {
    var cur = msg.split(",");
    var endStr = "";
    var hash = {};
    for (var i in cur) {
        if (hash[cur[i]]) {
            continue;
        }
        hash[cur[i]] = true;
        endStr += endStr ? "," + cur[i] : cur[i];
    }
    return endStr;
};

NumUnit.randomName = function () {

    var xArray = Config.name[NameType.XING];
    var mArray = Config.name[NameType.MING];
    var xLength = Object.keys(xArray).length;
    var mLength = Object.keys(mArray).length;

    var starX = 1001;//1236,1956
    var starM = 1236;

    var posx = Math.floor(Math.random() * xLength + starX);
    while (posx < starX || posx > (starX + xLength)) {
        posx = Math.floor(Math.random() * xLength + starX);
        cc.log("当前的姓值" + posxo);
    }

    var posm = Math.floor(Math.random() * mLength + starM);
    while (posm < starM || posm > (starM + mLength)) {
        posm = Math.floor(Math.random() * mLength + starM);
        cc.log("当前的名值" + posm);
    }

    var nameTxt = Config.name[NameType.XING][posx].getName();
    var mingTxt = Config.name[NameType.MING][posm].getName();

    return nameTxt + mingTxt;
};

NumUnit.nowTimeisToDay = function (time) {
    var now = new Date(Cache.getServerTime());
    var tY1 = now.getFullYear();
    var tM1 = now.getMonth() + 1;
    var tD1 = now.getDate();

    var cc = new Date(time);
    var tY2 = cc.getFullYear();
    var tM2 = cc.getMonth() + 1;
    var tD2 = cc.getDate();
    if (tY1 == tY2 && tM1 == tM2 && tD1 == tD2) {
        return true;
    }
    return false;
};

/**
 * 数字 转 n万n
 * @param num
 * @returns {*}
 */
NumUnit.getFormatStringFromBigNumber = function (num) {
    if (num <= 99999)
        return num;
    else {
        var wan = Math.floor(num / 10000);
        var qian = Math.floor((num - wan * 10000) / 1000);
        if (qian == 0)
            qian = "";
        return (wan + LANSTR.wan + qian);
    }

    //var backUpNum = num.toString().slice(0);
    //if (isNaN(num)) {
    //    return "NaN";
    //}
    //if (typeof (num) === "string") {
    //    num = num * 1;
    //}
    //var dw = ["", "万", "M", "B", "T",
    //    "aa", "bb", "cc", "dd", "ee", "ff", "gg", "hh", "ii", "jj", "kk", "ll", "mm", "nn", "oo", "pp", "qq", "rr", "ss", "tt", "uu", "vv", "ww", "xx", "yy", "zz"
    //];
    //var dwp = 0;
    //var rtn;
    //while (num >= 10000 && num != "Infinity") {
    //    num /= 10000;
    //    dwp += 1;
    //}
    //if (num == Infinity) {
    //    cc.log("越界的数据:" + backUpNum);
    //}
    //var dwstr = "";
    //if (dwp < dw.length) {
    //    dwstr = dw[dwp];
    //} else {
    //    var realp = dw.length * 3 + (dwp - dw.length) * 3;
    //    dwstr = "e+";
    //    while (num >= 10) {
    //        num /= 10;
    //        realp += 1;
    //    }
    //
    //    dwstr += realp;
    //}
    //num = Math.round(num * 100) / 100;
    //rtn = num + dwstr;
    //return rtn;
};

/**
 * 保留 N 位小数
 * @param num
 * @param type  保留 N 位 (默认 1 位)
 * @returns {*}
 */
NumUnit.keepDecimal = function (num, type) {
    if (type === undefined)
        type = 1;

    var num2 = Math.pow(10, type);
    var f_x = Math.round(num * num2) / num2;
    var s_x = f_x.toString();
    var pos_decimal = s_x.indexOf('.');
    if (pos_decimal < 0) {
        pos_decimal = s_x.length;
        s_x += '.';
    }
    while (s_x.length <= pos_decimal + type) {
        s_x += '0';
    }
    return s_x * 1;
};

/**
 * 点是否在多边形内
 * @param point
 * @param points
 */
NumUnit.isPointInPolygon = function (point, points) {
    var x = point.x;
    var y = point.y;
    var length = points.length;
    var isIn = 1;
    var px = points[length - 1].x;
    var py = points[length - 1].y;
    var cx;
    var cy;

    for (var i = 0; i < length; ++i) {
        cx = points[i].x;
        cy = points[i].y;
        if ((cx <= x || px <= x)
            && ((cy < y && py >= y) || (py < y && cy >= y))) {
            isIn ^= (cx + (y - cy) / (py - cy) * (px - cx) < x) ? 1 : 0;
        }
        px = cx;
        py = cy;
    }

    return isIn;
};

NumUnit.getCamp = function (i) {
    var camp = ["", LANSTR.soldiers, LANSTR.ink, LANSTR.law, LANSTR.tao, LANSTR.confucianism];
    return camp[i];
};

NumUnit.getBingZhong = function (curType) {
    var bingzhong = ["", LANSTR.infantry, LANSTR.though, LANSTR.cavalry];
    return bingzhong[curType.toString().length];
};

NumUnit.getInfoBingzhong = function (type) {
    var info = "";
    var bingzhong = [LANSTR.infantry, LANSTR.though, LANSTR.cavalry];
    type = type.toString();
    var count = 0;
    for (var i = 0; i < type.length; i++) {
        if (type[i] != 0) {
            info += bingzhong[type.length - 1 - i] + "、";
            count++;
        }
    }
    if (count >= 2) {
        return "";
    }

    if (info) {
        info = info.substr(0, info.lastIndexOf("、"));
    }

    return info;

};

NumUnit.getInfoCamp = function (type) {
    var info = "";
    var camp = [LANSTR.soldiers_jia, LANSTR.ink_jia, LANSTR.law_jia, LANSTR.tao_jia, LANSTR.confucianism_jia];
    type = type.toString();
    var count = 0;
    for (var i = 0; i < type.length; i++) {
        if (type[i] != 0) {
            info += camp[type.length - 1 - i] + "、";
            count++;
        }
    }

    if (count >= 2) {
        return "";
    }
    if (info) {
        info = info.substr(0, info.lastIndexOf("、"));
    }

    return info;

};

NumUnit.getCampIcon = function (i) {
    var campIcon = ["", resPlist.camp, resPlist.camp, resPlist.camp, resPlist.camp, resPlist.camp];
    return campIcon[i];
};


//todo 分割字符串  %s ：xx回合 %f : 35.0%  %d: 11.5
// 分解的文字 。值：{sign:"d", value:"1111"}
NumUnit.getSplitTxt = function (txt, v, normalColor) {
    if (!txt) {
        return [];
    }

    normalColor = normalColor ? normalColor : gameColor.color383838;
    if (!v || v.length <= 0) {
        var array = [];
        var o = {str: txt, c: normalColor};
        array.push(o);
        return array;
    }

    var msg = txt;
    //var hh = NumUnit.splitStr(msg, this.width - 60, null, 24);
    //this._allHeight += 30 * hh.length + 10;
    var a = msg.split(/%crit|%heal|%dmv|%thp|%chp|%res|%po|%av|%dv|%mv|%sv|%fv|%kv|%bj|%v|%t|%c|%f1|%d|%s1|%s2|%s3|%s4|%s5|%s6|%s7|%s8|%s9|%s|%f/);

    var s2 = [
        {id: msg.indexOf("%crit"), value: "", sign: "crit", isSign: false},
        {id: msg.indexOf("%heal"), value: "", sign: "heal", isSign: false},
        {id: msg.indexOf("%dmv"), value: "", sign: "dmv", isSign: false},
        {id: msg.indexOf("%thp"), value: "", sign: "thp", isSign: false},
        {id: msg.indexOf("%chp"), value: "", sign: "chp", isSign: false},
        {id: msg.indexOf("%res"), value: "", sign: "res", isSign: false},
        {id: msg.indexOf("%po"), value: "", sign: "po", isSign: false},
        {id: msg.indexOf("%av"), value: "", sign: "av", isSign: false},
        {id: msg.indexOf("%dv"), value: "", sign: "dv", isSign: false},
        {id: msg.indexOf("%mv"), value: "", sign: "mv", isSign: false},
        {id: msg.indexOf("%sv"), value: "", sign: "sv", isSign: false},
        {id: msg.indexOf("%fv"), value: "", sign: "fv", isSign: false},
        {id: msg.indexOf("%kv"), value: "", sign: "kv", isSign: false},
        {id: msg.indexOf("%bj"), value: "", sign: "bj", isSign: false},
        {id: msg.indexOf("%s1"), value: "", sign: "s1", isSign: false},
        {id: msg.indexOf("%s2"), value: "", sign: "s2", isSign: false},
        {id: msg.indexOf("%s3"), value: "", sign: "s3", isSign: false},
        {id: msg.indexOf("%s4"), value: "", sign: "s4", isSign: false},
        {id: msg.indexOf("%s5"), value: "", sign: "s5", isSign: false},
        {id: msg.indexOf("%s6"), value: "", sign: "s6", isSign: false},
        {id: msg.indexOf("%s7"), value: "", sign: "s7", isSign: false},
        {id: msg.indexOf("%s8"), value: "", sign: "s8", isSign: false},
        {id: msg.indexOf("%s9"), value: "", sign: "s9", isSign: false},
        {id: msg.indexOf("%v"), value: "", sign: "v", isSign: false},
        {id: msg.indexOf("%s"), value: "", sign: "s", isSign: false},
        {id: msg.indexOf("%t"), value: "", sign: "t", isSign: false},
        {id: msg.indexOf("%c"), value: "", sign: "c", isSign: false},
        {id: msg.indexOf("%f"), value: "", sign: "f", isSign: false},
        {id: msg.indexOf("%d"), value: "", sign: "d", isSign: false}
    ];

    for (var m = 0; m < v.length; m++) {
        for (var n = 0; n < s2.length; n++) {
            if (s2[n].id != -1 && v[m].sign == s2[n].sign && s2[n].isSign == false) {
                s2[n].value = v[m].value;
                s2[n].card = v[m].card;
                s2[n].isSign = true;
                s2[n].color = v[m].color ? v[m].color : gameColor.colorff6600;
                break;
            }
        }
    }

    var s = [];
    for (var i = 0; i < s2.length; i++) {
        if (s2[i]["isSign"] == false) {
            continue;
        }
        s.push(s2[i]);
    }

    if (s.length <= 0) {
        var array = [];
        var o = {str: txt, c: normalColor};
        array.push(o);
        return array;
    }

    s.sort(function (a, b) {
        return a["id"] - b["id"];
    });
    var count = 0;
    var r = [];
    for (var i = 0, j = 0; i < a.length; i++) {
        count += a[i].toString().length;
        if (s[j] && s[j]["id"] == count) {
            a.splice(i + 1, 0, "");
            count += s[j].sign.length + 1;
            var obj = {index: i + 1, value: s[j].value, card: s[j].card, color: s[j].color};
            r.push(obj);
            i++;
            j++;
        }
    }
    var array = [];
    var index = 0;
    var o = null;
    for (var k = 0; k < a.length; k++) {
        var p = index <= r.length - 1 ? r[index]["index"] : 0;
        if (p == k) {
            var rr = r[index];
            o = {str: rr.value.toString(), c: rr.color, card: rr.card};
            index++;
        } else {
            o = {str: a[k].toString(), c: normalColor};
        }
        array.push(o);
    }

    return array;
};

// 去除空格
NumUnit.trim = function (str) {
    return str.replace(/(^\s+)|(\s+$)/g, "");
};

NumUnit.formatNum = function (txt) {
    var t = txt.toString();
    var max = 4;
    var end = txt;
    if (t.length < max) {

        for (var i = 0; i < max - t.length; i++) {
            end += "0";
        }
        return end;
    }
    return end;
};

// format :{a:11,b:222}
NumUnit.splitObj = function (txt) {
    var t = txt.replace(/{|}/g, "");
    var arr = t.split(",");
    var endArr = [];
    for (var i in arr) {
        var s = arr[i].split(":");
        var obj = {};
        obj.id = s[0];
        obj.key = s[1];
        endArr.push(obj);
    }
    return endArr;
};

/**
 * 武将卡排序
 * @param sign 排序的标记，【品质，当前兵种类型，阵营，等级，cost， id】;
 * @param data
 * @param reverse 是否倒序
 */
NumUnit.sortCardForType = function (sign, data, reverse) {
    var name = ["quality", "curtype", "camp", "level", "cost", "id"];
    var isInConfig = [1, 0, 1, 0, 1, 1];    // 是否用 configInfo 判断
    data.sort(function (a, b) {
        if ((a.armygroupid > 0 && b.armygroupid > 0) || (a.armygroupid == 0 && b.armygroupid == 0)) {
            if (isInConfig[sign]) {
                if (b.configInfo[name[sign]] == a.configInfo[name[sign]]) { // 相同用id排序
                    if(a.level == b.level){
                        return a.configInfo["id"] - b.configInfo["id"];
                    }else{
                        if(reverse){
                            return a.level - b.level;
                        }else{
                            return b.level - a.level;
                        }
                    }
                } else {
                    if (sign == name.length - 1) {  // 若是按id排序, 从小到大
                        return a.configInfo[name[sign]] - b.configInfo[name[sign]];
                    } else {
                        if (reverse) {
                            return a.configInfo[name[sign]] - b.configInfo[name[sign]];
                        } else {
                            return b.configInfo[name[sign]] - a.configInfo[name[sign]];
                        }
                    }
                }
            } else {
                if (b[name[sign]] == a[name[sign]]) {
                    return a.configInfo["id"] - b.configInfo["id"];
                } else {
                    if (reverse) {
                        return a[name[sign]] - b[name[sign]];
                    } else {
                        return b[name[sign]] - a[name[sign]];
                    }
                }
            }
        } else {
            return a.armygroupid > 0 ? -1 : 1;
        }
    });
    return data;
};

NumUnit.sortCardExp = function (data) {
    /*
     *  0无
     *  1已强化
     *  2已觉醒
     *  3已解锁
     *  4已学习技能
     *  5已保护
     *  6队伍中
     */
    var arr = [[], [], [], [], [], [], []];
    for (var i in data) {
        if (data[i]["armygroupid"]) {
            arr[6].push(data[i]);
        } else if (data[i]["protect"]) {
            arr[5].push(data[i]);
        } else if (data[i]["skill2"] || data[i]["skill3"]) {
            arr[4].push(data[i]);
        } else if (data[i]["type1"] || data[i]["type2"]) {
            arr[3].push(data[i]);
        } else if (data[i]["awake"]) {
            arr[2].push(data[i]);
        } else if (data[i]["skill1lv"] > 1) {
            arr[1].push(data[i]);
        } else {
            arr[0].push(data[i]);
        }
    }

    arr[0].sort(function (a, b) {
        if (b.configInfo["id"] == a.configInfo["id"]) {
            return a.level - b.level;
        } else {
            return b.configInfo["id"] - a.configInfo["id"];
        }
    });

    var sameSort = function (dd, sign) {
        dd.sort(function (a, b) {
            if (a[sign] == b[sign]) {
                if (b.configInfo["id"] == a.configInfo["id"]) {
                    return a.level - b.level;
                } else {
                    return b.configInfo["id"] - a.configInfo["id"];
                }
            } else {
                return a[sign] - b[sign];
            }
        });
        return dd;
    };
    arr[1] = sameSort(arr[1], "skill1lv");
    arr[2] = sameSort(arr[2], "awake");
    arr[5] = sameSort(arr[5], "protect");
    arr[6] = sameSort(arr[6], "armygroupid");

    var endArr = [];
    for (var i = 0; i < arr.length; i++) {
        endArr = endArr.concat(arr[i]);
    }
    return endArr;
};


NumUnit.createNewArrForNoteStr = function (txt) {
    var t = txt.replace(/\[|\]/g, "");
    var arr = t.split(",");
    return arr;
};

NumUnit.getSkillType = function (skilltype) {
    var name = ["", LANSTR.passive, LANSTR.command, LANSTR.initiative, LANSTR.ordinary, LANSTR.chase, LANSTR.building_addition,
        LANSTR.arm_addition, LANSTR.camp_addition, LANSTR.title_addition, LANSTR.high_order_addition];
    return name[skilltype];
};

// 去除重复数组
NumUnit.getSignItemArr = function (arr, key) {

    var hash = {};
    for (var i in arr) {
        if (hash[arr[i][key]])
            continue;
        hash[arr[i][key]] = true;
    }
    var len = Object.keys(hash).length;
    return len;
};


NumUnit.getSpineResource = function (size, id) {
    if (size == CardSize.small) {
        return false;
    }

    var dd = resources_smallcard[id];
    if (!dd) {
        return false;
    }

    var path = "res/";
    path += size == CardSize.mid ? "smallcard" : "bigcard";
    var txt = path + "/SLG_" + dd[1] + "_";
    txt += id;
    var arr = [];
    arr.push(txt + ".json");
    arr.push(txt + ".atlas");
    for (var i = 0; i < dd[0]; i++) {
        arr.push(txt + "_" + i + ".png");
    }

    return arr;
};

/**
 * 点击坐标事件
 *
 */
NumUnit.touchMapPos = function (xx, yy, posx, posy, color, callback, target, size, type, obj) {

    var zb = null;
    if(!type) {
        zb = NumUnit.initLabel(xx, yy, target, size, posx + "," + posy, color);
        NumUnit.initLabel(zb.width / 2, zb.height / 2 - 2, zb, size, "_______", color);
    } else if(type == 1) {
        zb = NumUnit.initLabel(xx, yy, target, size, obj.name + "(" + posx + "," + posy + ")", color);
        // NumUnit.initLabel(zb.width / 2, zb.height / 2 - 2, zb, size, "    _______", color);
    }


    var isMoving = false;
    var posNow = null;
    cc.eventManager.addListener(cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: false,
        onTouchBegan: function (touch, event) {
            isMoving = false;
            var target = event.getCurrentTarget();
            posNow = target.convertToNodeSpace(touch.getLocation());

            var zb_rect = cc.rect(zb.x - zb.width / 2, zb.y - zb.height / 2, zb.width, zb.height);
            if (cc.rectContainsPoint(zb_rect, posNow)) {
                return true;
            }
            return false;
        },
        onTouchMoved: function (touch, event) {
            var target = event.getCurrentTarget();
            var posEnd = target.convertToNodeSpace(touch.getLocation());
            if (Math.abs(posEnd.x - posNow.x) > 10 || Math.abs(posEnd.y - posNow.y) > 10)
                isMoving = true;
        },
        onTouchEnded: function () {
            if (isMoving)
                return;
            callback();
        }
    }), target);
};
/*
*
*  开启UI后移动效果
*  img夫级
*  direction方向dir1左边，2右边，3下边，4上边
*  callback 回调
*
*/
NumUnit.UIMoveTo = function (img, pos_x, pos_y, dir1, target, callback, isMove) {

    img.stopAllActions();
    if(typeof (isMove) == "boolean" && !isMove){
        img.x = pos_x;
        img.y = pos_y;
        return;
    }


    var tt = 0.2;
    var move = null;
    if(dir1 == 1){//--左边

        img.x = img.x - img.width - 100;
        move = cc.moveTo(tt, pos_x, pos_y).easing(cc.easeOut(2));
        // img.runAction(move.clone());

    }else if(dir1 == 2){//--右边

        img.x = img.x + img.width + 100;
        move = cc.moveTo(tt,pos_x,pos_y).easing(cc.easeOut(2));
        // img.runAction(move.clone());
    }else if(dir1 == 3){//--下边

        img.y = img.y - img.height - 100;
        move = cc.moveTo(tt, pos_x, pos_y).easing(cc.easeOut(2));
        // img.runAction(move.clone());
    }else if(dir1 == 4){//--上边

        img.y = img.y +100;
        move = cc.moveTo(tt, pos_x, pos_y).easing(cc.easeOut(2));
        // img.runAction(move.clone());
    }

    if (callback) {
        var call = cc.callFunc(function () {
            if (callback)
                callback.call(target);
        }, target);
        img.runAction(cc.sequence(move, call));
    } else {
        img.runAction(move);
    }
};

/**
 * 飞向某点特效
 *
 * pos_x 终点x坐标
 * pos_y 终点y坐标
 * dt 所花时间
 *
 */
NumUnit.effectFly = function (img, pos_x, pos_y, dt, callback, target) {
    var callfunc = cc.callFunc(function () {
        callback();
    }, target);

    var a1 = cc.MoveTo.create(dt, cc.p(pos_x, pos_y));
    img.runAction(cc.sequence(a1, callfunc));
};

/**
 * 3D转2D坐标(node自身的坐标, node宽高不能为0 ) todo 不精确
 */
NumUnit.get3dto2dPos = function (node, camera) {
    var p0 = node.getParent().convertToWorldSpace(node.getPosition());  // 屏幕2d坐标
    var p1 = node.getCameraPoint3dto2d(p0, camera);         // 实际坐标在node范围内的坐标 (差值)
    var p2 = cc.p(node.width * node.anchorX, node.height * node.anchorY);   // node锚点内坐标

    var ax = p1.x > p2.x ? -1 : 1;
    var ay = p1.y > p2.y ? -1 : 1;

    var ax2, ay2;
    var ss = 2;     // 精度
    var times = 0;
    while (true) {
        times++;
        if (times > 100) {
            cc.log("3dto2d is fail...");
            break;
        }

        if(Math.abs(p1.x - p2.x) < ss) {
            ax2 = 0;
        } else {
            p0.x += ax * ss;
        }
        if(Math.abs(p1.y - p2.y) < ss) {
            ay2 = 0;
        } else {
            p0.y += ay * ss;
        }

        if(ax2 == 0 && ay2 == 0)
            break;

        p1 = node.getCameraPoint3dto2d(p0, camera);
    }
    return p0;
};

/**
 * 创建选中img
 */
NumUnit.initChooseImg = function (width, height) {
    // width = 174;
    // height = 63;

    var layout = new ccui.Layout();
    layout.setContentSize(width, height);

    var img1 = NumUnit.initImage(0, layout.height, resPlist.xuanzhongkuang, layout, null, 0, 1);
    var img2 = NumUnit.initImage(0, 0, resPlist.xuanzhongkuang, layout, null, 0, 0);
    img2.setScaleY(-1);
    var img3 = NumUnit.initImage(layout.width, 0, resPlist.xuanzhongkuang, layout, null, 1, 0);
    img3.setScaleX(-1);
    img3.setScaleY(-1);
    var img4 = NumUnit.initImage(layout.width, layout.height, resPlist.xuanzhongkuang, layout, null, 1, 1);
    img4.setScaleX(-1);

    return layout;
};

/**
 * 创建 透明 UIButton
 */
NumUnit.initToumingBtn = function (xx, yy, parent, width, height, callback, targe, callback2, callbackEndFuc) {
    if (!targe)
        targe = parent;
    if(!callback2){
        callback2 = null;
    }
    if(!callbackEndFuc){
        callbackEndFuc = null;
    }

    var btn = NumUnit.initButtonUI("res/aboard_touming.png", "res/aboard_touming.png", callback, targe, null, callback2, callbackEndFuc);
    btn.setScale9Enabled(true);
    btn.setCapInsets(cc.rect(1, 1, 3, 3));
    btn.setSize(cc.size(width, height));
    btn.setPosition(xx, yy);
    if (parent)
        parent.addChild(btn);

    return btn;
};


// 线 parent:label
NumUnit.initLine = function(parent){
    var len2 = parent.getString().length;
    var strline = "";
    for (var j = 0; j < len2; j++) {
        strline += "_";
    }
    var label2 = new cc.LabelTTF(strline, parent.getFontName(), parent.getFontSize());
    while (label2.width < parent.width) {
        strline += "_";
        label2.setString(strline);
    }
    label2.setColor(parent.getColor());

    label2.setAnchorPoint(0.5, 0);
    label2.setPosition(parent.width / 2, -3);
    parent.addChild(label2);
}

/**
 * 创建 9宫格 UIButton
 * scale9NormalResType  Scale9Btn.Scale9Btn_blue
 */
NumUnit.initButtonByScale9 = function (scale9NormalResType, scale9ClickResType, xx, yy, parent, width, height, callback, targe, callback2, callbackEndFuc) {
    if (!targe)
        targe = parent;
    if(!callback2){
        callback2 = null;
    }
    if(!callbackEndFuc){
        callbackEndFuc = null;
    }
    if(!width){
        width = 108;
    }
    if(!height){
        height = 36;
    }

    var btn = NumUnit.initButtonUI(scale9NormalResType, scale9ClickResType, callback, targe, null, callback2, callbackEndFuc);
    btn.setScale9Enabled(true);
    btn.setCapInsets(cc.rect(0, 0, btn.width, btn.height));
    btn.setContentSize(cc.size(width, height));
    btn.setPosition(xx, yy);
    if (parent)
        parent.addChild(btn);

    return btn;
};

NumUnit.verticalLabel = function (xx, yy, parent, objOrArray, specialObj) {

    if (!specialObj) {
        specialObj = null;
    }
    var node = new cc.Node();
    node.setAnchorPoint(0.5, 0.5);
    node.setPosition(xx, yy);
    node.setContentSize(60, 200);
    if (parent) {
        parent.addChild(node);
    }
    if (typeof(objOrArray) == "string") {
        objOrArray = objOrArray.split("");
    }

    var tt = [];
    var size, c, len, str;
    c = gameColor.color685343;
    len = objOrArray.length;
    var isHaveSpec = specialObj == null;
    if (!isHaveSpec) {
        len = len + 1;
    }

    var allh = 0;
    for (var i = 0; i < len; i++) {
        size = i == 0 ? 60 : 36;
        str = objOrArray[i];
        c = gameColor.color685343;
        if (!isHaveSpec && i == len - 1) {
            str = specialObj.txt;
            c = specialObj.color;
            size = 24;
        }

        var title = NumUnit.initLabel(node.width / 2, 0, node, size, str, c, font.font_hdt, null, null, .5, 1);
        allh += title.height + 10;
        tt.push(title);
    }

    if (tt.length <= 0) {
        return node;
    }

    allh -= 10;
    node.setContentSize(60, allh);

    for (var i = 0; i < tt.length; i++) {
        tt[i].y = i == 0 ? node.height : tt[i - 1].y - tt[i - 1].height - 10;
    }

    return node;
};

/**
 * 字符串中检测跳转坐标
 *
 *
 */
NumUnit.stringDetectionPos = function (msg, ww, callback, fontColor) {
    //var aa = msg.match(/\d{1,3},\d{1,3}/);      // 数字逗号数字
    //var bb = msg.match(/\d{1,3} \d{1,3}/g);   // 数字空格数字
//
    fontColor = fontColor || cc.color.WHITE;

    var widthAll = 399;
    var heightAll = 399;
    // var points = [];
    // var strs = [];
    // points.push( msg.match(/\#\d+\.png/g));
    // points.push(msg.match(/\d+，\d+/g));
    // points.push(msg.match(/\d+,\d+/g));
    //
    // strs.push(msg.split(/\d+,\d+/g));
    // strs.push(msg.split(/\#\d+\.png/g));
    var points = msg.match(/\d+,\d+/g);
    var strs = msg.split(/\d+,\d+/g);
    var str = ",";
    if (!points) {
        points = msg.match(/\d+，\d+/g);
        strs = msg.split(/\d+，\d+/g);
        //strs = msg.split(/\#\d+/g);
        //points = msg.match(/\#\d+/g);
        str = "，";
    }

    var txts = {};
    var index = 1;

    // 文字拆分存储
    if (points) {
        var len_p = points.length;

        var i = 0;
        for (; i < len_p; i++) {
            txts[index] = {isPoint: false};
            txts[index++].str = strs[i];
            txts[index] = {isPoint: false};
            txts[index++].str = points[i];

            var pos = points[i].split(",");
            var xx = parseInt(pos[0]);
            var yy = parseInt(pos[1]);
            if (xx <= widthAll && yy <= heightAll) {
                txts[index - 1].isPoint = cc.p(xx, yy);
            }
            //txts[index - 1].isPoint = cc.p(xx, yy);
        }

        txts[index] = {isPoint: false};
        txts[index].str = strs[i];
    } else {
        txts[index] = {isPoint: false};
        txts[index].str = msg;
    }

    txts[0] = {isPoint: false, str: ""};

    var colorText = new ColorText(20, ww);     // 设置宽度
    var len_t = Object.keys(txts).length;
    var isfist = false;
    for (var j = 0; j < len_t; j++) {
        if (txts[j].isPoint && !isfist) {
            isfist = true;
            var aaaaaa = j;
            var data = {};
            data.xian = true;
            colorText.pushBack(txts[j].str, gameColor.color538c10, data, function () {
                cc.log("dddddddd");
                callback(txts[aaaaaa].isPoint);
            }, this);
        } else {
            colorText.pushBack(txts[j].str, fontColor);
        }
    }

    return colorText;
};

NumUnit.stringDetectionImgerandPos = function (msg, ww, callback, fontColor) {
    //var aa = msg.match(/\d{1,3},\d{1,3}/);      // 数字逗号数字
    //var bb = msg.match(/\d{1,3} \d{1,3}/g);   // 数字空格数字
//
    fontColor = fontColor || cc.color.WHITE;

    var widthAll = 399;
    var heightAll = 399;

    var points = msg.match(/\d+,\d+/g),
        strs = msg.split(/\d+,\d+/g),
        strlist1 = [], strlist2 = [],
        len, i, n,
        points2,
        strs2,
        ishasimg = false,// 是否有表情
        pos, xx, yy;

    if (points) {
        len = Math.max(strs.length, points.length);
        for (n = 0; n < len; n++) {
            if (strs[n]) {
                strlist1.push({ str:strs[n], type:0 });
            }
            if (points[n]) {
                pos = points[n].split(",");
                xx = parseInt(pos[0]);
                yy = parseInt(pos[1]);
                if (xx <= widthAll && yy <= heightAll) {
                    strlist1.push({ str:points[n], type:1 });//--坐标
                }else{
                    strlist1.push({ str:points[n], type:0 });
                }
            }
        }
    }
    else {
        for (n = 0; n < strs.length; n++) {
            strlist1.push({ str:strs[n], type:0 });
        }
    }

    for (i = 0; i < strlist1.length; i++) {
        points2 = strlist1[i].str.match(/\#\d+/g);
        strs2 = strlist1[i].str.split(/\#\d+/g);
        if (points2) {
            len = Math.max(points2.length, strs2.length);
            for (n = 0; n < len; n++) {
                if (strs2[n]) {
                    strlist2.push({ str:strs2[n], type:0 });//--文字
                }
                if (points2[n]) {
                    var pos2 = points2[n].replace("#", "");
                    var ss = parseInt(pos2);
                    if(ss>0 && ss<=50){
                        strlist2.push({ str:points2[n], type:2 });//--表情
                        ishasimg = true;
                    }else{
                        strlist2.push({ str:points2[n], type:0 });
                    }
                }
            }
        }
        else {
            strlist2.push(strlist1[i]);
        }
    }

    var colorText = new ColorText(20, ww);     // 设置宽度
    if (ishasimg) {
        colorText.setRowHeight(28);
    }
    var len_t = strlist2.length;
    var isfist = false;
    for (var j = 0; j < len_t; j++) {
        if (1 == strlist2[j].type && !isfist) {
            isfist = true;

            pos = strlist2[j].str.split(",");
            xx = parseInt(pos[0]);
            yy = parseInt(pos[1]);
            var aaaaaa = cc.p(xx, yy);

            var data = {};
            data.xian = true;

            colorText.pushBack(strlist2[j].str, gameColor.color538c10, data, function () {
                cc.log("dddddddd");

                callback(aaaaaa);
            }, this);
        }else if(isfist && 1 == strlist2[j].type){
            colorText.pushBack(strlist2[j].str, fontColor);
        }
        if(2 == strlist2[j].type) {
            var val = strlist2[j].str.replace("#", "");
            var texture = cc.formatStr("#biaoqing_%s.png", val);
            colorText.pushImage(texture);
        }

        if(0 == strlist2[j].type) {
            colorText.pushBack(strlist2[j].str, fontColor);
        }
    }

    return colorText;
};

/**
 * 字符串中检测玩家名
 *
 *
 */
NumUnit.stringDetectionName = function (msg, ww, callback, fontColor) {
    fontColor = fontColor || cc.color.WHITE;

    var arr = msg.split("#");
    var points = null;
    if(arr.length >= 2) {
        points = [arr[1]];
        var strs = [arr[0], arr[2]];
    }

    var txts = {};
    var index = 1;

    // 文字拆分存储
    if (points) {
        var len_p = points.length;

        var i = 0;
        for(; i < len_p; i++) {
            txts[index] = {isPoint: false};
            txts[index++].str = strs[i];
            txts[index] = {isPoint: true};
            txts[index++].str = points[i];
        }

        txts[index] = {isPoint: false};
        txts[index].str = strs[i];
    } else {
        txts[index] = {isPoint: false};
        txts[index].str = msg;
    }

    txts[0] = {isPoint: false, str: ""};

    var colorText = new ColorText(20, ww);     // 设置宽度
    var len_t = Object.keys(txts).length;
    var isfist = false;
    for (var j = 0; j < len_t; j++) {
        if (txts[j].isPoint && !isfist) {
            isfist = true;
            var aaaaaa = j;
            var data = {};
            data.xian = true;
            colorText.pushBack(txts[j].str, gameColor.color538c10, data, function () {
                cc.log("dddddddd");
                callback(txts[aaaaaa].isPoint);
            }, this);
        } else {
            colorText.pushBack(txts[j].str, fontColor);
        }
    }

    return colorText;
};

/**
 * 字符串中检测玩家名和坐标
 * @param msg
 * @param ww
 * @param callback1 玩家名回调
 * @param callback2 坐标回调
 * @param fontColor
 */
NumUnit.stringDetectionNameAndPos = function (msg, ww, callback1, callback2, fontColor) {
    fontColor = fontColor || cc.color.WHITE;

    // 检测字符串中坐标
    var widthAll = 399;
    var heightAll = 399;
    var points = msg.match(/\d+,\d+/g);
    var strs = msg.split(/\d+,\d+/g);
    if (!points) {
        points = msg.match(/\d+，\d+/g);
        strs = msg.split(/\d+，\d+/g);
    }

    var name_arr = [];
    var isShang = -1;
    for(var i = 0; i < strs.length; i++) {
        if(strs[i].indexOf("#") >= 0) {
            if(parseInt(i) == 0)
                isShang = 0;
            else
                isShang = 1;
            name_arr = strs[i].split("#");
            break;
        }
    }

    var arr = [];
    if(points && isShang >= 0) {    // 有坐标和玩家名
        var pos = points[i].split(",");
        var xx = parseInt(pos[0]);
        var yy = parseInt(pos[1]);

        if(isShang) {
            arr.push({type : 0, str : strs[0]});
            arr.push({type : 1, str : points[0], pos : cc.p(xx, yy)});
            for(var i in name_arr) {
                if(parseInt(i) == 1)
                    arr.push({type : 2, str : name_arr[i]});
                else
                    arr.push({type : 0, str : name_arr[i]});
            }
        } else {
            for(var i in name_arr) {
                if(parseInt(i) == 1)
                    arr.push({type : 2, str : name_arr[i]});
                else
                    arr.push({type : 0, str : name_arr[i]});
            }
            arr.push({type : 1, str : points[0], pos : cc.p(xx, yy)});
            arr.push({type : 0, str : strs[1]});
        }

    } else if(points && isShang < 0) {  // 仅有坐标
        var index = -1;
        for(var i = 0; i < points.length; i++){
            var pos = points[i].split(",");
            var xx = parseInt(pos[0]);
            var yy = parseInt(pos[1]);
            if(strs[++index]){
                arr.push({type : 0, str : strs[index]});
            }
            arr.push({type : 1, str : points[i], pos : cc.p(xx, yy)});
        }
        while (index < strs.length){
            if(strs[++index]){
                arr.push({type : 0, str : strs[index]});
            }else{
                break;
            }
        }

    } else if(!points && isShang >= 0) {    // 仅有玩家名
        for(var i in name_arr) {
            if(parseInt(i) == 1)
                arr.push({type : 2, str : name_arr[i]});
            else
                arr.push({type : 0, str : name_arr[i]});
        }

    } else {    // 既没有坐标 也没有玩家名
        arr.push({type : 0, str : strs[0]});
    }

    var colorText = new ColorText(20, ww);     // 设置宽度
    var len_t = Object.keys(arr).length;
    // var isPointFist = false;
    var isNameFist = false;
    for (var j = 0; j < len_t; j++) {
        if (arr[j].type == 1) {
            // isPointFist = true;
            var aaaaaa = j;
            var data = {};
            data.xian = true;
            colorText.pushBack(arr[j].str, gameColor.color538c10, data, function () {
                cc.log("dddddddd + pos");
                callback2(arr[aaaaaa].pos);
            }, this);
        }
        else if (arr[j].type == 2 && !isNameFist) {
            isNameFist = true;
            var bbbbbb = j;
            var data = {};
            data.xian = true;
            colorText.pushBack(arr[j].str, gameColor.color538c10, data, function () {
                cc.log("dddddddd + name");
                callback1(arr[bbbbbb].str);
            }, this);
        } else {
            colorText.pushBack(arr[j].str, fontColor);
        }
    }

    return colorText;
};

// /**
//  *  获取城池自己的部队
//  * @param cityId
//  * @returns {Array}
//  */
// NumUnit.getStayCityArmy = function (cityId) {
//     var armyArr = [];
//
//     for(var i in gamePlayer.fiefs.armygroup) {
//         if(gamePlayer.fiefs.armygroup[i].staycityid == cityId && gamePlayer.fiefs.armygroup[i].cards.length > 0) {
//             armyArr.push(gamePlayer.fiefs.armygroup[i]);
//         }
//     }
//
//     return armyArr;
// };

/**
 * 解析字符串中是否含有 [c=fffffft=w=b=u=l=webv=textxxxxx] 此类标识的存在
 * c=color t=1标题（居中） w=1段落横线图片 b=加粗  u=下划线  f=字体  s=字号  l=按钮  v=描述]
 * l=v=按钮与描述相结合 (l=web, v=https://......, 地址不能有[] )
 * v= 必需是最后一个
 *
 * heig  (没用)
 */
NumUnit.initRichTextAnalysis = function (xx, yy, parentContent, fontSize, str, fontColor, fontName, wid, heig, anchorXX, anchorYY, zOrder, rowH) {

    if (!str) {
        str = "";
    }
    str = str.toString();

    var r = /\[(.+?)\]/g;
    var stmat = str.match(r);
    var repl = str.replace(r, "#");
    var arrs = repl.split("#");

    fontColor = fontColor || cc.color.WHITE;
    fontName = fontName || font.font_name;
    zOrder = zOrder || 0;

    if (anchorXX === undefined) anchorXX = 0.5;
    if (anchorYY === undefined) anchorYY = 0.5;

    var text = new ColorText(fontSize, wid, fontName);
    text.setAnchorPoint(anchorXX, anchorYY);

    if (rowH) {
        text.setRowHeight(rowH);
    }

    var index = 0;
    var txts = [];
    if (stmat) {
        var len_p = stmat.length;

        var i = 0;
        for (; i < len_p; i++) {

            txts[index] = {};
            txts[index++].text = arrs[i];
            txts[index] = {};

            var sten = stmat[i];
            sten = sten.substring(1, sten.length - 1);  // 去除头尾 []

            var n0 = 0;
            while (true) {
                var n1 = sten.indexOf("=", n0);
                var n2 = sten.indexOf("=", n1 + 1);

                var d1 = sten.substring(n1 - 1, n1);

                if (n2 > 0) {
                    if (d1 === "c") {
                        var d2 = sten.substring(n1 + 1, n2 - 1);
                        txts[index].color = "#" + d2;
                    } else if (d1 === "b") {
                        txts[index].jiacu = true;
                    } else if (d1 === "u") {
                        txts[index].xian = true;
                    } else if (d1 === "t") {
                        txts[index].title = true;
                    } else if (d1 === "w") {
                        txts[index].duanluo = true;
                    } else if (d1 === "f") {
                        var font_name = sten.substring(n1 + 1, n2 - 1);
                        txts[index].font = font[font_name];
                    } else if (d1 === "s") {
                        txts[index].size = sten.substring(n1 + 1, n2 - 1);
                    } else if (d1 === "l") {
                        txts[index].bnt = sten.substring(n1 + 1, n2 - 1);
                    } else if (d1 === "v") {     // 如果 v 后的字符里面有 = 号, 会进这里
                        txts[index].text = sten.substring(n1 + 1);
                        break;
                    }
                } else {    // 没有 = 号了 (理论上只有最后的 v 才会进这里)
                    txts[index].text = sten.substring(n1 + 1);
                    break;
                }

                n0 = n1 + 1;
            }
            index++;
        }

        txts[index] = {};
        txts[index].text = arrs[i];

        var strlen = txts.length;
        var colors = null;
        for (var i = 0; i < strlen; i++) {
            var data = txts[i];
            if (data.color) {
                colors = cc.hexToColor(data.color);
            } else {
                colors = fontColor;
            }

            if (data.bnt) {
                text.bnt = data.bnt;
                text.txt = data.text;
                var fun0 = function () {
                    if (this.bnt === "web") {
                        cc.log("web: " + this.txt);

                        if (cc.sys.os == cc.sys.OS_ANDROID) {
                            var info = {};
                            info.type = 2;
                            info.url = this.txt;
                            jsb.reflection.callStaticMethod("cn/seafood/war/AppActivity", "openCustomerView", "(Ljava/lang/String;)V", JSON.stringify(info));
                        }
                    }
                };
                text.pushBack(data.text, colors, data, fun0, text);
            } else {
                text.pushBack(data.text, colors, data);
            }
        }
    } else {
        text.pushBack(str, fontColor);
    }

    text.setTextPos(xx, yy);

    if (parentContent) {
        parentContent.addChild(text, zOrder);
    }

    return text;
};

/**
 * 阿拉伯数字转中文数字 0-9999
 * @param num
 * @returns {string}
 */
NumUnit.numToCHN = function (num) {
    if(num === 0)
        return NumUnit.chNum[num];

    var strIns = '', chnStr = '';
    var unitPos = 0;
    var len = num.toString().length;
    var zero = true;

    while(num > 0){
        var v = num % 10;
        if(v === 0){
            if(!zero){
                zero = true;
                chnStr = NumUnit.chNum[v] + chnStr;
            }
        }else{
            zero = false;
            if(len === 2 && unitPos === 1 && v === 1) {     // 去除一十几
                strIns = "";
            } else {
                strIns = NumUnit.chNum[v];
            }
            strIns += NumUnit.chNum2[unitPos];
            chnStr = strIns + chnStr;
        }
        unitPos++;
        num = Math.floor(num / 10);
    }
    return chnStr;
};

NumUnit.getTargetString = function(id){
    /**
     * skill表 ： 如果targettype  = 0 则攻击目标
     * targettype  = 1 || 4 || 5 && targetval == 1 则友军单体
     * targettype  = 1 || 3 || 4 || 5 && targetval != 1 则 友军群体(tragetval的值，如果为多个值用“-”隔开，如1-2) 实例： 友军群体（有效距离内1-2个目标）
     *
     * targettype  = 2,9,10,11 && targetval == 1 则敌军单体
     * targettype  = 2,9,10,11 && targetval != 1 则敌军群体(tragetval的值，如果为多个值用“-”隔开，如1-2) 敌军群体（有效距离内2个目标）
     * targettype  = 3  则自己
     * targettype  = 7  我军中军
     * targettype  = 8  我军大营
     */
    var dd = Config.skill[id];
    var targettype = dd["targettype"];
    var targetval = dd["targetval"];
    if(targettype == 0){
        return LANSTR.gjmb;
    }else if(targetval == 1 && (targettype== 1 || targettype == 4 || targettype == 5 )){
        return LANSTR.yjdt;
    }else if(targetval != 1 && (targettype== 1 || targettype == 4 || targettype == 5 || targettype == 3)){
        var isHave = targetval.toString().indexOf(".");
        var p ;
        if(isHave > 0){
            var d = targetval.toString().split(".");
            p = d[0] + "-" + d[1];
        }else {
            p = targetval;
        }

        return cc.formatStr(LANSTR.yjqt_jlmb, p);
    }else if((targettype == 2 || targettype == 9 || targettype == 10 || targettype == 11) && targetval == 1){
        return LANSTR.djdt;
    }else if((targettype == 2 || targettype == 9 || targettype == 10 || targettype == 11) && targetval != 1){
        var isHave = targetval.toString().indexOf(".");
        var p ;
        if(isHave > 0){
            var d = targetval.toString().split(".");
            p = d[0] + "-" + d[1];
        }else {
            p = targetval;
        }
        return cc.formatStr(LANSTR.djqt_jlmb, p);
    }else if(targettype == 3){
        return LANSTR.oneself;
    }else if(targettype == 7){
        return LANSTR.wjzj;
    }else if(targettype == 8){
        return LANSTR.wjdy;
    }
};


/**
 * 城池主产出资源图标 木铁粮石玉铜
 */
NumUnit.getCityIconRes = function (nn) {
    var ss = resPlist.icon_4_s;
    if(nn == 0) {
        ss = resPlist.mainup_006;
    } else if(nn == 1) {
        ss = resPlist.mainup_007;
    } else if(nn == 2) {
        ss = resPlist.mainup_008;
    } else if(nn == 3) {
        ss = resPlist.mainup_009;
    } else if(nn == 4) {
        ss = resPlist.icon_5_s;
    }
    return ss;
};

/**
 * 城池主产出资源文本 木铁粮石玉铜
 */
NumUnit.getCityStrRes = function (nn) {
    var ss = LANSTR.copper;
    if(nn == 0) {
        ss = LANSTR.wood;
    } else if(nn == 1) {
        ss = LANSTR.iron;
    } else if(nn == 2) {
        ss = LANSTR.hay
    } else if(nn == 3) {
        ss = LANSTR.stone
    } else if(nn == 4) {
        ss = LANSTR.jade_operator;
    }
    return ss;
};
/*
target
target需要特殊处理
targettype	targetval	描述
1	随意值	有效范围内【targetval】个【友军】
2	随意值	有效范围内【targetval】个【敌军】
3	1	自身
3	2	自身以及一个友军
3	3	有效范围内【targetval】个【友军】
4	随意值	有效范围内【targetval】个【友军】
5	1	我军前锋
6	随意值	无需描述
7	1	我军中军
8	1	我军大营
9	1	敌军前锋
10	1	敌军中军
11	1	有效范围内的最远的敌军
 */
NumUnit.getNewArray = function(isNext, cfgData, cardData,type, ccc){
    if(cfgData == null){
        return "";
    }

    var txt = type ? cfgData.upgradenote : cfgData.note;
    var vadd = 0;
    if( typeof(isNext) == "boolean"){
        vadd = isNext ? 1 : 0;
    }else if(typeof(isNext) == "number"){
        vadd = isNext;
    }
    var v = [];
    var idArr = type ? JSON.parse(cfgData.upgradenoteBuffId) : JSON.parse(cfgData.noteBuffId);
    var keyArr = NumUnit.createNewArrForNoteStr(type ?  cfgData.upgradenoteField.toString() : cfgData.noteField.toString());
    var va,peizhi;
    for(var i=0; i < idArr.length; i++){
        if(keyArr[i] == "val" || keyArr[i] == "activeprob"){
            if(cardData&& cardData.hasOwnProperty("learnPos") && cardData["skill" + cardData.learnPos +"cfgid"] > 0){
                peizhi = Config.buff[idArr[i]][keyArr[i]];
                if(peizhi.length > (cardData["skill" +cardData.learnPos + "lv"] - 1 + vadd) ){
                    va = peizhi[cardData["skill" +cardData.learnPos + "lv"] - 1 + vadd];
                }else{
                    va = peizhi[peizhi.length-1];
                }

            }else{
                var lv = 0;
                va = Config.buff[idArr[i]][keyArr[i]][lv + vadd];
            }
            if(keyArr[i] == "activeprob"){
                va /= 100;
                va = NumUnit.keepDecimal(va, 2);
            }
        }else{

            va = 1;
            if(keyArr[i] == "target"){
                var linkSkill = Config.skill[idArr[i]];
                if(!linkSkill){
                    cc.log("找不到技能id配置表，请检查，配置id" + idArr[i]);
                    continue;
                }
                var type = linkSkill.targettype;
                var typeval = linkSkill.targetval;
                va = typeval;
                typeval = typeval.toString().replace(".", "-");
                var targetmsg =  "";
                if(type == 1){
                    targetmsg = cc.formatStr(LANSTR.yxjlyj, typeval);
                }else if(type == 2){
                    targetmsg =  cc.formatStr(LANSTR.yxjldj, typeval);
                }else if(type == 3){
                    if(typeval == 1){
                        targetmsg = LANSTR.own;
                    }else if(typeval == 2){
                        targetmsg = LANSTR.zsyjygyj;
                    }else if(typeval == 3){
                        targetmsg = cc.formatStr(LANSTR.yxjlyj, typeval);
                    }
                }else if(type == 4){
                    targetmsg = cc.formatStr(LANSTR.yxjlyj, typeval);
                }else if(type == 5){
                    if(typeval == 1){
                        targetmsg = LANSTR.wjqf;
                    }
                }else if(type == 6){
                    targetmsg = "";
                }else if(type == 7){
                    if(typeval == 1){
                        targetmsg = LANSTR.wjzj;
                    }
                }else if(type == 8){
                    if(typeval == 1){
                        targetmsg = LANSTR.wjdy;
                    }
                }else if(type == 9){
                    if(typeval == 1){
                        targetmsg = LANSTR.djqf;
                    }
                }else if(type == 10){
                    if(typeval == 1){
                        targetmsg = LANSTR.djzj;
                    }
                }else if(type == 11){
                    if(typeval == 1){
                        targetmsg = LANSTR.yxjlndzydj;
                    }
                }

                if(targetmsg){
                    // va = txt.replace("%s" + (i + 1), targetmsg);
                    va = targetmsg;
                }
            }else{
                va = Config.buff[idArr[i]][keyArr[i]];
                if(keyArr[i] == "starttime" && va == 0){
                    va = 1;
                }
            }
        }
        var obj = {sign:"s"+(i+1), value: typeof va == "string" ? va : Math.abs(va), color: ccc ? ccc : cc.color.WHITE};
        v.push(obj);
    }


    return NumUnit.getSplitTxt(txt, v, cc.color.WHITE);
};

/**
 * 获取装备属性颜色
 */
NumUnit.getPropertyColor = function (data) {
    var rune = [];
    if (data.rune) {
        for (var i = 0; i < data.rune.length; i++) {
            rune.push(data.rune[i].configInfo.id);
        }
    }
    var obj = NumUnit.getRecastInfo(data.configInfo.id, gamePlayer.forgingLv, data.quality, rune);
    var obj2 = {};

    for(var name in TypeConst.sxName) {
        var ee = obj["E" + name];
        if(ee) {
            obj2["CE" + name] = NumUnit.getProColor(data[name], ee.min, ee.max);
        }

        ee = obj["R1" + name];
        if(ee) {
            obj2["CR1" + name] = NumUnit.getProColor(data.rune[0][name], ee.min, ee.max);
        }

        ee = obj["R2" + name];
        if(ee) {
            obj2["CR2" + name] = NumUnit.getProColor(data.rune[1][name], ee.min, ee.max);
        }
    }
    return obj2;
};

/**
 * 根据区间 获取颜色
 */
NumUnit.getProColor = function (val, min, max, defaultColor) {
    // 默认色
    defaultColor = defaultColor || gameColor.colorffffff;

    if (min == max)
        return defaultColor;

    var pro = (val - min) / (max - min);
    if (pro > 0.8)
        return gameColor.coloree304f;
    else if (pro > 0.6)
        return gameColor.colorfe7109;
    else if (pro > 0.4)
        return gameColor.coloraa07ff;
    else if (pro > 0.2)
        return gameColor.color46ca18;

    return defaultColor;
};

/**
 * 获得装备重铸后数值范围 | 铸造
 * @param configId 配置表ID
 * @param castLevel 锻造等级
 * @param quality 锻造的品质 (负数 为可锻造的最大最小品质)
 * @returns {Object}
 */
NumUnit.getRecastInfo = function (configId, castLevel, quality, runes) {
    var attr = ["attack","defence","magic","destroy","speed","resistance","damage","magicfind","critical","healingbuff", "troops"];
    var equip = Config.equipment[configId];
    var obj = {};

    if (equip) {
        for(var i = 0; i < attr.length; i++){
            if(quality > 0) {
                var base = equip[attr[i]][0][quality - 1];
                var fix = equip[attr[i]][1];
                var min = base * (1 + fix[0] / 100) * (1 - fix[1] / 100);
                var max = base * (1 + fix[0] / 100) * (1 + fix[1] / 100);

                var key = "E" + attr[i];
                obj[key] = {};
                obj[key].min = parseInt(min);
                obj[key].max = parseInt(max);

            } else {
                var quality2 = -quality;

                var base = equip[attr[i]][0][0];
                var base2 = equip[attr[i]][0][quality2 - 1];
                var fix = equip[attr[i]][1];
                var min = base * (1 + fix[0] / 100) * (1 - fix[1] / 100);
                var max = base2 * (1 + fix[0] / 100) * (1 + fix[1] / 100);

                var key = "E" + attr[i];
                obj[key] = {};
                obj[key].min = parseInt(min);
                obj[key].max = parseInt(max);
            }
        }
    }

    // 符石增加
    if (runes) {
        for(var i = 0; i < runes.length; i++){
            var runeitem = Config.rune[runes[i]];
            if(runeitem == null){
                // cc.error("符石配置表有错误，请检查");
                continue;
            }
            for(var j = 0; j < attr.length; j++) {
                var key = "R" + (i+1) + attr[j];
                obj[key] = {};
                obj[key].min = runeitem[attr[j]].length > 0 ? runeitem[attr[j]][0] : 0;
                obj[key].max = runeitem[attr[j]].length > 0 ? runeitem[attr[j]][1] : 0;
            }
        }
    }

    // 锻造增加
    if(!castLevel)
        return obj;

    var obj2 = {};
    var attr2 = ["random", "damage", "attack","magic", "defence","resistance", "speed","destroy","magicfind","critical","healingbuff", "troops"];
    for(var i = 1; i <= castLevel && castLevel <= 100; i++){
        var forging = Config.forging[i];
        if(forging == null){
            cc.error("锻造配置表有错误，请检查");
            continue;
        }

        for(var j = 0; j < forging.bufftype.length; j++){
            var key = attr2[forging.bufftype[j]];
            if(!obj2[key]){
                obj2[key] = {};
                obj2[key].value = 0;
            }
            obj2[key].value += forging.buffvalue[j];
        }
    }

    for(var i in obj){
        if(i.indexOf("E") >= 0){
            var kk = i.slice(1);
            if(obj2[kk]){
                obj[i].min = parseInt((obj2[kk].value + 10000) * obj[i].min / 10000);
                obj[i].max = parseInt((obj2[kk].value + 10000) * obj[i].max / 10000);
            }
        }
        if(i.indexOf("R") >= 0){
            var kk = i.slice(2);
            if(obj2[kk]){
                obj[i].min = parseInt((obj2[kk].value + 10000) * obj[i].min / 10000);
                obj[i].max = parseInt((obj2[kk].value + 10000) * obj[i].max / 10000);
            }
        }
    }

    return obj;
};

/**
 * a* 寻路算法
 * @param start 开始的点
 * @param end 结束的点
 * @param points 地图数组
 * @param width 地图宽
 * @param height 地图高
 * @param isFour 是否是四个点寻路(false:八个方向点 true:四个方向点)
 * @returns {Object}
 */
NumUnit.findPath = function (start, end, points, width, height, isFour) {
    if (!start || !end || !points)
        return false;

    if (start.x == end.x && start.y == end.y)
        return false;

    var opens = [];
    var closes = [];
    var cur = null;

    var straightCost = 1.0;
    var diagCost = Math.sqrt(2);

    // 曼哈顿
    var manhattan = function (node) {
        var a = Math.abs(node.x - end.x) * straightCost;
        var b = Math.abs(node.x - end.x) * straightCost;
        return a+b;
    };

    // 欧几里得
    var euclidian = function (node) {
        var dx = node.x - end.x;
        var dy = node.y - end.y;
        return Math.sqrt(dx * dx + dy * dy) * straightCost;
    };

    // 斜线
    var diagonal = function (node) {
        var dx = Math.abs(node.x - end.x);
        var dy = Math.abs(node.y - end.y);
        var diag = Math.min(dx, dy);
        var staight = dx + dy;
        return diagCost * diag + straightCost * (staight - 2 * diag);
    };

    var inList = function (list, current) {
        for (var i = 0, len = list.length; i < len; i++) {
            if ((current.x == list[i].x && current.y == list[i].y) || (current == list[i]))
                return true;
        }
        return false;
    };

    start.G = 0;
    start.H = diagonal(start);
    start.F = start.G + start.H;

    closes.push(start);
    cur = start;

    while (!(cur.x == end.x && cur.y == end.y)) {
        var startX = Math.max(0, cur.x - 1);
        var endX = Math.min(width - 1, cur.x + 1);

        var startY = Math.max(0, cur.y - 1);
        var endY = Math.min(height - 1, cur.y + 1);

        for (var i = startX; i <= endX; i++) {
            for (var j = startY; j <= endY; j++) {
                if (isFour && i != cur.x && j != cur.y)
                    continue;

                if (!points[i])
                    continue;

                var node = points[i][j];
                if (!node)
                    continue;

                if ((node.x == cur.x && node.y == cur.y) || node.val != "z" || cur.val != "z")
                    continue;

                var cost = straightCost;
                if (!((cur.x == node.x) || (cur.y == node.y)))
                    cost = diagCost;

                var g = cur.G + cost * 1.0;
                var h = diagonal(node);
                var f = g + h;
                var isInOpen = inList(opens, node);
                var isInClosed = inList(closes, node);
                if (isInOpen || isInClosed) {
                    if (node.F > f) {
                        node.F = f;
                        node.G = g;
                        node.H = h;
                        node.P = cur;
                        if (isInOpen) {
                            opens.sort(function (a, b) {
                                return a.F - b.F;
                            });
                        }
                    }
                }
                else {
                    node.F = f;
                    node.G = g;
                    node.H = h;
                    node.P = cur;
                    opens.push(node);
                }
            }
        }
        closes.push(cur);
        if (!opens.length) {
            cur = null;
            opens = [];
            closes = [];
            break;
        }
        cur = opens.shift();
    }

    if (!cur)
        return false;

    var dotCur = end;
    var path = [];

    while (!(dotCur.x == start.x && dotCur.y == start.y)) {
        path.unshift(dotCur);
        dotCur = dotCur.P;
        if (!dotCur) {
            break;
        }
    }

    if (path.length) {
        return path;
    }

    return false;
};

/**
 * a* 寻路算法
 * @param start 开始的点
 * @param end 结束的点
 * @param points 地图数组
 * @param width 地图宽
 * @param height 地图高
 * @param isFour 是否是四个点寻路(false:八个方向点 true:四个方向点)
 * @returns {Object}
 */
NumUnit.findPath2 = function (start, end, points, width, height, isFour) {
    if (!start || !end || !points)
        return false;

    if (start.x == end.x && start.y == end.y)
        return false;

    var opens = [];
    var closes = [];
    var cur = null;

    var straightCost = 1.0;
    var diagCost = Math.sqrt(2);

    // 曼哈顿
    var manhattan = function (node) {
        var a = Math.abs(node.x - end.x) * straightCost;
        var b = Math.abs(node.x - end.x) * straightCost;
        return a+b;
    };

    // 欧几里得
    var euclidian = function (node) {
        var dx = node.x - end.x;
        var dy = node.y - end.y;
        return Math.sqrt(dx * dx + dy * dy) * straightCost;
    };

    // 斜线
    var diagonal = function (node) {
        var dx = Math.abs(node.x - end.x);
        var dy = Math.abs(node.y - end.y);
        var diag = Math.min(dx, dy);
        var staight = dx + dy;
        return diagCost * diag + straightCost * (staight - 2 * diag);
    };

    var inList = function (list, current) {
        for (var i = 0, len = list.length; i < len; i++) {
            if ((current.x == list[i].x && current.y == list[i].y) || (current == list[i]))
                return true;
        }
        return false;
    };

    start.g = 0;
    start.h = diagonal(start);
    start.f = start.g + start.h;

    closes.push(start);
    cur = start;

    while (!(cur.x == end.x && cur.y == end.y)) {
        var startX = Math.max(0, cur.x - 1);
        var endX = Math.min(width - 1, cur.x + 1);

        var startY = Math.max(0, cur.y - 1);
        var endY = Math.min(height - 1, cur.y + 1);

        for (var i = startX; i <= endX; i++) {
            for (var j = startY; j <= endY; j++) {
                if (isFour && i != cur.x && j != cur.y)
                    continue;

                if (!points[i])
                    continue;

                var node = points[i][j];
                if (!node)
                    continue;

                if ((node.x == cur.x && node.y == cur.y) || !node.walkable || !cur.walkable)
                    continue;

                var cost = straightCost;
                if (!((cur.x == node.x) || (cur.y == node.y)))
                    cost = diagCost;

                var g = cur.g + cost * 1.0;
                var h = diagonal(node);
                var f = g + h;
                var isInOpen = inList(opens, node);
                var isInClosed = inList(closes, node);
                if (isInOpen || isInClosed) {
                    if (node.f > f) {
                        node.f = f;
                        node.g = g;
                        node.h = h;
                        node.parent = cur;
                        if (isInOpen) {
                            opens.sort(function (a, b) {
                                return a.f - b.f;
                            });
                        }
                    }
                }
                else {
                    node.f = f;
                    node.g = g;
                    node.h = h;
                    node.parent = cur;
                    opens.push(node);
                }
            }
        }
        closes.push(cur);
        if (!opens.length) {
            cur = null;
            opens = [];
            closes = [];
            break;
        }
        cur = opens.shift();
    }

    if (!cur)
        return false;

    var dotCur = end;
    var path = [];

    while (!(dotCur.x == start.x && dotCur.y == start.y)) {
        path.unshift(dotCur);
        dotCur = dotCur.parent;
        if (!dotCur) {
            break;
        }
    }

    if (path.length) {
        return path;
    }

    return false;
};

/**
 * 装备读取状态
 * @param eId 装备ID
 * @param isread 是否读取（true: 从表中删除 false:添加到未读表）
 * @param type 0装备 1阵图
 */
NumUnit.readStateByEquipmentAndLineup = function (eId, isread, type) {
    var key = type ? "lineup_read" : "equip_read";

    var readArr = JSON.parse(cc.sys.localStorage.getItem(key));
    if (!readArr)
        readArr = [];

    var ishas = false;

    if (!isread) {
        readArr.push(eId);
        ishas = true;
    }
    else {
        for (var i in readArr) {
            if (readArr[i] == eId) {
                readArr.splice(i, 1);
                ishas = true;
                break;
            }
        }
    }

    if (ishas) {
        var ss = JSON.stringify(readArr);
        cc.sys.localStorage.setItem(key, ss);
    }
};

/**
 * 获得装备读取状态表
 * @returns {array}
 */
NumUnit.getReadStateByEquipmentAndLineup = function (type) {
    var key = type ? "lineup_read" : "equip_read";
    var arr = JSON.parse(cc.sys.localStorage.getItem(key));
    if (!arr)
        arr = [];
    return arr;
};

/**
 * 清空装备读取状态表
 * @returns {array}
 */
NumUnit.clearReadStateByEquipmentAndLineup = function (type) {
    var key = type ? "lineup_read" : "equip_read";
    cc.sys.localStorage.setItem(key, "[]");
};

/**
 * 转换格子坐标
 * 主要使用在外城和幻境
 * @returns {object}
 * */
NumUnit.convertStagePosition = function (x, y) {
    return cc.p(x * StageDefine.gridWidth + StageDefine.gridWidth / 2, y * StageDefine.gridWidth + StageDefine.gridWidth / 2);
};

/**
 * 获得关卡数据根据城池ID
 * @returns {object}
 */
NumUnit.getStageByCityId = function (cityId) {
    for (var key in Config.level) {
        var level = Config.level[key];
        if (!level || 0 != level.isfairyland)
            continue;
        for (var i = 0, len = level.linkcity.length; i < len; i++) {
            if (cityId == level.linkcity[i]) {
                return level;
            }
        }
    }
    return null;
};

//全角转半角
NumUnit.ToCDB = function(str){
    var tmp = "";
    str = str.toString();
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 65248 && str.charCodeAt(i) < 65375) {
            tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
        }
        else {
            tmp += String.fromCharCode(str.charCodeAt(i));
        }
    }
    return tmp;
};

//半角转全角
NumUnit.ToDBC = function(txtstring){
    var tmp = "";
    txtstring = txtstring.toString();
    for (var i = 0; i < txtstring.length; i++) {
        if (txtstring.charCodeAt(i) == 32) {
            tmp = tmp + String.fromCharCode(12288);
        }
        if (txtstring.charCodeAt(i) < 127) {
            tmp = tmp + String.fromCharCode(txtstring.charCodeAt(i) + 65248);
        }else {
            tmp += String.fromCharCode(txtstring.charCodeAt(i));
        }
    }
    return tmp;
};

//切割
NumUnit.splitMsg = function(msg){
    // 全部转为半角
    msg = NumUnit.ToCDB(msg);
    // 提取坐标满足（%d,%d) %d,%d
};

/**
 * 删除资源 plist|png
 * @param resources
 */
NumUnit.removeTextureKey = function (resources) {
    for (var i in resources) {
        if (resources[i].indexOf(".plist") >= 0) {
            cc.spriteFrameCache.removeSpriteFramesFromFile(resources[i]);
        } else {
            cc.textureCache.removeTextureForKey(resources[i]);
        }
        cc.loader.release(resources[i]);
    }
};

NumUnit.chNum = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
NumUnit.chNum2 = ["","十","百","千"];
