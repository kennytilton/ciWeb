/* 
 * The MIT License
 *
 * Copyright 2016 Kenneth.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/*
 * new plan is to have a js-to-html function run exactly once on the
 * initial load pulling together all HTML in one wodge so we do not get
 * into dom manipulation for that initial load (when it would be unnecessary
 * and apparently slow).
 * 
 * Thereafter, all change is handled either via JS manipulation of a dom elements
 * attributes or by incremenatlly adding/removing children.
 * 
 * Kinda scary: no HTML cell, and unlike OpenGL (where we rebuild a display
 * list completely when necessary) we will only ever change DOM attributes (in
 * a more abstract sense) and add/remove children in the kids observer.
 * 
 */
class Tag extends Model {
    constructor(parent, name, islots) {
        let superSlots = Object.assign({}, islots);
        delete superSlots.id;
        super( parent, name, superSlots, false);
        if (islots.id) {
            console.warn(`Provided dom id ${islots.id} is your responsibility.`);
            this.id = islots.id;
        } else {
            this.id = ++sid;
        }
        
        // --- binding jsDom with dom -----------------
        jsDom[this.id]=this;
        this.domCache = null;
        Object.defineProperty(this
            , 'dom', {
                enumerable: true
                , get: ()=> {
                    if (this.domCache===null) {
                        this.domCache = document.getElementById(this.id);
                    }
                    return this.domCache;
                }
            });

        if (this.awakenOnInitp) {
            this.awaken();
        } else {
            withIntegrity(qAwaken, this, x=> {
                this.awaken();
            });
        }
    }
    toHTML() {
        let tag = this.tag
            , rawAttrs = this.attrs
            , a = attrsBuild(rawAttrs)
            , s = mdStyleBuild(this)
            , attrs = `${a} ${s}`;
        ast(tag);

        return `<${tag} id="${this.id}" ${attrs}>${this.content || this.kidsToHTML()}</${tag}>`;
    }
    kidsToHTML() {
        return this.kids.reduce((pv, kid)=>{ return pv+kid.toHTML();},'');
    }
}

function setClick (dom, event) {
    let jso = jsDom[dom.id];
    //clg('setclick jsdom '+jso);
    jso.click = event;
}

