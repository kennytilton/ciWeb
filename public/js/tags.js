

gSlotObserverDef('html', (s, md, newv)=> {
    if (md.dom) { // not known at time of creation, of course
        //clg(`${md.name} innerhtml set!!!!! `+ newv);
        md.dom.innerHTML = newv;
    }
});

gSlotObserverDef('disabled', (s, md, newv)=> {
    if (md.dom) {
        md.dom.disabled = newv; 
    }
});

gSlotObserverDef('kids', (s, md, newv, oldv)=> {
    if (md.dom) {
        md.dom.disabled = newv; 
    }
});

function attrsBuild(raw) {
    if (!raw) return '';
    let objAttrs = (raw, delimiter)=>{
        if (typeof raw === 'string') {
            return raw;
        } else {
            let attrs='', first=true;
            for (var key in raw) {
                if (raw.hasOwnProperty(key)) {
                    //clg(`abuild sees key ${key}, delim ${delimiter}, value ${raw[key]}`);
                    let nextDelim = delimiter===' '? '=':':';
                    if (!first) attrs += delimiter;
                    if (nextDelim==='=') {
                        attrs += `${key}="${objAttrs(raw[key], ';')}"`;
                    } else {
                        attrs += `${key}:${objAttrs(raw[key], nextDelim)}`;
                    }
                    first = false;
                }
            }
            return attrs;
        }
    };
    let a = objAttrs(raw,' ');

    //if (a) clg('final attrs!!!!!!!! '+a);
    return a;
}

function rockH(c) {
    let tag = c.md.tag
        , rawAttrs = c.md.attrs;
    ast(tag);
    //clg(`rockh sees id `+c.md.id);
    return `<${tag} id="${c.md.id}" ${attrsBuild(rawAttrs)}>${c.md.content || kidsH(c.md)}</${tag}>`;
}
//id="${c.md.id} 
function kidsH(md) {
    if (md.kids) {
        let hout = 'oops';
        withoutCDependency(()=>{
            hout = md.kids.reduce((pv, md)=>{ return pv+md.html;},'');
        })();
        return hout;
   } else {
       return '';
   }
}


function tag( tag, initargs, parent) {
    //clg(`tag ${tag} sees parent `+parent);
    return mkm( parent, null // todo fully lose this idea of supplying id initargs.id
            , Object.assign({tag: tag
                            , html: cF(rockH)}
                        , initargs)
            , null
            , Tag);
}

//function genContentTag(tag) {
//    return function (content, initargs, parent) {
//        return tag(tag, Object.assign( {content: content}, initargs), parent);
//    }
//}
//const h1 = genContentTag('h1');

function h1(content, initargs, parent) {
    return tag('h1', Object.assign( {content: content}, initargs), parent);
}

function eko (tag,value) {
    clg(`eko <${tag}> [${value}]`);
    console.log(value.toString());
    console.log(value);
    return(value);
}
function label(content, initargs, parent) {
    return tag('label', Object.assign( {content: content}, initargs), parent);
}
function div(content, initargs, parent) {
    return tag('div', Object.assign( {content: content}, initargs), parent);
}
function h2(content, initargs, parent) {
    return tag('h2', Object.assign( {content: content}, initargs), parent);
}
function h3(content, initargs, parent) {
    return tag('h3', Object.assign( {content: content}, initargs), parent);
}
function h4(content, initargs, parent) {
    return tag('h4', Object.assign( {content: content}, initargs), parent);
}
function h5(content, initargs, parent) {
    return tag('h5', Object.assign( {content: content}, initargs), parent);
}
function h6(content, initargs, parent) {
    return tag('h6', Object.assign( {content: content}, initargs), parent);
}
function button(content, initargs, parent) {
    return tag('button', Object.assign( {content: content}, initargs), parent);
}