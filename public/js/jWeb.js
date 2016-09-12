
function shazzam(deets) {
    clg('shazzam!!!!'+ deets||'nada');
}


function jWebTest(hostID) {
    let host = document.getElementById(hostID);
    // no need to return this (unless it gets GCed
    ast(host);
    tag('section', {
        id: 'ciWeb '+ host.id
        , dom: host
        , attrs: 'style="background-color:#ff0;padding:6px"'
        , kids: cF(c=> {
            return [ h1(`Beezelbub!`, {
                        attrs: 'onclick="shazzam()"'
                    })
                    , h3(`jWeb zapped ${hostID}`
                        , {attrs: {style: 'color:#f00;background-color:#fff;margin:4px'}}
                                )
                    , h4(`Semi-fine print`
                        , {attrs:
                            {onclick: "shazzam('fine print')"
                            , style:
                                {color:'#0f0'
                                , 'background-color': '#000'
                                , padding:"18px"}}})
                    //, button('GoGo')
                        ];
        })
    });
}


/*
class HTag extends Model {
    constructor(parent, name, icells) {
        super(parent, name, icells);
    }
*/
