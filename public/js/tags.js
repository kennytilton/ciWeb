

gSlotObserverDef('html', (s, md, newv)=> {
    //clg(`${md.name} html obs!!!!!! `+ newv);
    if (md.dom)
        md.dom.innerHTML = newv; 
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
                    clg(`abuild sees key ${key}, delim ${delimiter}, value ${raw[key]}`);
                    let nextDelim = delimiter===' '? '=':':';
                    if (!first) attrs += delimiter;
                    if (nextDelim==='=') {
                        attrs += `${key}="${objAttrs(raw[key]
                                                    , nextDelim)}"`;
                    } else {
                        attrs += `${key}:${objAttrs(raw[key]
                                                    , nextDelim)}`;
                    }
                    first = false;
                }
            }
            return attrs;
        }
    };
    let a = objAttrs(raw,' ');

    if (a) clg('final attrs!!!!!!!! '+a);
    return a;
}

function rockH(c) {
    let tag = c.md.tag
        , rawAttrs = c.md.attrs;
    ast(tag);
    return `<${tag} ${attrsBuild(rawAttrs)}>${c.md.content || kidsH(c.md)}</${tag}>`;
}

function kidsH(md) {
    if (md.kids) {
       return md.kids.reduce((pv, md)=>{ return pv+md.html;},'');
   } else {
       return `${md.name} has no kids`;
   }
}


function tag( tag, initargs, parent) {
    return mkm( parent, initargs.id
            , Object.assign({tag: tag
                            , html: cF(rockH)}
                        , initargs));
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