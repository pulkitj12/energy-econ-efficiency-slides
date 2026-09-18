/* Pure economic models. Units: q = energy units, P/MC = $ per energy unit. */
(function(root){
const clamp=(x,l,h)=>Math.max(l,Math.min(h,x));
function net(q,a,b,c,d){return (a-c)*q-(b+d)*q*q/2;}
function outcome(q,a,b,c,d,p=a-b*q){const revenue=p*q,cost=c*q+d*q*q/2;return {q,p,revenue,cost,cs:a*q-b*q*q/2-revenue,ps:revenue-cost,ts:net(q,a,b,c,d)};}
function stat(s){const q=clamp((s.a-s.p)/s.b,0,s.a/s.b),qe=clamp((s.a-s.c)/(s.b+s.d),0,s.a/s.b),qm=clamp((s.a-s.c)/(2*s.b+s.d),0,s.a/s.b);return {...outcome(q,s.a,s.b,s.c,s.d,s.p),qe,qm,pe:s.a-s.b*qe,pm:s.a-s.b*qm,dwl:net(qe,s.a,s.b,s.c,s.d)-net(q,s.a,s.b,s.c,s.d)};}
function dynamic(s){const k1=s.b1+s.d1,k2=s.b2+s.d2,A1=s.a1-s.c1,A2=s.a2-s.c2,discount=Math.pow(1+s.r/100,s.years);let u1=Math.max(0,A1/k1),u2=Math.max(0,A2/k2),lambda=0;if(u1+u2>s.S){let lo=0,hi=Math.max(A1,A2/discount,0);for(let n=0;n<90;n++){let m=(lo+hi)/2;if(Math.max(0,(A1-m)/k1)+Math.max(0,(A2-m*discount)/k2)>s.S)lo=m;else hi=m;}lambda=(lo+hi)/2;u1=Math.max(0,(A1-lambda)/k1);u2=Math.max(0,(A2-lambda*discount)/k2);}const o1=outcome(s.q1,s.a1,s.b1,s.c1,s.d1),o2=outcome(s.q2,s.a2,s.b2,s.c2,s.d2);return {o1,o2,u1,u2,lambda,discount,pv:o1.ts+o2.ts/discount,best:net(u1,s.a1,s.b1,s.c1,s.d1)+net(u2,s.a2,s.b2,s.c2,s.d2)/discount,mnb1:A1-k1*s.q1,mnb2:(A2-k2*s.q2)/discount,unused:Math.max(0,s.S-s.q1-s.q2)};}
root.Economics={clamp,net,outcome,stat,dynamic};if(typeof module!=='undefined')module.exports=root.Economics;
})(typeof window!=='undefined'?window:globalThis);
