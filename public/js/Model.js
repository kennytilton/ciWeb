/**
 * Created by kenneth on 9/4/16.
 */

//@formatter:off

function clg() {
    console.log(Array.from(arguments).join(","));
}
function ast (test, msg) {
    console.assert(test,msg);
}

//var UU = require('node-uuid');


const kAwakening = Symbol("md-awakening");
const kDoomed = Symbol("md-doomed");
const kDead = Symbol("md-dead");

var sid = 0; // aka "serial ID"

class Model {
    constructor(parent, name, icells) {
        this.par = parent; // I like to build models parent<->>kids
        this.name = name;
        this.mtype = null; // eg, "selectionManager" for list items to seek out
        this.cells = {};
        this.others = {}; // cache here other models tracked down by formulas
        // so we have them handy if the rule runs again
        // todo not-to-be has to lose these references
        this.id = ++sid;
        this.state = kNascent;
        this.doomed = false; // aka in mid-notToBe
        // this.fnz = false; // dunno. short for finalization? not in play
        this.awakenOnInitp = false; // ie, bypass qAwaken

        // this.cellsFlushed = {}; vestigial
        
        this.adoptCt = 0; // rare case of non-child but "hosted"
        
        for (let slot in icells) {
            if (!icells.hasOwnProperty(slot))
                continue;

            //console.log(slot + " -> " + icells[slot]);
            let value = icells[slot];

            if (value instanceof Cell) {
                value.name = slot;
                //clg('md cell named '+slot+' gets md named '+this.name);
                value.md = this; // md aka model
                //clg('md cell named '+slot+' has md named '+value.md.name);
                this.cells[slot] = value;
                Object.defineProperty(this
                    , slot, {
                        enumerable: true
                        , get: ()=> {
                            //clg('getteringhh '+value.name+','+value.md);
                            return value.slotValue();
                        }
                        , set: (newv)=>{
                            return value.slotValueSet(newv);
                        }
                    });
            } else {
                Object.defineProperty(this
                    , slot, {
                        enumerable: true
                        , value: value
                        , writable: false
                    });
            }
        }
        if (this.awakenOnInitp) {
            this.awaken();
        } else {
            withIntegrity(qAwaken, this, x=> {
                this.awaken();
            });
        }
    }
    awaken() {
        if (this.state !== kNascent) return this;
        this.state = kAwakening;
        //clg(`md awaken ${this.name}`);
        for (let slot in this.cells) {
            let c = this.cells[slot];
            console.assert(c.md,`No md for cell ${c.name} at md awaken`)
            let lz = find(c.lazy, [true, kAlways, kUntilAsked]);
            if (lz) {
                ; //clg('lazy!!!!', c.lazy, lz);
            } else {
                if (c.state === kNascent) {
                    //clg(`md awaken ${this.name} calls cawaken ${c.name} md ${c.md}`);
                    c.awaken();
                }
            }
        }
        this.state = kAwake;
    }
    fmd (what, key, how) {
//        clg('fmd sees '+ (how && how.mustp));
        return this.fm( what,
                        Object.assign({mep: false, upp: false, insidep: true} , how),
                        key);
    }
    fm( what, how, key) {
        // todo an up-only option to just search ascendants
        if (false) { //(how) {
            clg(how.insidep);
            clg('fm mustp' + how.mustp);
            clg(`fm entry this=${this.name} mustp=${how.mustp}`);
        }
        let found = null;
        if (key) {
            let known = this.others[key];
            if (known) {
                //clg(`md.fm reusing known ${key}`);
                return known;
            }
        }
        how = Object.assign({mep: false
                            , mustp: true
                            , insidep: false
                            , upp: true
                            , wocd: true} // without-c-dependency
                          , how);
        let sd = depender;
        depender = how.wocd? null : depender;
        try {
            let bingo = this.fmTv( what, how);
            if (bingo) {
                //clg('fm bingo!!! '+bingo.name);
                this.others[key] = bingo;
                found = bingo;
            } else {
                //clg('fm failed!!! '+what);
                if (how.mustp) {
                    throw `fget failed what = ${what}, where = ${this.name}`;
                }
            }
        } finally {
            depender = sd;
        }
        //clg('fm returns!!!!! '+ (found && found.name));
        return found;
        
    }
    fmatch(seek) {
        //clg(`fmatch looks at ${this.name} seeking ${seek}`);
        let m = ((typeof seek === 'function' && seek(this))
                 || (typeof seek === 'string' && this.name === seek)
                 || this === seek)? this : null;
        if (m) {
            //clg(`bingo fmatch ${this.name}`);
        }
        return m;
    }
    fmTv( what, how) {
        //clg(`fmTv entry ${this.name} upp=${how.upp} mep=${how.mep} inside=${how.insidep}`);
//        clg(`fmTv entry par=${this.par && this.par.name}`);
//        clg(`fmTv entry kids=${this.kids}`);
        let self = this;
        return (how.mep && this.fmatch(what)) ||
                (how.insidep && this.kids
                    && this.kids.somex((elt, eltx, _)=>{
                        //clg(`${self.name} kidchks ${elt.name}`);
                        let found = (elt !== how.skip)
                                     && elt.fmTv(what, Object.assign( {}, how, { upp: false, mep: true}));
                        if (found) return found;
                    })) ||
                (function () {
                    //clg(`fmTv ${self.name} considers upp ${how.upp} par=${self.par}`);
                    return (how.upp
                            && self.par
                            && self.par.fmTv( what, Object.assign({}, how
                                                , {mep: true
                                                    , insidep: true
                                                    , skip: self})));
                    })();
            
    }
    mDeadp() {return this.state===kDead;}
}

//module.exports.Model = Model;