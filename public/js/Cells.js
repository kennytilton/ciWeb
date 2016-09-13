/* 
 * The MIT License
 *
 * Copyright 2016 Kenneth Tilton.
 *
 */

// --- utils ---

function clg() {
    console.log(Array.from(arguments).join(","));
}
function ast (test, msg) {
    console.assert(test,msg);
}
function find(x,y) {
    if (y.indexOf(x) !== -1) {
        return x;
    }
}
Array.prototype.somex = function (test) {
    for (let [_,elt] of this.entries()) {
        let res = test(elt);
        if (res) {
            return res;
        }
    }
    return null;
};



// --- the keys to dependency identification
var causation = new Stack();
var callStack = new Stack();
var depender = null;

var gNotToBe = false; // --- am I in the process of leaving the model?

// --- debug stuff ----------------
var gCPropDepth = 0;
var gCDebug = false;
var gStop = false; // emergency brake

// --- the clock behind integrity ------
var ppulse = 0;
function gpulse() {
    // todo see if this functional accessor is necessary
    return ppulse;
}


var gPar = null; // set up by cKids for use in Model constructor

var onePulsep = false;
var dpLogp = false;

function dataPulseNext(who = 'anon') {
    //clg('datapulsenext entry', who, ppulse);
    if ( !onePulsep ) {
        if ( dpLogp ) {
            clg(`dpnext ${who}`);
        }
        ppulse = ppulse+1;
        //clg(`ppulse now ${ppulse}`);
    }
    //clg(`pulseNext exits ${ppulse}`);
    return ppulse;
}

// --- library init/re-init during development ----
function cellsReset(options = {}) {
    gCDebug = options.debug;
    clientQHandler = options.clientQHandler;
    cellsInit();
}
function cellsInit () {
    //clg('initcells');
    ppulse = 0;
}

// --- data integrity mechanics in which state change is
// carefully choreographed
var deferChanges = false;
var clientQHandler = null;
var gCustomPropagator = null;
var gWithinIntegrity = false;
var gSlotObserver = {}; //keys will be slot (aka property) names

function gSlotObserverDef (slot, obs) {
    let xo = gSlotObserver[slot];
    if (xo) {
        clg(`gSlotObserverDef overwriting $(slot) observer`);
    }
    gSlotObserver[slot] = obs;
}
const qNotify = new ArrayQueue();
const qAwaken = new ArrayQueue();
const qClient = new ArrayQueue();
const qEphemReset = new ArrayQueue();
const qChange = new ArrayQueue();

function ufbAdd( q, task) {
    q.push( task);
}
function qDo (q) {
    let taskInfo = q.shift();
    if (taskInfo) {
        let [deferInfo, task] = taskInfo;
        task('oops', deferInfo); // sb q opcode
        qDo(q);
    }
}
function finBiz (q) {
    switch (q) {
        case qNotify:
            qDo(q);
            qDo(qAwaken);
            finBiz(qNotify.emptyp() ? qClient : qNotify);
            break;
        case qClient:
            (clientQHandler || qDo)(q);
            finBiz(qClient.emptyp() ? qEphemReset : qClient);
            break;
        case qEphemReset:
            qDo(q);
            finBiz(qChange);
            break;
        case qChange:
            let work = q.shift();
            if (work) {
                let [info, taskfn] = work;
                dataPulseNext('change');
                taskfn('change', info);
                finBiz(qNotify);
            } // else we fall out, business finished
    }
}

