
/* global kUnbound, XobsDbg, jsDom */

function ciSandbox(hostId) {
    console.assert(typeof hostId !== 'number'
        ,"Please use string IDs for hosts, ciWeb uses numbers internally. Thx.");
        
    let host = document.getElementById(hostId);
    console.assert(host, `Host ID ${hostId} not found via getElementById`);
    
    let jsDom =
        tag('section', {
            name: 'ciWeb '+ host.id
            , id: hostId
            , attrs: 'style="background-color:#ff0;padding:6px"'
            , kids: cKids(c=> {
                return [ h1(`Beezelbub!`, { name: 'beezer'
                            , click: cIe(null, {observer: XobsDbg})
                            , color: cF(c=>{ return c.md.clickCt < 2 ? 'blue':'red';})
                            , clickCt: cF(c=> {
                                let clk = c.md.click;
                                return (c.pv===kUnbound? 0 : c.pv) +
                                        (clk ? (clk.shiftKey ? -1 : 1) : 0);
                            })
                            , attrs: 'onclick="setClick(this,event)"'
                        })
                        , label( cF(c=>{
                                    return 'Beezy Clicks so far '+c.fmUp('beezer').clickCt;
                                }))];
                        })});

    console.assert(jsDom, 'sandbox failed to produce jsDom');
    
    host.innerHTML = jsDom.toHTML();
}
                    
function ciWebDemo01(hostId) {
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
            return [ h1(`Beezelbub!`, { name: 'beezer'
                        , title: 'Click or shift-click me for some action!'
                        , click: cIe(null, {observer: XobsDbg})
                        , clickCt: cF(c=> {
                            let clk = c.md.click // I run when this changes (happens)
                            , clearer = c.fmUp('clearer',{},'clear button' );

                            if (clearer.click) { // ...or this happens
                                return 0;
                            } else {
                                return (c.pv===kUnbound? 2 : c.pv) +
                                        (clk ? (clk.shiftKey ? -1 : 1) : 0);
                            }
                        }, {observer: XobsDbg})
                        , attrs: 'onclick="setClick(this,event)" title="Click or shift-click me for some action!"'
                    })
                    , label( cF(c=>{
                                // I run when clickCt change
                                return 'Beezy Clicks so far '+c.fmUp('beezer').clickCt;
                            }))


                    , button('Clear', { name: 'clearer'
                        , click: cIe(null, {observer: XobsDbg})
                        , disabled: cF(c=>{
                            // I redecide enablement when clickCt changes
                            let ct = c.fmUp('beezer').clickCt
                            , dis = ct>3 ? false:true;
                            return dis;
                        })
                        , attrs: 'onclick="setClick(this,event)" style="margin-left:16px"'
                    })                            
                    , div(null, { name: 'clickRow'
                        , stash: {}
                        //, attrs: 'style="background-color:#fff;padding:6px"'
                        //, attrs: 'style="border:2px;border-color:black"'
                        //, attrs: 'style="color:red;"'
                        //, border: "2px"
                        , color: "red"
                        , kids: cF(c=>{
                            // yep: running when clickCt changes
                            let ks=[], kct=c.fmUp('beezer').clickCt;
                            for (x=0; x < kct;++x) {
                                let sx = c.md.stash[x];
                                if (!sx) {
                                    c.md.stash[x] = sx = label(`click-${x} ${Date.now()}`
                                    , {attrs: 'style="margin-left:24px"'});
                                }
                                ks[x] = sx;
                            }
                            return ks;
                        })
                    })
                    ];
        })
    });
}