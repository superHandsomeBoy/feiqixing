/**
 * Created by Administrator on 2014/11/3.
 */

var _event_dispatcher_shared = null;

var EventDispatcher = cc.Class.extend({
    //_delegatesMap: [],
    keyMap:{},

    addListener: function (key, callback, delegate) {
        if (!delegate) return;
        if(!this.keyMap.hasOwnProperty(key)){
            this.keyMap[key] = [];
        }

        var delegateObj = this.getDelegateObjByDelegate(this.keyMap[key],delegate);

        if(!delegateObj){
            delegateObj = {"delegate":delegate,"callbackList":[]};
            this.keyMap[key].push(delegateObj);
        }

        var alreadyhascallback = false;
        for(var i=0;i<delegateObj["callbackList"].length;i++){
            if(delegateObj["callbackList"] == callback){
                alreadyhascallback = true;
                break;
            }
        }

        if(!alreadyhascallback){
            delegateObj["callbackList"].push(callback);
        }


        //if (!delegate) return;
        //var listeners = this.containsDelegate(delegate);
        //if (!listeners) {
        //    listeners = {};
        //    this._delegatesMap.push({delegate: delegate, listeners: listeners});
        //}
        //if (listeners[key]) {
        //    listeners[key].push(callback);
        //} else {
        //    listeners[key] = [callback];
        //}
    },

    getDelegateObjByDelegate:function(list,delegate){
        for(var i=0;i<list.length;i++){
            if(list[i].delegate == delegate){
                return list[i];
            }
        }
        return null;
    },

    //containsDelegate: function (delgate) {
    //    for (var i=0;i<this._delegatesMap.length;i++) {
    //        if (this._delegatesMap[i].delegate == delgate) {
    //            return this._delegatesMap[i].listeners;
    //        }
    //    }
    //    return null;
    //},

    /**
     * 删除所有相关事件类型的监听
     * @param key
     */
    removeListener: function (key) {
        delete this.keyMap[key];

        //for (var i = 0; i < this._delegatesMap.length; i++) {
        //    var listeners = this._delegatesMap[i].listeners;
        //    if(listeners.hasOwnProperty(key)){
        //        listeners[key] = null;
        //        delete listeners[key];
        //        var count = 0;
        //        for (var j in listeners) {
        //            if(listeners.hasOwnProperty(j)){
        //                count++;
        //            }
        //        }
        //        if (!count) {
        //            this._delegatesMap[i].delegate = null;
        //            this._delegatesMap[i].listeners = null;
        //            this._delegatesMap[i] = null;
        //            this._delegatesMap.splice(i, 1);
        //
        //            i--;
        //        }
        //    }
        //}
    },

    /**
     * 根据代理delegate删除相对应事件类型key监听
     * @param delegate
     * @param key（可选参数）
     */
    removeListenerByDelgate: function (delegate, key) {
        if(key){
            var list = this.keyMap[key];
            if(!list){
                return;
            }
            for(var i=0;i<list.length;i++){
                if(list[i].delegate == delegate){
                    list[i].callbackList.length = 0;
                    list.splice(i,1);
                    break;
                }
            }
            if(list.length == 0){
                delete this.keyMap[key];
            }
            return;
        }else{
            for (var n in this.keyMap){
                var list = this.keyMap[n];
                for(var i=0;i<list.length;i++){
                    if(list[i].delegate == delegate){
                        list[i].callbackList.length = 0;
                        list.splice(i,1);
                        break;
                    }
                }
                if(list.length == 0){
                    delete this.keyMap[n];
                }
            }
        }

        //var i,j;
        //for (i = 0; i < this._delegatesMap.length; i++) {
        //    if (this._delegatesMap[i].delegate == delegate) {
        //        var listeners = this._delegatesMap[i].listeners;
        //        if (key) {
        //            if(listeners.hasOwnProperty(key)){
        //                listeners[key] = null;
        //                delete listeners[key];
        //            }
        //            var count = 0;
        //            for (j in listeners) {
        //                if(listeners.hasOwnProperty(j)){
        //                    count++;
        //                }
        //            }
        //            if (!count) {
        //                this._delegatesMap[i].delegate = null;
        //                this._delegatesMap[i].listeners = null;
        //                this._delegatesMap[i] = null;
        //                this._delegatesMap.splice(i, 1);
        //            }
        //        } else {
        //            this._delegatesMap[i].listeners = null;
        //            this._delegatesMap[i].delegate = null;
        //            this._delegatesMap[i] = null;
        //            this._delegatesMap.splice(i, 1);
        //        }
        //        break;
        //    }
        //}
    },

    dispatchEvent: function (key) {
        var args = arguments;
        var list = this.keyMap[key];
        if(!list){
            return;
        }
        var clonelist = list.slice(0);
        for(var i=0;i<clonelist.length;i++){
            var delegateObj = clonelist[i];
            for (var j=0;j<delegateObj.callbackList.length;j++){
                var cb = delegateObj.callbackList[j];
                cb.apply(delegateObj.delegate,args);
            }
        }


        //var args = arguments;
        //var listenerArr = [];
        //var delegatesArr = [];
        //for (var i=0;i<this._delegatesMap.length;i++) {
        //    if (!this._delegatesMap[i] || !this._delegatesMap[i].delegate) {
        //        continue;
        //    }
        //    var listeners = this._delegatesMap[i].listeners;
        //    if(listeners.hasOwnProperty(key)){
        //        var l = listeners[key];
        //        for (var k = 0; k < l.length; k++) {
        //            listenerArr.push(l[k]);
        //            delegatesArr.push(this._delegatesMap[i].delegate);
        //        }
        //    }
        //}
        //
        //for (var m = 0; m < listenerArr.length; m++) {
        //    listenerArr[m].apply(delegatesArr[m], args);
        //}
    },

    /**
     *
     * @param delegate
     * @param event
     * @returns {boolean}
     */
    hasEventListenerByDelegate: function (delegate, event) {
        if(!this.keyMap.hasOwnProperty(event)){
            return false;
        }

        var delegateObj = this.getDelegateObjByDelegate(this.keyMap[event],delegate);
        if(delegateObj==null){
            return false;
        }

        if(delegateObj.callbackList.length > 0){
            return true;
        }

        return false;

        //for (var i=0;i<this._delegatesMap.length;i++) {
        //    if (this._delegatesMap[i].delegate == delegate) {
        //        var listeners = this._delegatesMap[i].listeners;
        //        if(listeners.hasOwnProperty(event) && listeners[event].length>0){
        //            return true;
        //        }
        //        break;
        //    }
        //}
        //return false;
    },

    /**
     *
     * @param delegate
     * @param event
     * @param args
     */
    dispatchEventByDelegate: function (delegate, event, target, args) {
        if(!this.keyMap.hasOwnProperty(event)){
            return;
        }
        var delegateObj = this.getDelegateObjByDelegate(this.keyMap[event],delegate);
        if(delegateObj==null){
            return;
        }

        for(var i=0;i<delegateObj.callbackList.length;i++){
            if(target){
                delegateObj.callbackList[i].apply(target,args);
            }else{
                delegateObj.callbackList[i].apply(delegate,args);
            }
        }


        //for (var i=0;i<this._delegatesMap.length;i++) {
        //    if (this._delegatesMap[i].delegate == delegate) {
        //        var listeners = this._delegatesMap[i].listeners;
        //        if(listeners.hasOwnProperty(event)){
        //            var listenerArr = listeners[event];
        //            for (var k = 0; k < listenerArr.length; k++) {
        //                if (target == undefined) {
        //                    listenerArr[k].apply(delegate, args);
        //                } else {
        //                    listenerArr[k].apply(target, args);
        //                }
        //            }
        //        }
        //    }
        //}
    }

});

EventDispatcher.shared = function () {
    if (_event_dispatcher_shared == null) {
        _event_dispatcher_shared = new EventDispatcher();
    }
    return _event_dispatcher_shared;
};