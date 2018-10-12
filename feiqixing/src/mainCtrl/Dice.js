var Dice = cc.Sprite.extend({

    _num:null,

    ctor:function (num) {
        this._num = num;
        this._super(resplist.dices, cc.rect(num * EventCost.defaultWidth, 0, EventCost.defaultWidth, EventCost.defaultHeight));
    },

    getNum:function(){
        return this._num;
    },

    onExit:function () {
      this._super();
    },
});