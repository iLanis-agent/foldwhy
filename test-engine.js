const F=require('./engine.js'),cp=require('child_process');
let seed=5150;const rnd=n=>{seed=(seed*1103515245+12345)&0x7fffffff;return (seed>>8)%n};const pick=a=>a[rnd(a.length)];
// pool restricted to characters whose properties are stable between Unicode 13 (Python 3.10) and the Node in use
const pool=['a','A','b','e','E','i','I','k','K','\u212a','\u0131','\u0130','\u00e9','\u00c9','e\u0301','E\u0301','\u00df','\u1e9e','s','S','\u017f','\u03c3','\u03c2','\u03a3','\u0391','\u03b1','\u03b9','\u0345','\u1f80','\u01c4','\u01c5','\u01c6','\ufb01','\ufb00','\ufb03','\uff21','\uff41','\u00b2','2','\u2160','\u2075','\u00c5','\u212b','A\u030a','\u1e9b','\u1e9b\u0323','\u0436','\u0416','\u0587','\u0562','\u00b5','\u03bc','\u2126','\u03a9','\u03c9','\u0149','\u01f0','\u1e96','\u00a0',' ','-','\u2010','\u00bd','1\u20442','\u3392','\u33a1','\u0958','\u0915\u093c','\ud55c','\u1112\u1161\u11ab','\ufdfa'];
const gs=()=>{let n=rnd(5),s='';while(n--)s+=pick(pool);return s};
const cases=[];for(let i=0;i<6000;i++)cases.push(gs());
const o=JSON.parse(cp.execFileSync('python3',['oracle.py'],{input:JSON.stringify(cases),maxBuffer:1e9}));
const bad={},ex={};let total=0;
cases.forEach((s,i)=>{const L=Object.fromEntries(F.LEVELS.map(l=>[l.id,l.f(s)]));L.upper=s.toUpperCase();L.lower=s.toLowerCase();
 for(const k of Object.keys(o[i])){total++;if(L[k]!==o[i][k]){bad[k]=(bad[k]||0)+1;if((ex[k]=ex[k]||[]).length<3)ex[k].push([[...s].map(c=>c.codePointAt(0).toString(16)).join(' '),[...L[k]].map(c=>c.codePointAt(0).toString(16)).join(' '),[...o[i][k]].map(c=>c.codePointAt(0).toString(16)).join(' ')])}}});
console.log('comparisons',total,'strings',cases.length,'mismatches by level',JSON.stringify(bad));console.log(JSON.stringify(ex));
const nb=Object.values(bad).reduce((a,b)=>a+b,0);process.exit(nb?1:0);
