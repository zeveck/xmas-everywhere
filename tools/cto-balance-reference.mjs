// Draft balance sim (starting point for tools/balance.mjs).
// node tools/balance-draft.mjs                 -> runs the standard players and the checks
// node tools/balance-draft.mjs <taps/s> <starCatch 0..1> [thresholdsJSON|target]
// Params: tools/balance-draft-params.json (merged over the defaults below); env P=JSON overrides both.
// Time is active time with no card open (the economy is frozen while a card is open).
import fs from 'node:fs';
const here = new URL('.', import.meta.url).pathname;
let file = {}; try { file = JSON.parse(fs.readFileSync(here + 'balance-draft-params.json', 'utf8')); } catch {}
const P = Object.assign({
 TOYS:[[10,2,1],[25,6,3],[60,16,8],[150,45,22],[400,130,65],[1000,350,180],[2500,950,500],[6000,2600,1400],[15000,7000,3800],[150000,75000,41250]],
 HAM:[[1,0,1],[4,150,3],[20,6000,6],[100,40000,8]],
 UPG:[['elfH',200,2],['cocoa',500,3],['steelElf',3000,5],['wrap',6000,6],['conveyor',30000,7],['goldElf',60000,9]],
 HELP:[['elf',1,15,1],['mach',30,1800,5],['deer',150,10000,7]],
 CREW_TAP:0.15,      // each tap also adds this share of the crew's work per second
 PHONE_CAP:0.9,      // helpers fill the first Smartphone only to this share; taps finish it
 THR:[0,14,90,550,2200,8000,28000,130000,470000,1100000],
}, file, process.env.P ? JSON.parse(process.env.P) : {});
export const TARGET=[0,40,120,240,390,570,780,1020,1260,1560];

