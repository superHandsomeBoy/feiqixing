var Player = cc.Class.extend({

    playerId:null,
    color:null,
    over:null,
    rank:null,

    ctor:function () {
        this.playerId = 0;
        this.color = "red";
        this.over = false;
        this.rank = 0;
    },
    
    initPlayer:function (color, playerId) {
        this.color = color;
        this.playerId = playerId;
    },
    
    serRank:function (rank) {
        this.rank = rank;
    },

    setOver:function (b) {
        this.over = b;
    },

    isOver:function () {
        return this.over;
    },

    getRank:function () {
        return this.rank;
    }

});
Player.create = function () {
    var player = new Player();
    return player;
};

var gamePlayer = Player.create();