/// --- the integrity API ---------
function withoutCDependency(fn) {
    return c=>{ let sd = depender;
        depender = null;
        try {
            return fn(c);
        } finally {
            depender = sd;
        }
    };
}
function withoutIntegrity (fn) {
    let wi, dc, cs;
    wi = gWithinIntegrity;
    dc = deferChanges;
    cs = callstack;

    try {
        gWithinIntegrity = false;
        deferChanges = false;
        callstack = new Stack();
        fn();
    } finally {
        gWithinIntegrity = wi;
        deferChanges = dc;
        callStack = cs;
    }
}
function withIntegrity (queue, deferInfo, action) {
    if (gStop) return;

    if (gWithinIntegrity) {
        if (queue) {
            ufbAdd(queue, [deferInfo, action]);
            /*
             assignment is supposed to return the value being installed
             in the place, but if the SETF is deferred we return
             something that will help someone who tries to use
             the setf'ed value figure out what is going on:
             */
            return 'deferred-to-ufb';
        } else {
            /*
             So by not supplying an opcode one can get something
             executed immediately, potentially breaking data integrity
             but signifying by having coded  with-integrity
             that one is aware of this.

             If you have read this comment.
             */
            action(queue, deferInfo);
        }
    } else {
        let wi = gWithinIntegrity
            , dc = deferChanges;

        gWithinIntegrity = true;
        deferChanges = false;
        try {
            if ((!gpulse()) || queue === qChange) {
                dataPulseNext('cwi');
            }
            let result = action(queue, deferInfo);
            finBiz(qNotify);
            return result;
        } finally {
            gWithinIntegrity = wi;
            deferChanges = dc;
        }
    }
}
function withChg(id, fn) {
    withIntegrity( qChange, id, fn);
}

// --- internal Cell states
const kUnbound = "unbound";
const kUncurrent = "uncurrent";
const kValid = "valid";
const kAwake = "c-awake";
const kQuiesced = "c-quiesced";
const kNascent = "nascent";
const kOptimizedAwayp = "optimized-away";
const kOptimizeWhenValued = "optimize-when-valued";

// lazy options
const kOnceAsked = "lazy-once-asked";
const kUntilAsked = "lazy-until-asked";
const kAlways ="lazy-always";

// --- Cells ----------------------

class Cell {
    constructor(value, formula, inputp, ephemeralp, observer) {
        this.md = null; //when we get to Model, this will be the model of whic I am an attribute
        this.pulse = -1;
        this.pulseLastChanged = -1;
        this.pulseObserved = -1;
        this.lazy = null; // not a predicate (can hold, inter alia, :until-asked)
        this.callers = new Set();
        this.useds = new Set(); // formulas only
        this.ephemeralp = ephemeralp;
        this.inputp = inputp;
        this.observer = observer;
        this.optimize = !inputp;
        this.slotOwning = false; // uhoh
        this.unchangedTest = function(a,b) { return a===b;};
        this.unchangedIf = null;

        if (formula) {
            this.rule = formula;
            this.pv = kUnbound;
            this.state = kNascent;
            this.others = {}; // once a rule finds another model (see Model)
            // it can optionally save it here for the next evaluation.
            // That all happens in Cell.fm.
        } else {
            this.pv = value;
            this.state = kValid;
        }
        Object.defineProperty(this
            , 'v', {
                enumerable: true
                , get: this.slotValue
                , set: this.slotValueSet

            });
    }

    optimizedAwayp() {return this.state===kOptimizedAwayp;}
    unboundp() {return this.pv===kUnbound;}
    uncurrentp() {return this.pv===kUncurrent;}
    validp() {return !(this.unboundp() || this.uncurrentp());}
    valueState() {
        return this.unboundp() ?
                kUnbound : this.uncurrentp() ? kUncurrent : kValid;
    }
    named (n) {
        this.name=n;
        return this;
    }
    obs (fn) {
        this.observer = fn;
        return this;
    }
    valueChangedp (newv,oldv) {
        let uct = (this.unchangedIf || this.unchangedTest);
        ast(uct, 'unchanged test required');
        return !uct(newv, oldv);
    }
    currentp() {
        //clg(`currentp this pulse ${this.pulse} vs pulse ${gpulse()}`);
        return this.pulse >= gpulse();
    }
    pulseUpdate(key='anon') {
        if (!this.optimizedAwayp()) {
            ast(gpulse() >= this.pulse);
            this.pulse = gpulse();
        }
    }

    awaken() {
        console.assert(this.md,'whoa no md for '+this.name); // todo lose this for pure
        if (this.rule) {
            if (!this.currentp()) {
                //clg(`calcnset ${this.name} of ${this.md.name}`);
                this.calcNSet('c-awaken');
            }
        } else {
            //clg('awk pulses', gpulse(),this.pulseObserved);
            if (gpulse() > this.pulseObserved) {
                // apparently double calls have occurred
                /*if (this.md) {
                    clg('am I zapping??? '+this.name);
                    this.md[this.name] = this.pv;
                }*/
                //clg('awakenin obs!!!',this.name);
                this.observe(undefined,'awaken');
                this.ephemeralReset();
            }
        }
    } // --- coming to life JIT or forced


