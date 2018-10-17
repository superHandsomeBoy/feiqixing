var EventCost = {};

// 地图长,宽
EventCost.MAP = {};
EventCost.MAP.width = 36;
EventCost.MAP.height = 36;
EventCost.MAP.diss = 17;

// 色字的宽高
EventCost.defaultWidth = 100;
EventCost.defaultHeight = 100;


// 显示跳点文本信息
EventCost.showJumpPonitLabel    = false;
// 显示中点文本信息
EventCost.showMidPonitLabel     = false;
// 显示出发点文本信息
EventCost.showBirthPonitLabel   = false;
// 显示棋子初始点文本信息
EventCost.showInitPonitLabel    = false;
// 显示飞点文本信息
EventCost.showFlyPonitLabel     = false;
// 显示画线
EventCost.showLinePonitLabel    = false;

// 蓝色初始点
EventCost.bluePoints    = [4, 4, 6, 4, 4, 6, 6, 6];
// 黄色初始点
EventCost.yellowPoints  = [30, 4, 32, 4, 30, 6, 32, 6];
// 绿色初始点
EventCost.greenPoints   = [4, 30, 6, 30, 4, 32, 6, 32];
// 红色初始点
EventCost.redPoints     = [30, 30, 32, 30, 30, 32, 32, 32];


// 蓝色出发点
EventCost.blueBirthPoint    = [10, 2];

// 黄色出发点
EventCost.yellowBirthPoint  = [34, 10];

// 绿色出发点
EventCost.greenBirthPoint   = [2, 26];

// 红色出发点
EventCost.redBirthPoint     = [26, 34];

// 中间点
EventCost.middBirthPoint    = [18, 18];

// 绿色路线
EventCost.greenPath     = [4, 24, 6, 25, 8, 25, 10, 24, 12, 26, 11, 28, 11, 30, 12, 32, 14, 33, 16, 33, 18, 33, 20, 33, 22, 33, 24, 32, 25, 30, 25, 28, 24, 26, 26, 24, 28, 25, 30, 25, 32, 24,
                            33, 22, 33, 20, 33, 18, 33, 16, 33, 14, 32, 12, 30, 11, 28, 11, 26, 12, 24, 10, 25, 8, 25, 6, 24, 4, 22, 3, 20, 3, 18, 3, 16, 3, 14, 3, 12, 4, 11, 6, 11, 8, 12, 10,
                            10, 12, 8, 11, 6, 11, 4, 12, 3, 14, 3, 16, 3, 18, 6, 18, 8, 18, 10, 18, 12, 18, 14, 18, 16, 18];

// 红色路线
EventCost.redPath       = [24, 32, 25, 30, 25, 28, 24, 26, 26, 24, 28, 25, 30, 25, 32, 24, 33, 22, 33, 20, 33, 18, 33, 16, 33, 14, 32, 12, 30, 11, 28, 11, 26, 12, 24, 10, 25, 8, 25, 6, 24, 4,
                            22, 3, 20, 3, 18, 3, 16, 3, 14, 3, 12, 4, 11, 6, 11, 8, 12, 10, 10, 12, 8, 11, 6, 11, 4, 12, 3, 14, 3, 16, 3, 18, 3, 20, 3, 22, 4, 24, 6, 25, 8, 25, 10, 24, 12, 26,
                            11, 28, 11, 30, 12, 32, 14, 33, 16, 33, 18, 33, 18, 30, 18, 28, 18, 26, 18, 24, 18, 22, 18, 20];

// 黄色路线
EventCost.yellowPath    = [32, 12, 30, 11, 28, 11, 26, 12, 24, 10, 25, 8, 25, 6, 24, 4, 22, 3, 20, 3, 18, 3, 16, 3, 14, 3, 12, 4, 11, 6, 11, 8, 12, 10, 10, 12, 8, 11, 6, 11, 4, 12, 3, 14, 3,
                            16, 3, 18, 3, 20, 3, 22, 4, 24, 6, 25, 8, 25, 10, 24, 12, 26, 11, 28, 11, 30, 12, 32, 14, 33, 16, 33, 18, 33,20, 33, 22, 33, 24, 32, 25, 30, 25, 28, 24, 26, 26, 24,
                            28, 25, 30, 25, 32, 24, 33, 22, 33, 20, 33, 18, 30, 18, 28, 18, 26, 18, 24, 18, 22, 18, 20, 18];

