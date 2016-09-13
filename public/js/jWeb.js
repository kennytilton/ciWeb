
/* global kUnbound, XobsDbg */

function shazzam(self, event, deets) {
    
    clg('shazzam!self!!!'+ self);
    clg('shazzam!event!!'+ event);
    clg('shazzam!deets!!!'+ deets);
    clg(this);
}

function setClick (dom, event) {
    let jso = jsDom[dom.id];
    //clg('setclick jsdom '+jso);
    jso.click = event;
}

function jWebTest(hostID) {
    console.assert(typeof hostID !== 'number'
        ,"Please use string IDs for hosts, ciWeb uses numbers internally. Thx.");
        
    let host = document.getElementById(hostID);
    // no need to return this (unless it gets GCed
    console.assert(host, `Host ID ${hostID} not found via getElementById`);
    tag('section', {
        name: 'ciWeb '+ host.id
        , dom: host
        , attrs: 'style="background-color:#ff0;padding:6px"'
        , kids: cKids(c=> {
            return [ h1(`Beezelbub!`, {
                        name: 'beezer'
                        , click: cIe(null, {observer: XobsDbg})
                        , clickCt: cF(c=> {
                            let clk = c.md.click;
                            return (c.pv===kUnbound? 2: c.pv) +
                                    (clk ? (clk.shiftKey?-1:1):0);
                        }, {observer: XobsDbg})
                        , attrs: 'onclick="setClick(this,event)"'
                    })
                    /*
                     * Next we see that until we get all the tags 
                     * wrapped in their own functions we can stiil
                     * use them with slightly less elegance.
                     */
                    , label( cF(c=>{
                                return 'Hi, mom '+c.fm('beezer', {upp: true, insidep: false}).clickCt;
                            }))
                    , div(null, {
                        kids: cF(c=>{
                            let ks=[], kct=c.fmUp('beezer').clickCt;
                            for (x=0; x < kct;++x)
                                ks[x] = label('click-'+x);
                            clg('div-ks '+ks);
                            return ks;
                        })
                    })
                    , label('Not too shabby'
                            , {attrs: {style: {color: "#00f", margin: "12px"}}})
                    , h3(`jWeb zapped ${hostID}`
                        , {attrs: {style: 'color:#f00;background-color:#fff;margin:4px'}})
                    , h4(`Semi-fine print`
                        , {attrs:
                            {onclick: "shazzam('fine print')"
                            , style:
                                {color:'#0f0'
                                , 'background-color': '#000'
                                , padding:"18px"}}})
                    
                        ];
        })
    });
}
