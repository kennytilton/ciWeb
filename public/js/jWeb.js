
/* global kUnbound, XobsDbg, jsDom */


function setClick (dom, event) {
    let jso = jsDom[dom.id];
    //clg('setclick jsdom '+jso);
    jso.click = event;
}

function jWebTest(hostId) {
    console.assert(typeof hostId !== 'number'
        ,"Please use string IDs for hosts, ciWeb uses numbers internally. Thx.");
        
    let host = document.getElementById(hostId);
    // no need to return this (unless it gets GCed
    console.assert(host, `Host ID ${hostId} not found via getElementById`);
    tag('section', {
        name: 'ciWeb '+ hostId
        , id: hostId
        , attrs: 'style="background-color:#ff0;padding:6px"'
        , kids: cKids(c=> {
            return [ h1(`Beezelbub!`, { name: 'beezer'
                        , click: cIe(null, {observer: XobsDbg})
                        , clickCt: cF(c=> {
                            let clk = c.md.click
                            , clearer = c.fmUp('clearer');

                            return clearer.click? 0:
                                    (c.pv===kUnbound? 2: c.pv) +
                                        (clk ? (clk.shiftKey?-1:1):0);
                        }, {observer: XobsDbg})
                        , attrs: 'onclick="setClick(this,event)"'
                    })

                    , label( cF(c=>{
                                return 'Hi, mom '+c.fmUp('beezer').clickCt;
                            }))
                    , button('Clear', { name: 'clearer'
                        , click: cIe(null, {observer: XobsDbg})
                        , disabled: cF(c=>{
                            let ct = c.fmUp('beezer').clickCt
                            , dis = ct>3 ? false:true;
                            clg(`clear sees ct ${ct} and disabled ${dis}`);
                            return dis;
                        })
                        , attrs: 'onclick="setClick(this,event)" style="margin-left:16px"'
                    })                            
                    , div(null, { name: 'clickRow'
                        , kids: cF(c=>{
                            let ks=[], kct=c.fmUp('beezer').clickCt;
                            clg(`clkrow kids sees clkkct ${kct}`);
                            for (x=0; x < kct;++x)
                                ks[x] = label('click-'+x
                                    , {attrs: 'style="margin-left:24px"'});
                            return ks;
                        })
                    })

                    , label('Not too shabby'
                            , {attrs: {style: {color: "#00f", margin: "12px"}}})
                    , h3(`jWeb zapped ${hostId}`
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

function jWebMini(hostId) {
    console.assert(typeof hostId !== 'number'
        ,"Please use string IDs for hosts, ciWeb uses numbers internally. Thx.");
        
    let host = document.getElementById(hostId);
    // no need to return this (unless it gets GCed
    console.assert(host, `Host ID ${hostId} not found via getElementById`);
    tag('section', {
        name: 'ciWeb '+ host.id
        , id: hostId
        , attrs: 'style="background-color:#ff0;padding:6px"'
        , kids: cKids(c=> {
            clg('ciWEB makes kids!!!!!!!!!!!');
            return [ h1(`Beezelbub!`, { name: 'beezer'
                        , click: cIe(null, {observer: XobsDbg})
                        , clickCt: cF(c=> {
                            let clk = c.md.click
                            , clearer = c.fmUp('clearer');

                            if (clearer.click) {
                                return 0;
                            } else {
                                return (c.pv===kUnbound? 2 : c.pv) +
                                        (clk ? (clk.shiftKey ? -1 : 1) : 0);
                            }
                        }, {observer: XobsDbg})
                        , attrs: 'onclick="setClick(this,event)"'
                    })
                    , label( cF(c=>{
                                return 'Hi, mom '+c.fmUp('beezer').clickCt;
                            }), {name: 'mommy'})


                    , button('Clear', { name: 'clearer'
                        , click: cIe(null, {observer: XobsDbg})
                        , disabled: cF(c=>{
                            let ct = c.fmUp('beezer').clickCt
                            , dis = ct>3 ? false:true;
                            return dis;
                        })
                        , attrs: 'onclick="setClick(this,event)" style="margin-left:16px"'
                    })                            
                    , div(null, { name: 'clickRow'
                        , kids: cF(c=>{
                            let ks=[], kct=c.fmUp('beezer').clickCt;
                            clg(`clkrow kids sees clkkct ${kct}`);
                            for (x=0; x < kct;++x)
                                ks[x] = label('click-'+x
                                    , {attrs: 'style="margin-left:24px"'});
                            clg('div-ks '+ks);
                            return ks;
                        })
                    })
                    
                        ];
        })
    });
}