// 蓝色路线
EventCost.bluePath      = [12, 4, 11, 6, 11, 8, 12, 10, 10, 12, 8, 11, 6, 11, 4, 12, 3, 14, 3, 16, 3, 18, 3, 20, 3, 22, 4, 24, 6, 25, 8, 25, 10, 24, 12, 26, 11, 28, 11, 30, 12, 32, 14, 33, 16,
                            33, 18, 33, 20, 33, 22, 33, 24, 32, 25, 30, 25, 28, 24, 26, 26, 24,28, 25, 30, 25, 32, 24,33, 22, 33, 20, 33, 18, 33, 16, 33, 14, 32, 12, 30, 11, 28, 11, 26, 12, 24,
                            10, 25, 8, 25, 6, 24, 4, 22, 3, 20, 3, 18, 3, 18, 6, 18, 8, 18, 10, 18, 12, 18, 14, 18, 16];


// 绿色跳点
EventCost.greenJumpPonit    = [];

// 红色跳点
EventCost.redJumpPonit      = [];

// 黄色跳点
EventCost.yellowJumpPonit   = [];

// 蓝色跳点
EventCost.blueJumpPonit     = [];



// 绿色飞点
EventCost.greenFlyPonit    = [26, 24, 26, 12];

// 红色飞点
EventCost.redFlyPonit      = [24, 10, 12, 10];

// 黄色飞点
EventCost.yellowFlyPonit   = [10, 12, 10, 24];

// 蓝色飞点
EventCost.blueFlyPonit     = [12, 26, 24, 26];


// 绿色信息
EventCost.greenInfo  = {color:"green",  path: EventCost.greenPath,  birth:EventCost.greenBirthPoint,  init:EventCost.greenPoints,   jumpPoint: EventCost.greenJumpPonit,  flyPoint: EventCost.greenFlyPonit,    color2: cc.color.GREEN};
// 红色信息
EventCost.redInfo    = {color:"red",    path: EventCost.redPath,    birth:EventCost.redBirthPoint,    init:EventCost.redPoints,     jumpPoint: EventCost.redJumpPonit,    flyPoint: EventCost.redFlyPonit,      color2: cc.color.RED};
// 黄色信息
EventCost.yellowInfo = {color:"yellow", path: EventCost.yellowPath, birth:EventCost.yellowBirthPoint, init:EventCost.yellowPoints,  jumpPoint: EventCost.yellowJumpPonit, flyPoint: EventCost.yellowFlyPonit,   color2: cc.color.YELLOW};
// 蓝色信息
EventCost.blueInfo   = {color:"blue",   path: EventCost.bluePath,   birth:EventCost.blueBirthPoint,   init:EventCost.bluePoints,    jumpPoint: EventCost.blueJumpPonit,   flyPoint: EventCost.blueFlyPonit,     color2: cc.color.BLUE};


// 棋子状态信息
EventCost.QiziStatu = {};
// 棋子在等候状态(出生地)
EventCost.QiziStatu.BIRTH    = 0;

// 棋子在棋盘上(等候)
EventCost.QiziStatu.WAIT    = 1;

//棋子在棋盘上（行走）
EventCost.QiziStatu.MOVE    = 2;

// 棋子在终点
EventCost.QiziStatu.END     = 3;



// 棋子移动时间
EventCost.QiziMoveTime  = .3;

EventCost.QiziNums      = 4;

// 游戏状态
EventCost.Game_State = {};
EventCost.Game_State.star = 0;
EventCost.Game_State.end = 1;


// 起飞数字
EventCost.birthNum = [5, 6];

// 操作时间
EventCost.moveOppTime = 10;

// 将数组转化坐标
EventCost.switchPos = function(x, y){
    return cc.p(x * EventCost.MAP.diss, y * EventCost.MAP.diss);
};