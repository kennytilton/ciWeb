
/* global kUnbound, XobsDbg, jsDom */

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
            return [ h1(`Beezelbub!`, { name: 'beezer'
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
                        , attrs: 'onclick="setClick(this,event)"'
                    })
                    , label( cF(c=>{
                                // I run when clickCt change
                                return 'Hi, mom '+c.fmUp('beezer').clickCt;
                            }), {name: 'mommy'})


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
                        , kids: cF(c=>{
                            // yep: running when clcikCt changes
                            let ks=[], kct=c.fmUp('beezer').clickCt;
                            for (x=0; x < kct;++x)
                                ks[x] = label('click-'+x
                                    , {attrs: 'style="margin-left:24px"'});
                            return ks;
                        })
                    })
                    
                    ];
        })
    });
}