/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function jWebTest(hostID) {
    let host = document.getElementById(hostID);
    // no need to return this (unless it gets GCed
    ast(host);
    tag('section', {
        id: 'ciWeb '+ host.id
        , dom: host
        , attrs: 'style="background-color:#ff0;padding:6px"' // {style: 'background-color:#ff0;'}
        , kids: cF(c=> {
            return [ h1('Beezelbub!')
                    , h3(`jWeb! ${hostID}`
                        , {attrs: {style: 'color:#f00;background-color:#fff;margin:4px'}})
                    , h4(`Semi-fine print`
                        , {attrs: {style: {color:'#0f0'
                                        , 'background-color': '#000'
                                        , padding:"12px"}}})
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
