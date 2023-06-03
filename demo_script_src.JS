const _random = ()=> {
  var num = Math.round(0xffffff * Math.random());
  var r = num >> 16;
  var g = num >> 8 & 250;
  var b = num & 250;
  return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}
let _rand
let _gooey
let tl = gsap.timeline({ease:'Sine.in'})
let click = false


document.addEventListener('click',()=>{
_gooey = Math.floor(Math.random() * 100);   
  _rand = _random()
 
  
         tl.to('.path',{ attr: {d:`M ${-_gooey} 100 V ${_gooey} Q ${_gooey} 0 100 ${_gooey} V 100 z`},duration:.6,  visibility:'visible',stagger:0.01,fill:_rand,ease:Power2.easeIn})
  
         tl.to('.path',{ attr: {d:`M 0 100 V 0 Q ${_gooey}  0 100 0 V 100 z`},duration:.3,stagger:0.01,fill:_rand,ease:Power2.easeOut})
tl.to('.background',{background:_rand})
  
            tl.to('.path',{ attr: {d:`M ${-_gooey} 100 V ${_gooey} Q ${_gooey} 0 100 ${_gooey} V 100 z`},  visibility:'hidden',stagger:0.01,fill:_rand,ease:Power2.easeIn})
  
         tl.to('.path',{ attr: {d:`M 0 100 V 100 Q ${_gooey}  100 100 100 V 100  z`},stagger:0.01,  visibility:'hidden',fill:_rand,ease:Power2.easeOut})

})