    // --- the offical slot access API
    slotValue() {
        let rv = undefined
            , self = this;
        //clg('slotValue entry '+self.name+' has md '+!self.md);
        withIntegrity(null,null, function () {
            let vPrior = self.pv;
            rv = self.ensureValueIsCurrent( 'c-read', null);
            //clg('evic said',rv.toString());
            if (!self.md && self.state === kNascent
                && gpulse() > self.pulseObserved) {
                self.state = kAwake;
                self.observe(vPrior, 'cget');
                self.ephemeralReset();
            }
        });
        if (depender) {
            depender.recordDependency(this);
        } //else clg('cget no depender '+rv);
        return rv;
    }
    slotValueSet(newv) {
        if (deferChanges) {
            throw `Assign to ${this.name} must be deferred by wrapping it in WITH-INTEGRITY`;
        } else if (find(this.lazy, [kOnceAsked, kAlways, true])) {
            this.valueAssume(newv, null);
        } else {
            withChg(this.name, ()=>{
                this.valueAssume( newv, null);
            });
        }
    }
    
    // --- dependency graph maintenance ----
    recordDependency(used) {
        if (!used.optimizedAwayp()) {
            //clg(`recdep ${this.name} usedby ${used.name}`);
            this.useds.add(used);
            ast(this.useds.size>0);
            used.callerEnsure(this);
        }
    }
    callerEnsure(caller) {
        this.callers.add(caller);
    }
    callerDrop(caller) {
        //clg(`dropping!! caller ${caller.name} of ${this.name}`);
        this.callers.delete(caller);
    }

    // --- a formula runs --------
    ensureValueIsCurrent(tag, ensurer) {
        //clg('evic entry ', this.name);
        if (gNotToBe) {
            //clg('not2be');
            return (this.boundp && this.validp()) ? this.pv : null;
        } else if (this.currentp()) {
            //clg('currentp',this.pulse,gpulse());
            return this.pv;
        } else if (this.inputp
                    && this.validp()
                    && !(this.rule && this.optimize === kOptimizeWhenValued
                        && !this.pv)) {
            //clg('inputp', this.name);
            return this.pv;
        } else if (this.md && this.md.mDeadp()) {
            throw `evic: read of dead ${this.name} of ${this.md.name}`;
        } else {
            let recalc = false;
            if (!this.validp()) {
                //clg('evic not validp');
                recalc = true;
            } else {
                for (let used of this.useds.values()) {
                    used.ensureValueIsCurrent('nested', this);
                    if (used.pulseLastChanged > this.pulse) {
                        recalc = true;
                        break;
                    }
                }
            }
            if (recalc) {
                if (!this.currentp()) {
                    // possible if a used's observer queried me
                    //clg('calcnset!!', this.name);
                    this.calcNSet('evic', ensurer);
                    //clg('cnset left', this.pv.toString())
                } //else clg('late currentp');
                return this.pv;
            } else {
                //clg('valid uninfluenced', this.name);
                this.pulseUpdate('valid-uninfluence');
                return this.pv;
            }
        }
    }
    calcNSet(dbgId, dbgData) {
        //  Calculate, link, record, and propagate.
        if (callStack.includes(this)) {
            clg(`cyclic dependency calculating ${this.name}`);
            throw 'cyclic dependency detected. see console for deets';
        }
        let rawValue = this.calcNLink();
        //T.clg('rawval', rawValue);

        if (!this.optimizedAwayp()) {
            /*
            this check for optimized-away? arose because a rule using without-c-dependency
            can be re-entered unnoticed since that clears *call-stack*. If re-entered, a subsequent
            re-exit will be of an optimized away cell, which will have been assumed
            as part of the opti-away processing.
            */
            //clg('assuming ', rawValue.toString())
            return this.valueAssume(rawValue, null);
        }
    }
    calcNLink() {
        /* The name is accurate: we do no more than invoke the
         rule of a formula and return its value, but along the
         way the links between dependencies and dependents get
         determined anew. */
        let dp = depender
            , dc = deferChanges;

        depender = this;
        deferChanges = true;

        try {
            callStack.push(this);
            this.unlinkFromUsed('pre-rule-clear');
            //clg(`calling ${this.name} rule with md ${this.md} `+this.rule.toString());
            return this.rule(this);
        } finally {
            callStack.pop();
            depender = dp;
            deferChanges = dc;
        }
    }
    
