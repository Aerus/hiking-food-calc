/**
 * Created by Serhii_Kotyk on 3/26/14.
 */
function AsyncQueue(){
    var MAX_SUCCES_HANDLERS = 100,
        queue = [],
        successhandlers = [],
        onsuccess = function(handler){
            if (handler){
                successhandlers.push(handler);
                return this;
            }else{
                var f = successhandlers.pop();
                for (var i = 0; i < MAX_SUCCES_HANDLERS; i++){
                    if (f){
                        f(this);
                        f = successhandlers.pop();
                    }else{
                        break;
                    }
                }
            }
        },
        call = function(element){
            element.f.apply(element.c, element.a);
        },
        callNext = function(){
            var next = queue[0];
            if (next){
                call(next);
            }else{
                onsuccess();
            }
        },
        callback = function(data){
            queue.shift();
            callNext();
        },
        errorCallback = function(error){
            console.log(queue[0], error);
        };

    this.Queue = function(q){
        if (q){
            queue = q;
            return this;
        }else{
            return queue;
        }
    };

    this.add = function(func, context, args){
        queue.push({
                       f: func,
                       c: context,
                       a: args || [this.getCallback(), this.getErrorCallback()]
                   });
        return this;
    };

    this.start = function(){
        callNext();
    },

    this.onsuccess = function(handler){
       if (handler){
           onsuccess(handler);
       }
    },

    this.getCallback = function(){
        return callback;
    };

    this.getErrorCallback = function(){
        return errorCallback;
    }
}

Class('AsyncQueue', AsyncQueue);