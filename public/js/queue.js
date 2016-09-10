/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



/* https://gist.github.com/Benvie/9988604*/

var MISSING = {};
var QUEUE_COMPACT_SIZE = 500;

function define(object, properties) {
    for (var key in properties) {
        //noinspection JSUnfilteredForInLoop
        var desc = Object.getOwnPropertyDescriptor(properties, key);
        desc.enumerable = false;
        //noinspection JSUnfilteredForInLoop
        Object.defineProperty(object, key, desc);
    }
}



function ArrayQueue() {
    this.size = 0;
    this._head = 0;
    this._items = [];
}

//noinspection JSUnusedGlobalSymbols,JSUnusedGlobalSymbols
define(ArrayQueue.prototype, {
    emptyp: function emptyp() {
        return this.size==0;
    },

    push: function push(value) {
        this._items.push(value);
        return ++this.size;
    },
    shift: function shift() {
        if (this.size) {
            var value = this._items[this._head];
            if (this._head === QUEUE_COMPACT_SIZE) {
                this._items = this._items.slice(this._head + 1);
                this._head = 0;
                this.size--;
            } else {
                this._items[this._head++] = MISSING;
            }
            return value;
        }
    },
    clear: function clear() {
        this.size = 0;
        this._head = 0;
        this._items.length = 0;
    },
    forEach: function forEach(callback, thisArg) {
        if (this.size) {
            for (var i = this._head, index = 0; i < this._items.length; i++) {
                var value = this._items[i];
                if (value !== MISSING) {
                    callback.call(thisArg, value, index++, this);
                }
            }
        }
    }
});

function ListQueue() {
    this.size = 0;
    this._tail = null;
    this._head = null;
}

//noinspection JSUnusedGlobalSymbols,JSUnusedGlobalSymbols
define(ListQueue.prototype, {
    push: function push(value) {
        if (this.size) {
            this._tail = this._tail[0] = [this._tail, value];
        } else {
            this._tail = this._head = [null, value];
        }
        return ++this.size;
    },
    shift: function shift() {
        if (this.size) {
            var value = this._head[1];
            this._head = this._head[0];
            this.size--;
            return value;
        }
    },
    clear: function clear() {
        this.size = 0;
        this._tail = null;
        this._head = null;
    },
    forEach: function forEach(callback, thisArg) {
        if (this.size) {
            var index = 0;
            var item = this._head;
            do {
                callback.call(thisArg, item[1], index++, this);
            } while (item = item[0])
        }
    }
});

/*
function assert(value, message) {
    if (!value) {
        throw message;
    }
}

function is(a, b, name) {
    assert(a === b, name + ": " + a + " isn't " + b);
}

function test(Queue) {
    var queue = new Queue();
    queue.push("a");
    queue.push("b");
    queue.push("c");
    is(queue.shift(), "a", Queue.name);
    is(queue.shift(), "b", Queue.name);
    is(queue.shift(), "c", Queue.name);
}
*/

/*
test(Array);
test(ArrayQueue);
test(ListQueue);
console.log('tests OK');
*/

//noinspection JSUnusedGlobalSymbols
var array = [];
//noinspection JSUnusedGlobalSymbols
var arrayQueue = new ArrayQueue();
//noinspection JSUnusedGlobalSymbols
var listQueue = new ListQueue();

//noinspection JSUnusedGlobalSymbols
function time(queue) {
    for (var i = 0; i < 3; i++) {
        queue.push(i);
    }
    var total = 0;
    while (i--) {
        total += queue.shift();
    }
    return total;
}

var Stack = function() {
    var functionSet=(function() {
        var _elements=[]; // creating a private array
        return [
            // push function
            function()
            { return _elements.push .apply(_elements,arguments); }
            // pop function
            , function()
            { return _elements.pop .apply(_elements,arguments); }
            , function() { return _elements.length; }
            , function(n) { return _elements.length=n; }
            , function () {
                return _elements[_elements.length-1];
            }
            , function (e) {
                return _elements.includes(e);
            }];
    })();
    this.push=functionSet[0];
    this.pop=functionSet[1];
    this.getLength=functionSet[2];
    this.setLength=functionSet[3];
    this.peek=functionSet[4];
    this.includes=functionSet[5];
    // initializing the stack with given arguments
    this.push.apply(this,arguments);
};

/*
 var s=new Stack(0,1), e;
 s.push(2);

 console.log('peek2='+s.peek());
 console.log(s.getLength()); // 3
 while(undefined!==(e=s.pop()))
 console.log('cool '+e); // 2, 1, 0

*/
//module.exports.Stack = Stack;
//module.exports.ArrayQueue = ArrayQueue;
//module.exports.ArrayQueue.wtf = ArrayQueue.wtf;
//module.exports.ListQueue = ListQueue;