    // --- state changes, from external assign or recalculation
    valueAssume( newValue, propCode) {
        let self = this;
        //clg('val ass etry', this.name, newValue);
        withoutCDependency(()=>{
            //clg('valass entry');
           let priorValue = self.pv
                , priorState = self.valueState();
            self.pv = newValue;
            //clg('self pv now',self.pv);
            self.state = kAwake;
            if (self.md && !self.synapticp) {
                mdSlotValueStore( self.md, self.name, newValue);
            }
            self.pulseUpdate('sv-assume');
            //clg('priorstate', priorState.toString(),propCode);
            if (propCode==='propagate'
                || [kValid,kUncurrent].indexOf(priorState) === -1
                || self.valueChangedp( newValue, priorValue)) {
                let optimize = self.rule ? self.optimize : null;
                if (optimize === kOptimizeWhenValued) {
                    if (self.pv) {
                        self.unlinkFromUsed('opti-when');
                        this.optimizeAwayMaybe(priorValue);
                    }
                } else if (optimize) {
                    self.optimizeAwayMaybe(priorValue);
                }

                if (!(propCode === 'no-propagate'
                    || self.optimizedAwayp())) {
                    self.propagate(priorValue, self.callers);
                }
            }
        })();
        return newValue;
    }
    propagate(vPrior, callers) {
        // might not need to pass in callers
        if (onePulsep) {
            if (gCustomPropagator) {
                gCustomPropagator(this, vPrior);
            }
        } else {
            this.pulseLastChanged = gpulse();
            let dp = depender
                , cs = callStack
                , pd = gCPropDepth
                , dc = deferChanges;
            try {
                if (vPrior && this.slotOwning) {
                    // uhoh - when we get to models
                    // call not-to-be on those lostOK
                }
                this.propagateToCallers( callers);
                if (gpulse() > this.pulseObserved
                    || find(this.lazy, [kOnceAsked, kAlways,true])) {
                    this.observe(vPrior,'propagate');
                }
                this.ephemeralReset();
            } finally {
                depender = dp;
                callStack = cs;
                gCPropDepth = pd;
                deferChanges = dc;
            }
        }
    }
    propagateToCallers(callers) {
        if (callers.size) {
            let c = this;
            withIntegrity(qNotify, c, ()=> {
                causation.push(c); // this was (kinda) outside withIntegrity
                try {
                    for (let caller of callers.values()) {
                        //clg('caller lazy '+ caller.lazy.toString());
                        //clg('caller pv '+ caller.pv.toString());
                        //clg('caller pulse/pulse ', caller.pulse, gpulse());
                        if (!(caller.state === kQuiesced
                            || caller.currentp()
                            || find(caller.lazy, [true, kAlways,kOnceAsked])
                            || !caller.useds.has(c))) {
                            //clg('calcing eager '+caller.lazy);
                            caller.calcNSet('propagate');
                        }
                    }
                } finally {
                    causation.pop();
                }
            });
        }
    }  
    
    // --- the model alters the outside world (or itself, if necessary) ---
    observe( vPrior, tag) {
       //console.log('observe entry', vPrior);
        if (this.observer) {
            //console.log('this observe-ing '+ this.name +'/'+ this.md.name);
            //console.log('observer', this.observer.toString());
            this.observer(this.name, this.md, this.pv, vPrior, this);
        } else {
            let obs = gSlotObserver[this.name];
            if (obs) {
                //clg('gSlot observe! '+this.name);
                obs(this.name, this.md, this.pv, vPrior, this);
            }// else clg(`no slot obs either for ${this.name}`);
        }
    }

    // --- ephemerals are for event "state" ----
    ephemeralReset() {
        if (this.ephemeralp) { // tolerate calls on non-ephp
            /*
             we defer resetting ephemerals because everything
             else gets deferred and we must not in fact reset it until
             within finBiz we are sure all callers have been recalculated
             and all observers completed (which happens with recalc).
             */
            let self = this;
            withIntegrity( qEphemReset, this, function () {
                self.pv = null;
            });
        }
    }