export function run(TPS, CATCH, THR) {
 const {TOYS,HAM,UPG,HELP,CREW_TAP,PHONE_CAP}=P;
 let t=0,dt=0.1,cookies=0,cheer=0,rank=1,ham=0,up=new Set(),prog=0,toys=0;
 const n=HELP.map(()=>0);
 let rush=0,nextStar=null,starsSeen=0,rankT=[0],done=null,ctoT=null,phoneDone=false;
 let bg=0,bgAt=0,lastBig=0,buys=[],tapWork=Array(11).fill(0),crewWork=Array(11).fill(0);
 let phoneTapAt=null;
 const elfMul=()=>(up.has('elfH')?2:1)*(up.has('steelElf')?2:1)*(up.has('goldElf')?2:1);
 const hw=(i)=>HELP[i][1]*(i===0?elfMul():1)*(i===1&&up.has('conveyor')?2:1);
 const wps=()=>n.reduce((s,k,i)=>s+k*hw(i),0);
 const hamW=(h=ham,c=up.has('cocoa'))=>HAM[h][0]*(c?1.5:1);
 const tapOf=(hamw,crew)=>hamw+CREW_TAP*crew;
 const toyIdx=()=>Math.min(rank,10)-1;
 const rate=()=>{const [w,c]=TOYS[toyIdx()];return c/w*(up.has('wrap')?1.25:1)};
 const inc=(hamw,crew)=>(tapOf(hamw,crew)*TPS+crew)*rate();
 while(t<5400 && done===null){
  const crew=wps(), base=inc(hamW(),crew); const opts=[];
  if(ham<3&&HAM[ham+1][2]<=rank)opts.push(['ham',HAM[ham+1][1],inc(hamW(ham+1),crew)-base]);
  HELP.forEach((h,i)=>{if(h[3]<=rank)opts.push(['h'+i,Math.ceil(h[2]*1.15**n[i]),inc(hamW(),crew+hw(i))-base]);});
  for(const [nm,c,r] of UPG)if(!up.has(nm)&&r<=rank){let g;
   if(nm==='cocoa')g=inc(hamW(ham,true),crew)-base; else if(nm==='wrap')g=base*0.25;
   else if(nm==='conveyor')g=inc(hamW(),crew+n[1]*HELP[1][1])-base; else g=inc(hamW(),crew+n[0]*elfMul())-base;
   opts.push([nm,c,g]);}
  opts.sort((a,b)=>b[2]/b[1]-a[2]/a[1]); const b=opts[0];
  if(b&&cookies>=b[1]&&b[2]>0){cookies-=b[1];
   if(b[0]==='ham')ham++;else if(b[0][0]==='h'&&b[0].length===2)n[+b[0][1]]++;else up.add(b[0]);
   if(t-lastBig>bg){bg=t-lastBig;bgAt=t;}lastBig=t;
   buys.push([t.toFixed(0),b[0],b[1]]);continue;}
  if(rank>=4){ if(nextStar===null)nextStar=t+90;
   if(t>=nextStar){starsSeen++; const caught=CATCH>=1||(CATCH>0&&starsSeen%Math.round(1/CATCH)===0);
    if(caught)rush=20; nextStar=t+8+90;}}
  const m=rush>0?5:1,hm=rush>0?2:1; if(rush>0)rush-=dt;
  const [w,c,ch]=TOYS[toyIdx()];
  const tw=(hamW()*m+CREW_TAP*crew*hm)*TPS*dt; // Rush: hammer part x5, crew part follows the helpers (x2)
  let cw=crew*hm*dt;
  const firstPhone=rank===10&&!phoneDone;
  if(firstPhone){ cw=Math.max(0,Math.min(cw,PHONE_CAP*w-prog)); if(prog>=PHONE_CAP*w&&phoneTapAt===null)phoneTapAt=t; }
  tapWork[rank]+=tw; crewWork[rank]+=cw;
  prog+=tw+cw;
  while(prog>=w){prog-=w;toys++;cookies+=c*(up.has('wrap')?1.25:1);cheer+=ch;
    if(rank===10&&!phoneDone){phoneDone=true;done=t;}}
  t+=dt;
  while(rank<10&&cheer>=THR[rank]){rank++;rankT.push(t);prog=0;if(rank===10)ctoT=t;}
 }
 const share=tapWork.map((x,i)=>i?x/((x+crewWork[i])||1):0).slice(1);
 return {rankT,ctoT,done,toys,n,bg,bgAt,buys,share,phoneTapAt,boughtAll:ham===3&&up.size===UPG.length,allBy:Math.max(...buys.filter(x=>x[1]==='ham'||!/^h\d$/.test(x[1])).map(x=>+x[0]))};
}
const mmss=s=>s==null?'-':Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
function report(name,TPS,CATCH,r){
 const dev=r.rankT.map((x,i)=>i?Math.round((x/TARGET[i]-1)*100)+'%':'');
 console.log(`${name} (${TPS}/s, catch ${CATCH}): ranks ${r.rankT.map(mmss).join(' ')}\n  dev ${dev.slice(1).join(' ')} | CTO ${mmss(r.ctoT)} | Eve ${mmss(r.done)} (helpers stop at 90%: ${mmss(r.phoneTapAt)}) | toys ${r.toys} | helpers ${r.n.join('/')}\n  tap share by rank ${r.share.map(x=>Math.round(x*100)+'%').join(' ')} | longest gap between buys ${Math.round(r.bg)} s at ${mmss(r.bgAt)} | all hammers+upgrades by ${mmss(r.allBy)} (${r.boughtAll?'all':'NOT all'})`);
}
if(process.env.NOMAIN){} else if(process.argv[2]){
 const TPS=+process.argv[2],CATCH=+process.argv[3];
 const THR=process.argv[4]&&process.argv[4]!=='target'?JSON.parse(process.argv[4]):P.THR;
 const r=run(TPS,CATCH,THR); report('custom',TPS,CATCH,r);
 if(process.env.BUYS)console.log(r.buys.map(b=>b.join(' ')).join('\n'));
} else {
 const ref=run(3,0.5,P.THR), slow=run(2,0,P.THR);
 report('Reference',3,0.5,ref); report('3/s no stars',3,0,run(3,0,P.THR)); report('Slow',2,0,slow); report('Fast',5,1,run(5,1,P.THR));
 const checks=[
  ['reference: every rank within ±25% of target', ref.rankT.every((x,i)=>!i||Math.abs(x/TARGET[i]-1)<=0.25)],
  ['reference: never more than 90 s between purchases', ref.bg<=90],
  ['reference: every hammer and upgrade bought before Chief Toy Officer', ref.boughtAll&&ref.allBy<ref.ctoT],
  // Taps lead while the crew is small (ranks 1-4); from rank 5 the crew would take over, so tap scaling holds taps near a third.
  ['reference: taps at least 30% of work at every rank, and 30-42% from rank 5 on', ref.share.every((s,i)=>s>=0.3&&(i<4||s<=0.42))],
  ['slow (2/s, no stars): Christmas Eve under 45 min', slow.done!==null&&slow.done<2700],
 ];
 let ok=true; for(const [name,pass] of checks){console.log((pass?'PASS ':'FAIL ')+name); ok=ok&&pass;}
 process.exitCode=ok?0:1;
}
