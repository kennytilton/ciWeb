/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
gSlotObserverDef('html', (s, md, newv)=> {
   clg(`${md.name} html obs!!!!!! `+ newv);
   if (md.dom)
        md.dom.innerHTML = newv; 
});

function rockH(c) {
    let tag = c.md.tag;
    ast(tag);
    return `<${tag}>${c.md.content || kidsH(c.md)}</${tag}>`;
}

function kidsH(md) {
    if (md.kids) {
       return md.kids.reduce((pv, md)=>{ return pv+md.html;}, 'cool:');
   } else {
       return `${md.name} has no kids`;
   }
}

function jWebTest(host) {
    let app = mkm(null,'jWebTest'
                , {dom: host
                    , tag: 'div'
                    , html: cF(rockH)}
                , c=>{return [mkm(c.md,'myh3'
                        , {tag:'h3'
                            , content: 'jWeb!!!!!'
                            ,html:cF(rockH)})]});
}

/*
class HTag extends Model {
    constructor(parent, name, icells) {
        super(parent, name, icells);
    }
*/