    // --- housekeeping
    unlinkFromUsed(why) {
        for (let used of this.useds.values()) {
            //clg(`${this.name} unlinks fromused dueto ${why}`);
            used.callerDrop(this);
        }
        this.useds.clear();
    }
    mdCellFlush(){
        // todo are we doing this?
    //        if (this.md) {
    //            this.md.cellsFlushed.push([this.name, this.pulseObserved]);
    //        }
    }
    optimizeAwayMaybe(vPrior) {
        if (this.rule
                && !this.useds.size
                && this.optimize
                && !this.optimizedAwayp()
                && this.validp()
                && !this.synapticp
                && !this.inputp) {
            //clg(`opti-away!!! ${this.name}`);
            this.state = kOptimizedAwayp;
            this.observe( vPrior, 'optimized-away');
            if (this.md) {
                this.mdCellFlush();
                // todo install value as constant
            }
            for (let caller of this.callers.values()) {
                this.callerDrop(caller);
                // ouch: next seems like a category error
                caller.ensureValueIsCurrent( 'opti-used', this); // really?
            }
        }
    }
    quiesce() {
        this.unlinkFromCallers();
        this.unlinkFromUsed('quiesce');
    }

    fm (what, how, key) { // short for "find model"
        if (!what) return;
        if (!this.md) throw `Family search attempted from Cell ${this} sans md property`;
        return this.md.fm( what, how, key);
    }
    fmd (what, key, how) {
        return this.fm( what, {mep: false, upp: false, insidep: true}, key);
        return this.fmd( what
                        , key || (typeof what === 'string' ? what : null)
                        , how);
    }
}

function mdSlotValueStore( me, slotName, value) {
    // me[slotName] = value; vestigial? todo clean up if so
}

// --- some handy cell factories -------------------

function cF(formula, options) {
    // make a conventional formula cell
    return Object.assign( new Cell(null, formula, false, false, null)
        , options);
}


// todo get consistent with all cMakers accepting options
// todo validate options against, eg, ephmeralp

function cF1(formula, options) {
    return Object.assign( new Cell(null
                                , (c)=>{
                                    return withoutCDependency(formula)(c);
                                }
                                , false, false, null)
        , options);
}
function cF_(formula, options) {
    // standard input cell
    return Object.assign(new Cell(null, formula, false, false, null)
        , {lazy: true}
        , options);
}
function c_F(formula, options) {
    // standard input cell
    return Object.assign(new Cell(null, formula, false, false, null)
        , {lazy: kUntilAsked}
        , options);
}
function cFI(formula) {
    /*
     make a cell whose formula runs once for
     its initial value but then is set procedurally
     as an input cell.
     */
    return new Cell(null, formula, true, false, null);
}
function cI(value, options) {
    // standard input cell
    return Object.assign(new Cell(value, null, true, false, null)
        , options);
}
function cIe(value, options) {
    // ephemeral input cell
    return Object.assign(new Cell(value, null, true, true, null)
        , options);
}
function obsDbg (name, me, newv, priorv, c) {
    console.log(`obsDbg! ${name} ${me.name} ${newv}`);
//    console.log(`OBS: ${name} now ${newv} (was ${priorv})`);
}
function XobsDbg (name, me, newv, priorv, c) {
    // handy way to hush obsDbg until sure not needed
}
//module.exports.Cell = Cell;
//module.exports.cIe = cIe;
//module.exports.cF = cF;
//module.exports.cFI = cFI;
//module.exports.cF1 = cF1;
//module.exports.cF_ = cF_;
//module.exports.c_F = c_F;
//module.exports.cI = cI;
//module.exports.obsDbg = obsDbg;
//module.exports.kValid = kValid;
//module.exports.kUnbound = kUnbound;
//module.exports.kOptimizeWhenValued = kOptimizeWhenValued;
//module.exports.kOnceAsked = kOnceAsked;
//module.exports.kUntilAsked = kUntilAsked;
//module.exports.kAlways = kAlways;
//module.exports.find = find;
//module.exports.cellsReset = cellsReset;
//
//module.exports.withIntegrity = withIntegrity;
//module.exports.withChg = withChg;
//module.exports.qNotify = qNotify;
//module.exports.qAwaken = qAwaken;
//module.exports.qEphemReset = qEphemReset;