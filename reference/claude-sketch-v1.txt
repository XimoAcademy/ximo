import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────
const D = {
  bg:"#F2F1ED", bgCard:"rgba(255,255,255,0.92)", bgNav:"#0D1F2D",
  navy:"#0D1F2D", navyMid:"#152838", navyLight:"#1E3A4F",
  teal:"#2E8B8B", tealMid:"#3AA0A0", tealLight:"rgba(46,139,139,0.11)",
  tealBorder:"rgba(46,139,139,0.24)", tealGlow:"rgba(46,139,139,0.18)",
  accent:"#1D4ED8", accentLight:"rgba(29,78,216,0.10)", accentBorder:"rgba(29,78,216,0.20)",
  text:"#0D1F2D", textMid:"#2D4459", textLight:"#5E7A8A", textXLight:"#9AB0BC",
  border:"rgba(13,31,45,0.08)", borderMid:"rgba(13,31,45,0.14)",
  green:"#059669", greenL:"rgba(5,150,105,0.10)",
  amber:"#D97706", amberL:"rgba(217,119,6,0.10)",
  red:"#DC2626", redL:"rgba(220,38,38,0.10)",
  white:"#FFFFFF", cream:"#F2F1ED",
  shadow:"0 1px 14px rgba(13,31,45,0.07)",
  shadowMd:"0 4px 24px rgba(13,31,45,0.10)",
  shadowLg:"0 16px 56px rgba(13,31,45,0.16)",
  r:14, rSm:10, rLg:18, rXl:22,
};
const font="'SF Pro Display','-apple-system','BlinkMacSystemFont','Inter',system-ui,sans-serif";
const mono="'SF Mono','Fira Mono',monospace";
const s=(b,e={})=>({fontFamily:font,...b,...e});

// ─── GEO COMPONENTS ───────────────────────────────────────────────
function GrecaDivider({color=D.teal,opacity=0.28,style={}}) {
  const hex=n=>Math.round(n*255).toString(16).padStart(2,'0');
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,...style}}>
      <div style={{flex:1,height:1,background:`linear-gradient(to right,transparent,${color}${hex(opacity)})`}}/>
      <svg width="32" height="14" viewBox="0 0 32 14" fill="none">
        <path d="M1 12L1 7L5 7L5 3L9 3L9 7L16 7L23 3L23 7L27 7L27 12L31 12"
          stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" opacity={opacity+0.1}/>
      </svg>
      <div style={{flex:1,height:1,background:`linear-gradient(to left,transparent,${color}${hex(opacity)})`}}/>
    </div>
  );
}
function CornerMark({size=18,color=D.teal,opacity=0.22,flip=false,style={}}) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none"
      style={{transform:flip?"scaleX(-1)":"none",flexShrink:0,...style}}>
      <path d="M2 16L2 7L5 7L5 4L8 4L8 2L16 2"
        stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity={opacity}/>
    </svg>
  );
}
function DiamondMark({size=12,color=D.teal,opacity=0.55,style={}}) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" style={{flexShrink:0,...style}}>
      <rect x="6" y="1" width="7" height="7" rx="1" transform="rotate(45 6 6)"
        stroke={color} strokeWidth="1.2" opacity={opacity}/>
      <rect x="6" y="3.5" width="3.5" height="3.5" rx="0.4" transform="rotate(45 6 6)"
        fill={color} opacity={opacity}/>
    </svg>
  );
}
function WaveBg({w=600,h=180,color=D.teal,opacity=0.045,tick=0}) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}
      style={{position:"absolute",bottom:0,left:0,pointerEvents:"none",overflow:"visible"}}>
      {[0,1,2,3,4].map(i=>{
        const y=h*0.5+i*18+Math.sin((tick||0)*0.03+i*1.2)*3;
        return <path key={i} d={`M-20 ${y}Q${w/4} ${y-6} ${w/2} ${y}Q${3*w/4} ${y+6} ${w+20} ${y}`}
          stroke={color} strokeWidth="1" fill="none" opacity={opacity*(1-i*0.12)}/>;
      })}
      <path d={`M0 0L0 26L7 26L7 8L17 8L17 4L30 4L30 0Z`} fill={color} opacity={opacity*1.8}/>
      <path d={`M${w} 0L${w} 26L${w-7} 26L${w-7} 8L${w-17} 8L${w-17} 4L${w-30} 4L${w-30} 0Z`}
        fill={color} opacity={opacity*1.8}/>
    </svg>
  );
}

// XIMO Quetzalcoatl logo (abstracted from uploaded design)
function XimoLogo({size=48,style={}}) {
  const sc=size/48;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={style}>
      <g transform={`scale(${sc})`}>
        {/* Greca base */}
        <path d="M9 34L9 30L12 30L12 27L15 27L15 30L24 30L33 27L33 30L36 30L36 34L39 34"
          stroke={D.teal} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Sword blade */}
        <line x1="24" y1="8" x2="24" y2="31" stroke={D.teal} strokeWidth="2.2" strokeLinecap="round"/>
        {/* Sword point */}
        <path d="M20.5 31L24 35L27.5 31" fill={D.teal} opacity="0.85"/>
        {/* Crossguard */}
        <rect x="20" y="25" width="8" height="2.8" rx="1.4" fill={D.teal} opacity="0.7"/>
        {/* Serpent right coil */}
        <path d="M24 9Q31 6 35 11Q38 15 36 19Q34 23 30 23Q27 23 24 20"
          stroke={D.teal} strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* Serpent left coil */}
        <path d="M24 9Q17 6 13 11Q10 15 12 19Q14 23 18 23Q21 23 24 20"
          stroke={D.teal} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6"/>
        {/* Eye */}
        <circle cx="33.5" cy="12" r="1.5" fill={D.teal}/>
        {/* Feather detail */}
        <path d="M34 9Q37 8 38 11" stroke={D.teal} strokeWidth="1" fill="none" opacity="0.5"/>
      </g>
    </svg>
  );
}

function AppIcon({size=36,style={}}) {
  return (
    <div style={{width:size,height:size,borderRadius:Math.round(size*0.26),
      background:`linear-gradient(145deg,${D.navyMid},${D.navy})`,
      border:`1px solid rgba(46,139,139,0.3)`,display:"flex",alignItems:"center",
      justifyContent:"center",position:"relative",overflow:"hidden",flexShrink:0,...style}}>
      <XimoLogo size={Math.round(size*0.7)}/>
    </div>
  );
}

function XimoWordmark({size=28,color=D.white,sub=false,subColor="rgba(255,255,255,0.28)",style={}}) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:1,...style}}>
      <div style={s({fontWeight:800,fontSize:size,letterSpacing:size>22?2:1.2,color,lineHeight:1})}
        >ximo</div>
      {sub&&<div style={s({color:subColor,fontSize:9,letterSpacing:3,fontWeight:700,textTransform:"uppercase"})}>ACADEMY</div>}
    </div>
  );
}

// ─── ATOMS ────────────────────────────────────────────────────────
function Fade({children,delay=0,style={}}) {
  const [v,setV]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setV(true),delay);return()=>clearTimeout(t);},[delay]);
  return <div style={{opacity:v?1:0,transform:v?"translateY(0)":"translateY(8px)",
    transition:`opacity 0.42s ease ${delay}ms,transform 0.42s ease ${delay}ms`,...style}}>{children}</div>;
}

function Btn({children,onClick,variant="primary",size="md",full=false,style={}}) {
  const [h,setH]=useState(false);
  const sz={sm:{p:"5px 13px",fs:12},md:{p:"9px 18px",fs:13},lg:{p:"13px 30px",fs:15}}[size];
  const v={
    primary:{bg:D.teal,color:D.white,bh:"#267575",sh:`0 2px 14px ${D.teal}30`},
    secondary:{bg:D.tealLight,color:D.teal,bh:"rgba(46,139,139,0.2)",border:`1px solid ${D.tealBorder}`},
    ghost:{bg:"transparent",color:D.textMid,bh:"rgba(0,0,0,0.04)",border:`1px solid ${D.border}`},
    navy:{bg:D.navy,color:D.white,bh:D.navyMid},
    accent:{bg:D.accent,color:D.white,bh:"#1E40AF",sh:`0 2px 12px ${D.accent}28`},
    danger:{bg:D.redL,color:D.red,bh:"rgba(220,38,38,0.15)",border:"1px solid rgba(220,38,38,0.2)"},
  }[variant]||{bg:D.teal,color:D.white,bh:"#267575"};
  return (
    <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={s({border:v.border||"none",cursor:"pointer",borderRadius:D.rSm,padding:sz.p,
        fontSize:sz.fs,fontWeight:600,letterSpacing:-0.1,display:"inline-flex",alignItems:"center",
        gap:6,justifyContent:"center",transition:"all 0.18s",width:full?"100%":"auto",
        background:h?v.bh:v.bg,color:v.color,boxShadow:h?"none":(v.sh||"none"),...style})}
    >{children}</button>
  );
}

function Badge({text,color=D.teal,bg}) {
  return (
    <span style={s({display:"inline-flex",alignItems:"center",gap:3,borderRadius:20,
      padding:"2px 10px",fontSize:11,fontWeight:600,letterSpacing:0.2,
      color,background:bg||`${color}14`})}>
      <DiamondMark size={7} color={color} opacity={0.5}/>{text}
    </span>
  );
}

function Card({children,style={},hover=false,onClick}) {
  const [h,setH]=useState(false);
  return (
    <div onMouseEnter={()=>hover&&setH(true)} onMouseLeave={()=>hover&&setH(false)}
      onClick={onClick}
      style={s({background:D.bgCard,borderRadius:D.r,border:`1px solid ${h?D.tealBorder:D.border}`,
        boxShadow:h?D.shadowMd:D.shadow,transition:"all 0.22s",transform:h?"translateY(-1px)":"none",
        position:"relative",overflow:"hidden",cursor:onClick?"pointer":"default",...style})}>
      {hover&&h&&<CornerMark size={14} style={{position:"absolute",top:5,left:5}}/>}
      {hover&&h&&<CornerMark size={14} flip style={{position:"absolute",top:5,right:5}}/>}
      {children}
    </div>
  );
}

function ProgressBar({value,max=100,color=D.teal,height=6}) {
  const pct=Math.min((value/max)*100,100);
  return (
    <div style={{height,background:D.border,borderRadius:height,overflow:"hidden"}}>
      <div style={{width:`${pct}%`,height:"100%",background:color,borderRadius:height,transition:"width 0.8s cubic-bezier(0.34,1.56,0.64,1)"}}/>
    </div>
  );
}

function Input({label,value,onChange,placeholder,type="text",style={}}) {
  const [f,setF]=useState(false);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:5,...style}}>
      {label&&<label style={s({fontSize:10,fontWeight:700,color:D.textLight,textTransform:"uppercase",letterSpacing:0.9})}>{label}</label>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        onFocus={()=>setF(true)} onBlur={()=>setF(false)}
        style={s({border:`1px solid ${f?D.teal:D.border}`,borderRadius:D.rSm,padding:"9px 13px",
          fontSize:13,background:"rgba(255,255,255,0.88)",color:D.text,outline:"none",
          width:"100%",boxSizing:"border-box",transition:"all 0.18s",
          boxShadow:f?`0 0 0 3px ${D.teal}14`:"none"})}/>
    </div>
  );
}

function Sel({label,value,onChange,options,style={}}) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:5,...style}}>
      {label&&<label style={s({fontSize:10,fontWeight:700,color:D.textLight,textTransform:"uppercase",letterSpacing:0.9})}>{label}</label>}
      <select value={value} onChange={onChange}
        style={s({border:`1px solid ${D.border}`,borderRadius:D.rSm,padding:"9px 13px",
          fontSize:13,background:"rgba(255,255,255,0.88)",color:D.text,outline:"none",cursor:"pointer"})}>
        {options.map(o=><option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}
      </select>
    </div>
  );
}

function SectionTitle({children,style={}}) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,...style}}>
      <DiamondMark color={D.teal} opacity={0.6}/>
      <span style={s({fontWeight:600,fontSize:14,color:D.text,letterSpacing:-0.2})}>{children}</span>
    </div>
  );
}

function EmptyState({icon,title,sub,action,onAction}) {
  return (
    <div style={{textAlign:"center",padding:"48px 24px"}}>
      <div style={{fontSize:36,marginBottom:14,opacity:0.35}}>{icon}</div>
      <GrecaDivider color={D.teal} opacity={0.15} style={{maxWidth:200,margin:"0 auto 14px"}}/>
      <div style={s({fontWeight:600,fontSize:15,color:D.text,marginBottom:6})}>{title}</div>
      <div style={s({fontSize:13,color:D.textLight,marginBottom:18,lineHeight:1.6})}>{sub}</div>
      {action&&<Btn onClick={onAction} size="md">{action}</Btn>}
    </div>
  );
}

// ─── SCORING ENGINE ───────────────────────────────────────────────
function calcXimo(times) {
  const t50=parseFloat(times?.["50 libre"])||26.5;
  const t100=parseFloat(times?.["100 libre"])||58.5;
  const t200=parseFloat(times?.["200 libre"])||130;
  const speed=Math.max(0,Math.min(100,Math.round((24/t50)*100)));
  const endur=Math.max(0,Math.min(100,Math.round((52/t100)*100)));
  const base =Math.max(0,Math.min(100,Math.round((115/t200)*100)));
  const veloc=72; const consist=78; const relay=Math.round(speed*0.88);
  const overall=Math.round(speed*0.38+endur*0.32+base*0.18+veloc*0.07+consist*0.05);
  const potential=Math.min(99,overall+12);
  const tier=overall>=84?"D1 Elite":overall>=74?"D1 Competitive":overall>=63?"D1 Accessible":overall>=52?"D2 Strong":"D3/Club";
  return {overall,speed,endur,base,veloc,consist,relay,potential,tier};
}

function calcFit(myTime,standard) {
  const my=parseFloat(myTime)||26.5;
  const std=parseFloat(standard)||21.5;
  const gap=my-std;
  const pct=Math.max(0,Math.min(100,Math.round(100-(gap/std)*400)));
  const rosterPos=Math.max(1,Math.min(25,Math.round((my/std)*8)));
  const scholPct=Math.round(pct*0.09);
  const interest=pct>=80?"High":pct>=60?"Medium":pct>=44?"Low":"Very Low";
  const interestColor=pct>=80?D.teal:pct>=60?D.accent:pct>=44?D.amber:D.red;
  return {pct,gap:gap.toFixed(2),rosterPos,scholPct,interest,interestColor};
}

// ─── DATA ─────────────────────────────────────────────────────────
const UNIS=[
  {id:1,name:"Stanford University",nick:"Cardinal",conf:"Pac-12",div:"D1",state:"CA",rank:1,coach:"Daniel Schemmel",email:"dschemmel@stanford.edu",gpa:"3.9",tuition:59000,times:{"50 free":"20.1","100 free":"43.2","200 free":"1:32.0","100 fly":"46.0"},difficulty:"Elite",intl:true,major:"STEM",gap:"sprint free",aid:75},
  {id:2,name:"University of Florida",nick:"Gators",conf:"SEC",div:"D1",state:"FL",rank:2,coach:"Anthony Nesty",email:"anesty@ufl.edu",gpa:"3.7",tuition:28000,times:{"50 free":"20.3","100 free":"43.4","200 free":"1:32.5","100 fly":"46.1"},difficulty:"Elite",intl:true,major:"Business",gap:"sprint free",aid:65},
  {id:3,name:"University of Texas",nick:"Longhorns",conf:"Big 12",div:"D1",state:"TX",rank:3,coach:"Bob Bowman",email:"bowman@utexas.edu",gpa:"3.8",tuition:52000,times:{"50 free":"20.2","100 free":"43.5","200 free":"1:33.0","100 fly":"46.2"},difficulty:"Elite",intl:true,major:"STEM",gap:"none",aid:60},
  {id:4,name:"University of Michigan",nick:"Wolverines",conf:"Big Ten",div:"D1",state:"MI",rank:4,coach:"Mike Bottom",email:"mbottom@umich.edu",gpa:"3.7",tuition:51000,times:{"50 free":"20.5","100 free":"43.6","200 free":"1:33.5","100 fly":"46.3"},difficulty:"High",intl:true,major:"Engineering",gap:"sprint free",aid:55},
  {id:5,name:"Auburn University",nick:"Tigers",conf:"SEC",div:"D1",state:"AL",rank:5,coach:"Ryan Wochomurka",email:"rwocho@auburn.edu",gpa:"3.5",tuition:32000,times:{"50 free":"20.7","100 free":"44.0","200 free":"1:34.5","100 fly":"46.8"},difficulty:"High",intl:true,major:"Business",gap:"sprint free",aid:50},
  {id:6,name:"Ohio State",nick:"Buckeyes",conf:"Big Ten",div:"D1",state:"OH",rank:7,coach:"Bill Dorenkott",email:"bdoren@osu.edu",gpa:"3.6",tuition:34000,times:{"50 free":"20.8","100 free":"44.2","200 free":"1:35.0","100 fly":"47.0"},difficulty:"High",intl:true,major:"Business",gap:"sprint free",aid:50},
  {id:7,name:"LSU",nick:"Tigers",conf:"SEC",div:"D1",state:"LA",rank:8,coach:"Dave Geyer",email:"dgeyer@lsu.edu",gpa:"3.4",tuition:28000,times:{"50 free":"21.0","100 free":"44.5","200 free":"1:36.0","100 fly":"47.5"},difficulty:"Medium",intl:true,major:"Liberal Arts",gap:"sprint free",aid:45},
  {id:8,name:"UC Berkeley",nick:"Cal Bears",conf:"Pac-12",div:"D1",state:"CA",rank:10,coach:"Dave Durden",email:"ddurden@berkeley.edu",gpa:"3.8",tuition:44000,times:{"50 free":"20.7","100 free":"43.9","200 free":"1:33.8","100 fly":"46.6"},difficulty:"High",intl:true,major:"STEM",gap:"sprint free",aid:60},
  {id:9,name:"University of Minnesota",nick:"Gophers",conf:"Big Ten",div:"D1",state:"MN",rank:11,coach:"Kelly Kremer",email:"kkremer@umn.edu",gpa:"3.5",tuition:33000,times:{"50 free":"21.2","100 free":"44.6","200 free":"1:36.5","100 fly":"47.8"},difficulty:"Medium",intl:true,major:"Engineering",gap:"sprint free",aid:40},
  {id:10,name:"Georgia Tech",nick:"Yellow Jackets",conf:"ACC",div:"D1",state:"GA",rank:12,coach:"Courtney Shealy Hart",email:"cshart@gatech.edu",gpa:"3.7",tuition:34000,times:{"50 free":"21.1","100 free":"44.4","200 free":"1:35.8","100 fly":"47.3"},difficulty:"Medium",intl:true,major:"Engineering",gap:"sprint free",aid:40},
  {id:11,name:"Indiana University",nick:"Hoosiers",conf:"Big Ten",div:"D1",state:"IN",rank:15,coach:"Ray Looze",email:"rlooze@indiana.edu",gpa:"3.5",tuition:35000,times:{"50 free":"21.4","100 free":"44.8","200 free":"1:37.5","100 fly":"48.2"},difficulty:"Medium",intl:true,major:"Business",gap:"sprint free",aid:38},
  {id:12,name:"NC State",nick:"Wolfpack",conf:"ACC",div:"D1",state:"NC",rank:14,coach:"Braden Holloway",email:"bhollow@ncsu.edu",gpa:"3.5",tuition:28000,times:{"50 free":"21.3","100 free":"44.7","200 free":"1:37.0","100 fly":"48.0"},difficulty:"Medium",intl:true,major:"STEM",gap:"sprint free",aid:38},
  {id:13,name:"Virginia Tech",nick:"Hokies",conf:"ACC",div:"D1",state:"VA",rank:30,coach:"Sergio Lopez",email:"slopez@vt.edu",gpa:"3.5",tuition:33000,times:{"50 free":"22.4","100 free":"45.8","200 free":"1:41.5","100 fly":"50.0"},difficulty:"Medium",intl:true,major:"Engineering",gap:"sprint free",aid:35},
  {id:14,name:"Purdue University",nick:"Boilermakers",conf:"Big Ten",div:"D1",state:"IN",rank:20,coach:"Cory Chitwood",email:"cchitwood@purdue.edu",gpa:"3.5",tuition:30000,times:{"50 free":"21.8","100 free":"45.2","200 free":"1:38.8","100 fly":"48.9"},difficulty:"Medium",intl:true,major:"Engineering",gap:"sprint free",aid:35},
  {id:15,name:"Towson University",nick:"Tigers",conf:"CAA",div:"D1",state:"MD",rank:45,coach:"Andrew Bredlau",email:"abredlau@towson.edu",gpa:"3.3",tuition:22000,times:{"50 free":"22.8","100 free":"47.0","200 free":"1:44.0","100 fly":"51.5"},difficulty:"Accessible",intl:true,major:"Liberal Arts",gap:"sprint free",aid:30},
];

const PIPELINE_STAGES=[
  {id:"identified",label:"Identified",color:D.textLight,dot:"#9CA3AF"},
  {id:"contacted",label:"Contacted",color:"#1E40AF",dot:"#3B82F6"},
  {id:"replied",label:"Replied",color:D.amber,dot:"#F59E0B"},
  {id:"interested",label:"Interested",color:D.teal,dot:D.teal},
  {id:"offer",label:"Offer Received",color:D.green,dot:D.green},
  {id:"committed",label:"Committed",color:"#7C3AED",dot:"#8B5CF6"},
];

const INIT_CONTACTS=[
  {id:1,university:"Towson University",coach:"Andrew Bredlau",email:"abredlau@towson.edu",status:"replied",date:"Mar 10",notes:"Interested. Asked for official times + video.",priority:"high",div:"D1",response:4},
  {id:2,university:"University of Minnesota",coach:"Kelly Kremer",email:"kkremer@umn.edu",status:"replied",date:"Mar 5",notes:"Responded positively. Evaluating my times.",priority:"high",div:"D1",response:3},
  {id:3,university:"Indiana University",coach:"Ray Looze",email:"rlooze@indiana.edu",status:"contacted",date:"Mar 12",notes:"Email sent. Awaiting reply.",priority:"medium",div:"D1",response:null},
  {id:4,university:"NC State",coach:"Braden Holloway",email:"bhollow@ncsu.edu",status:"identified",date:"Mar 15",notes:"Pending outreach.",priority:"medium",div:"D1",response:null},
  {id:5,university:"Virginia Tech",coach:"Sergio Lopez",email:"slopez@vt.edu",status:"contacted",date:"Mar 11",notes:"Follow up March 18.",priority:"low",div:"D1",response:null},
];

const INIT_POSTS=[
  {id:1,user:"XIMO",role:"Founder",time:"2h ago",text:"Minnesota replied this morning. The process is working. You're the first to know — this is what growing together means. The method is real.",likes:248,comments:31,tag:"Update",verified:true,liked:false},
  {id:2,user:"AlejandroR_Swim",role:"Athlete",time:"4h ago",text:"I GOT ACCEPTED TO UC SAN DIEGO D1. 6 months. 34 emails. 4 replies. 1 offer. To everyone who said it was impossible as a Mexican athlete — it's not. This community built it with me.",likes:312,comments:54,tag:"Achievement",verified:false,liked:false,media:"UC San Diego · Division 1 · Swimming"},
  {id:3,user:"FerSwim_GDL",role:"Athlete",time:"6h ago",text:"Month 3 of tracking. 100 free: 55.2 → 53.1. Small but consistent. Document everything. Every tenth counts.",likes:89,comments:12,tag:"Progress",verified:false,liked:false,media:"53.1s — 100 free LC · −2.1s in 90 days"},
  {id:4,user:"CarlosNado_MTY",role:"Athlete",time:"1d ago",text:"Does anyone know what minimum times Minnesota considers for international athletes? I'm at 50.1 in 100 free LC. Realistic shot?",likes:34,comments:28,tag:"Question",verified:false,liked:false},
  {id:5,user:"ValSwim_CDMX",role:"Athlete",time:"1d ago",text:"Finished the XIMO cold email course. Sent 8 emails with the framework. 3 coaches replied in 48h. The system works if you apply it with discipline.",likes:134,comments:19,tag:"Testimonial",verified:false,liked:false},
];

const COURSES=[
  {id:1,title:"NCAA Recruiting Masterclass",sub:"From Mexico to a US scholarship",lessons:12,duration:"4h 30m",free:false,students:342,rating:4.9},
  {id:2,title:"Cold Email That Converts",sub:"The exact framework coaches respond to",lessons:8,duration:"3h 10m",free:false,students:218,rating:4.8},
  {id:3,title:"SAT & TOEFL Athlete Guide",sub:"Balancing elite training with academics",lessons:10,duration:"3h 50m",free:false,students:189,rating:4.7},
  {id:4,title:"Elite Athlete Mindset",sub:"Build discipline that doesn't break",lessons:6,duration:"2h 15m",free:true,students:891,rating:4.9},
  {id:5,title:"Athlete Personal Brand",sub:"From swimmer to content creator",lessons:7,duration:"2h 45m",free:false,students:156,rating:4.8},
  {id:6,title:"Swim Analytics Pro",sub:"Understand your times like a coach",lessons:9,duration:"3h 20m",free:false,students:124,rating:4.7},
];

const EXAMS=[
  {name:"PrepScholar",type:"SAT",desc:"Personalized SAT prep. Score improvement guarantee."},
  {name:"Khan Academy SAT",type:"SAT",desc:"Official free SAT prep by College Board."},
  {name:"Magoosh TOEFL",type:"TOEFL",desc:"Video lessons, practice tests, automated scoring."},
  {name:"ETS TOEFL Official",type:"TOEFL",desc:"Official TOEFL material and real practice exams."},
  {name:"Common App",type:"Admissions",desc:"The official US university application platform."},
  {name:"NCAA Eligibility Center",type:"NCAA",desc:"Mandatory registration for all NCAA student-athletes."},
  {name:"College Board",type:"SAT",desc:"Official SAT practice tests and preparation."},
  {name:"EF SET Test",type:"TOEFL",desc:"Free English benchmark test before formal TOEFL prep."},
];

const diffColor={Elite:D.red,High:D.amber,Medium:D.teal,Accessible:D.green};
const tagColor={Achievement:D.amber,Progress:D.teal,Question:"#7C3AED",Testimonial:D.green,Motivation:D.red,Update:D.navy};

// ─── LANDING ──────────────────────────────────────────────────────
function Landing({onLogin,onRegister}) {
  const [tick,setTick]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setTick(x=>x+1),80);return()=>clearInterval(t);},[]);
  return (
    <div style={s({minHeight:"100vh",background:D.navy,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",overflow:"hidden",position:"relative",padding:"60px 24px"})}>
      <WaveBg w={1400} h={420} color={D.teal} opacity={0.038} tick={tick}/>
      <svg style={{position:"absolute",top:0,left:0,pointerEvents:"none"}} width="140" height="100" viewBox="0 0 140 100">
        <path d="M0 0L0 60L9 60L9 18L24 18L24 9L70 9L70 0" fill={`${D.teal}10`}/>
        <path d="M0 0L0 60L9 60L9 18L24 18L24 9L70 9L70 0" stroke={D.teal} strokeWidth="1" fill="none" opacity="0.14"/>
      </svg>
      <svg style={{position:"absolute",top:0,right:0,pointerEvents:"none"}} width="140" height="100" viewBox="0 0 140 100">
        <path d="M140 0L140 60L131 60L131 18L116 18L116 9L70 9L70 0" fill={`${D.teal}10`}/>
        <path d="M140 0L140 60L131 60L131 18L116 18L116 9L70 9L70 0" stroke={D.teal} strokeWidth="1" fill="none" opacity="0.14"/>
      </svg>

      <Fade><div style={{display:"flex",alignItems:"center",gap:16,marginBottom:38}}>
        <AppIcon size={62}/>
        <XimoWordmark size={42} sub/>
      </div></Fade>

      <Fade delay={70}>
        <h1 style={s({color:D.white,fontWeight:800,fontSize:50,letterSpacing:-2.4,lineHeight:1.03,textAlign:"center",maxWidth:580,margin:"0 0 16px"})}>
          The operating system<br/>for <span style={{color:D.teal}}>elite athletes</span><br/>going global.
        </h1>
      </Fade>

      <Fade delay={140}><GrecaDivider color={D.teal} opacity={0.24} style={{width:300,margin:"0 auto 20px"}}/></Fade>

      <Fade delay={180}>
        <p style={s({color:"rgba(255,255,255,0.4)",fontSize:16,lineHeight:1.65,textAlign:"center",maxWidth:430,margin:"0 0 36px"})}>
          Join 1,200+ competitive swimmers building their NCAA path — with intelligence, community, and discipline.
        </p>
      </Fade>

      <Fade delay={240}>
        <div style={{display:"flex",gap:12,marginBottom:50}}>
          <Btn onClick={onRegister} size="lg" style={{background:`linear-gradient(135deg,${D.teal},#267575)`,color:D.white,paddingLeft:36,paddingRight:36}}>Get started free</Btn>
          <Btn onClick={onLogin} size="lg" variant="ghost" style={{color:"rgba(255,255,255,0.55)",border:"1px solid rgba(255,255,255,0.11)"}}>Sign in</Btn>
        </div>
      </Fade>

      <Fade delay={300}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",maxWidth:520,width:"100%",border:"1px solid rgba(46,139,139,0.13)",borderRadius:D.r,overflow:"hidden"}}>
          {[["130+","D1 programs tracked"],["89","scholarships secured"],["1,200+","athletes active"]].map(([n,l],i)=>(
            <div key={l} style={{padding:"20px 22px",background:"rgba(255,255,255,0.025)",textAlign:"center",borderRight:i<2?"1px solid rgba(46,139,139,0.08)":"none"}}>
              <div style={s({color:D.teal,fontWeight:800,fontSize:28,letterSpacing:-1})}>{n}</div>
              <div style={s({color:"rgba(255,255,255,0.28)",fontSize:11,marginTop:4})}>{l}</div>
            </div>
          ))}
        </div>
      </Fade>

      <Fade delay={380}>
        <div style={{marginTop:34,display:"flex",alignItems:"center",gap:8}}>
          <DiamondMark color={D.teal} opacity={0.3}/>
          <span style={s({color:"rgba(255,255,255,0.14)",fontSize:10,letterSpacing:2.5,fontWeight:600,textTransform:"uppercase"})}>XIMO · Built in Mexico · For the World</span>
          <DiamondMark color={D.teal} opacity={0.3}/>
        </div>
      </Fade>
    </div>
  );
}

// ─── AUTH MODAL ───────────────────────────────────────────────────
function AuthModal({mode,onAuth,onSwitch,onBack}) {
  const [step,setStep]=useState(1);
  const [form,setForm]=useState({name:"",email:"",pass:"",country:"Mexico",event:"50 libre",age:""});
  const [loading,setLoading]=useState(false);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const submit=()=>{setLoading(true);setTimeout(()=>{setLoading(false);onAuth({name:form.name||"Manuel Zúñiga",email:form.email,country:form.country,event:form.event});},1400);};
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(13,31,45,0.85)",backdropFilter:"blur(14px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999}}>
      <Fade>
        <div style={{background:D.cream,borderRadius:D.rXl,padding:"38px 42px",width:450,boxShadow:D.shadowLg,position:"relative",overflow:"hidden"}}>
          <CornerMark style={{position:"absolute",top:8,left:8}} opacity={0.18}/>
          <CornerMark flip style={{position:"absolute",top:8,right:8}} opacity={0.18}/>
          <button onClick={onBack} style={{position:"absolute",background:"none",border:"none",cursor:"pointer",fontSize:16,color:D.textLight,right:16,top:14}}>✕</button>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
            <AppIcon size={32}/><XimoWordmark size={18} color={D.navy} sub subColor={D.textXLight}/>
          </div>
          <GrecaDivider color={D.teal} opacity={0.18} style={{marginBottom:20}}/>
          <div style={{marginBottom:22}}>
            <div style={s({fontWeight:700,fontSize:20,color:D.text,letterSpacing:-0.4})}>{mode==="login"?"Welcome back":"Join XIMO Academy"}</div>
            <div style={s({color:D.textLight,fontSize:13,marginTop:3})}>{mode==="login"?"Continue building your path.":"Start your recruitment journey today."}</div>
          </div>
          {mode==="login"&&<>
            <Input label="Email" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="you@email.com" style={{marginBottom:11}}/>
            <Input label="Password" value={form.pass} onChange={e=>set("pass",e.target.value)} type="password" placeholder="••••••••" style={{marginBottom:18}}/>
            <Btn onClick={submit} full size="lg">{loading?"Signing in…":"Sign in →"}</Btn>
            <p style={s({textAlign:"center",fontSize:13,color:D.textLight,marginTop:14})}>No account? <span onClick={onSwitch} style={{color:D.teal,fontWeight:600,cursor:"pointer"}}>Create one</span></p>
          </>}
          {mode==="register"&&<>
            <div style={{display:"flex",gap:5,marginBottom:22}}>
              {[1,2].map(i=><div key={i} style={{flex:1,height:3,borderRadius:3,background:step>=i?D.teal:D.border,transition:"background 0.3s"}}/>)}
            </div>
            {step===1&&<>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11,marginBottom:11}}>
                <Input label="Full name" value={form.name} onChange={e=>set("name",e.target.value)}/>
                <Input label="Age" value={form.age} onChange={e=>set("age",e.target.value)} type="number"/>
              </div>
              <Input label="Email" value={form.email} onChange={e=>set("email",e.target.value)} style={{marginBottom:11}}/>
              <Input label="Password" value={form.pass} onChange={e=>set("pass",e.target.value)} type="password" style={{marginBottom:11}}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11,marginBottom:18}}>
                <Sel label="Country" value={form.country} onChange={e=>set("country",e.target.value)} options={["Mexico","Colombia","Venezuela","Argentina","Brazil","Other"]}/>
                <Sel label="Main event" value={form.event} onChange={e=>set("event",e.target.value)} options={["50 libre","100 libre","200 libre","100 fly","200 fly","100 back","200 breast","200 IM","400 IM"]}/>
              </div>
              <Btn onClick={()=>setStep(2)} full size="lg">Continue →</Btn>
              <p style={s({textAlign:"center",fontSize:13,color:D.textLight,marginTop:12})}>Have an account? <span onClick={onSwitch} style={{color:D.teal,fontWeight:600,cursor:"pointer"}}>Sign in</span></p>
            </>}
            {step===2&&<>
              <div style={{background:D.navy,borderRadius:D.r,padding:"18px 20px",marginBottom:18,position:"relative",overflow:"hidden"}}>
                <WaveBg w={450} h={80} color={D.teal} opacity={0.06}/>
                <div style={s({color:"rgba(255,255,255,0.3)",fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:5})}>Full access membership</div>
                <div style={s({color:D.white,fontWeight:800,fontSize:28,letterSpacing:-1})}>$49<span style={s({fontSize:14,fontWeight:400,opacity:0.45})}> / month</span></div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:11}}>
                  {["Power Index","Team Fit","Recruiting CRM","130+ D1 programs","All courses","Community"].map(f=><span key={f} style={s({background:"rgba(255,255,255,0.07)",color:"rgba(255,255,255,0.6)",borderRadius:20,padding:"2px 9px",fontSize:10,border:"1px solid rgba(46,139,139,0.15)"})}>{f}</span>)}
                </div>
              </div>
              <Btn onClick={submit} full size="lg">{loading?"Processing…":"Activate membership →"}</Btn>
              <p style={s({textAlign:"center",fontSize:10,color:D.textLight,marginTop:9})}>Secure · Cancel anytime · Stripe encrypted</p>
              <p style={s({textAlign:"center",fontSize:12,color:D.teal,cursor:"pointer",marginTop:6})} onClick={()=>setStep(1)}>← Back</p>
            </>}
          </>}
        </div>
      </Fade>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────
const NAV=[
  {id:"dashboard",label:"Dashboard",icon:"▦"},
  {id:"power",label:"Power Index",icon:"◈"},
  {id:"teamfit",label:"Team Fit",icon:"◉"},
  {id:"universities",label:"Universities",icon:"⬡"},
  {id:"community",label:"Community",icon:"◎"},
  {id:"recruitment",label:"Recruitment",icon:"⬘"},
  {id:"courses",label:"Courses",icon:"▣"},
  {id:"exams",label:"SAT · TOEFL",icon:"◇"},
  {id:"profile",label:"My Profile",icon:"○"},
];

function Sidebar({active,setActive,user}) {
  const [col,setCol]=useState(false);
  return (
    <div style={{width:col?62:216,background:D.navy,display:"flex",flexDirection:"column",height:"100vh",position:"sticky",top:0,flexShrink:0,transition:"width 0.22s",overflow:"hidden",borderRight:"1px solid rgba(46,139,139,0.07)"}}>
      <div style={{padding:col?"14px 0":"15px 14px",borderBottom:"1px solid rgba(255,255,255,0.04)",display:"flex",alignItems:"center",gap:10,justifyContent:col?"center":"flex-start",cursor:"pointer"}} onClick={()=>setCol(!col)}>
        <AppIcon size={29}/>{!col&&<XimoWordmark size={15} sub/>}
      </div>
      {!col&&<div style={{padding:"10px 14px",borderBottom:"1px solid rgba(255,255,255,0.04)",display:"flex",alignItems:"center",gap:9}}>
        <div style={{width:26,height:26,borderRadius:7,background:"rgba(46,139,139,0.18)",border:"1px solid rgba(46,139,139,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:D.teal,fontWeight:700,flexShrink:0}}>{user.name[0]}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={s({color:"rgba(255,255,255,0.85)",fontWeight:600,fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"})}>{user.name.split(" ")[0]}</div>
          <div style={s({color:"rgba(255,255,255,0.22)",fontSize:10})}>Member</div>
        </div>
      </div>}
      <nav style={{flex:1,padding:"6px 0",overflowY:"auto"}}>
        {NAV.map(({id,label,icon})=>{
          const a=active===id;
          return (
            <div key={id} onClick={()=>setActive(id)} title={col?label:""}
              style={{display:"flex",alignItems:"center",gap:9,padding:col?"10px 0":"8px 14px",cursor:"pointer",justifyContent:col?"center":"flex-start",background:a?"rgba(46,139,139,0.13)":"transparent",borderLeft:a?`2px solid ${D.teal}`:"2px solid transparent",transition:"all 0.15s"}}>
              <span style={{fontSize:14,color:a?D.teal:"rgba(255,255,255,0.25)",lineHeight:1}}>{icon}</span>
              {!col&&<span style={s({color:a?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.36)",fontWeight:a?600:400,fontSize:13})}>{label}</span>}
            </div>
          );
        })}
      </nav>
      {!col&&<div style={{padding:"10px 14px",borderTop:"1px solid rgba(46,139,139,0.06)"}}>
        <GrecaDivider color={D.teal} opacity={0.1} style={{marginBottom:6}}/>
        <div style={s({fontSize:9,color:"rgba(255,255,255,0.13)",letterSpacing:1.5,fontWeight:600,textTransform:"uppercase"})}>© 2025 XIMO Academy</div>
      </div>}
    </div>
  );
}

// ─── DARK HERO CARD ───────────────────────────────────────────────
function HeroCard({children,tick,style={}}) {
  return (
    <div style={{background:`linear-gradient(155deg,${D.navy} 0%,${D.navyLight} 100%)`,borderRadius:D.rLg,position:"relative",overflow:"hidden",...style}}>
      <WaveBg w={700} h={220} color={D.teal} opacity={0.05} tick={tick}/>
      <CornerMark size={22} color={D.teal} opacity={0.26} style={{position:"absolute",top:10,left:10}}/>
      <CornerMark size={22} color={D.teal} opacity={0.26} flip style={{position:"absolute",top:10,right:10}}/>
      <div style={{position:"relative",zIndex:1}}>{children}</div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────
function Dashboard({user,setTab}) {
  const [tick,setTick]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setTick(x=>x+1),80);return()=>clearInterval(t);},[]);
  const today=new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});
  const xi=calcXimo({"50 libre":"26.0","100 libre":"58.0","200 libre":"2:06.0"});
  return (
    <div style={{display:"flex",gap:20}}>
      <div style={{flex:1,minWidth:0}}>
        <Fade>
          <HeroCard tick={tick} style={{padding:"26px 28px",marginBottom:18}}>
            <div style={s({color:"rgba(255,255,255,0.28)",fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:8})}>{today}</div>
            <div style={s({color:D.white,fontWeight:800,fontSize:24,letterSpacing:-0.7,marginBottom:4})}>Good morning, {user.name.split(" ")[0]}.</div>
            <GrecaDivider color={D.teal} opacity={0.18} style={{maxWidth:360,margin:"8px 0 12px"}}/>
            <div style={s({color:"rgba(255,255,255,0.38)",fontSize:13,marginBottom:20})}>Your next D1 opportunity is one email closer today.</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
              {[["XIMO Score",xi.overall,"↑ +3 this week"],["Coaches","7","2 replied"],["50 free","26.0s","−0.8s / month"],["Views","43","by coaches"]].map(([l,v,sub])=>(
                <div key={l} style={{background:"rgba(255,255,255,0.055)",borderRadius:D.rSm,padding:"12px 14px",border:"1px solid rgba(46,139,139,0.09)"}}>
                  <div style={s({color:"rgba(255,255,255,0.28)",fontSize:9,fontWeight:700,letterSpacing:0.8,textTransform:"uppercase"})}>{l}</div>
                  <div style={s({color:l==="XIMO Score"?D.teal:D.white,fontWeight:800,fontSize:20,letterSpacing:-0.5,marginTop:5,fontFamily:mono})}>{v}</div>
                  <div style={s({color:"rgba(255,255,255,0.25)",fontSize:10,marginTop:2})}>{sub}</div>
                </div>
              ))}
            </div>
          </HeroCard>
        </Fade>

        <Fade delay={70}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:18}}>
            {[
              {id:"power",icon:"◈",label:"Power Index",sub:`Your XIMO Score: ${xi.overall} · ${xi.tier}`,badge:null},
              {id:"teamfit",icon:"◉",label:"Team Fit",sub:"See your roster position at any D1 program",badge:null},
              {id:"universities",icon:"⬡",label:"Find Programs",sub:"130+ D1 universities filtered by your times",badge:null},
              {id:"recruitment",icon:"⬘",label:"Recruiting CRM",sub:"Pipeline: 2 coaches replied",badge:"2"},
            ].map(({id,icon,label,sub,badge})=>(
              <Card key={id} hover style={{padding:"16px 18px"}} onClick={()=>setTab(id)}>
                <div style={{display:"flex",alignItems:"flex-start",gap:11}}>
                  <div style={{width:34,height:34,borderRadius:9,background:D.tealLight,border:`1px solid ${D.tealBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:D.teal,flexShrink:0}}>{icon}</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:7}}>
                      <span style={s({fontWeight:600,fontSize:13,color:D.text})}>{label}</span>
                      {badge&&<span style={{background:D.teal,color:D.white,borderRadius:10,padding:"1px 7px",fontSize:10,fontWeight:700}}>{badge}</span>}
                    </div>
                    <div style={s({fontSize:12,color:D.textLight,marginTop:3,lineHeight:1.5})}>{sub}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Fade>

        <Fade delay={130}>
          <Card style={{padding:"18px 22px"}}>
            <SectionTitle>Latest from XIMO</SectionTitle>
            {[{t:"How I contacted 20 coaches in one day",d:"XIMO Feed · 8h ago",i:"▶"},
              {t:"Training week + recruitment update",d:"Archive · 2d ago",i:"◉"},
              {t:"Q&A: Going NCAA as an international athlete",d:"Courses · 4d ago",i:"◇"}].map(({t,d,i})=>(
              <div key={t} style={{display:"flex",gap:12,alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${D.border}`,cursor:"pointer",transition:"opacity 0.15s"}}
                onMouseEnter={e=>e.currentTarget.style.opacity="0.6"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                <div style={{width:34,height:34,borderRadius:9,background:D.tealLight,border:`1px solid ${D.tealBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:D.teal,flexShrink:0}}>{i}</div>
                <div><div style={s({fontWeight:500,fontSize:13,color:D.text})}>{t}</div><div style={s({fontSize:11,color:D.textLight,marginTop:2})}>{d}</div></div>
              </div>
            ))}
          </Card>
        </Fade>
      </div>

      <div style={{width:224,flexShrink:0,display:"flex",flexDirection:"column",gap:12}}>
        <Fade delay={60}>
          <Card style={{padding:"16px 18px"}}>
            <SectionTitle>Leaderboard</SectionTitle>
            {[{u:"AlejandroR",l:"UC San Diego D1"},{u:"FerSwim_GDL",l:"−2.1s on 100 free"},{u:"ValSwim_CDMX",l:"3 coaches replied"},{u:"CarlosNado_MTY",l:"49.3 on 100 free"}].map(({u,l},i)=>(
              <div key={u} style={{display:"flex",gap:8,alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${D.border}`}}>
                <div style={{width:20,height:20,borderRadius:5,background:i===0?D.tealLight:D.bg,border:`1px solid ${i===0?D.tealBorder:D.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:i===0?D.teal:D.textLight,flexShrink:0}}>{i+1}</div>
                <div><div style={s({fontSize:12,fontWeight:600,color:D.text})}>{u}</div><div style={s({fontSize:10,color:D.textLight})}>{l}</div></div>
              </div>
            ))}
          </Card>
        </Fade>
        <Fade delay={100}>
          <Card style={{padding:"16px 18px"}}>
            <SectionTitle>Your streak</SectionTitle>
            <div style={{display:"flex",alignItems:"baseline",gap:6,marginBottom:10}}>
              <span style={s({fontSize:36,fontWeight:800,color:D.teal,letterSpacing:-1.5,fontFamily:mono})}>12</span>
              <span style={s({fontSize:13,color:D.textLight})}>days</span>
            </div>
            <ProgressBar value={12} max={30} color={D.teal} height={4}/>
            <div style={s({fontSize:11,color:D.textLight,marginTop:5})}>Goal: 30-day streak</div>
          </Card>
        </Fade>
        <Fade delay={140}>
          <HeroCard style={{padding:"16px 18px"}}>
            <div style={s({color:"rgba(255,255,255,0.3)",fontSize:9,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",marginBottom:6})}>XIMO Score</div>
            <div style={s({color:D.teal,fontWeight:900,fontSize:46,letterSpacing:-2,fontFamily:mono,lineHeight:1})}>{xi.overall}</div>
            <div style={{marginTop:7}}><span style={{background:`${D.teal}25`,color:D.teal,borderRadius:20,padding:"3px 12px",fontSize:11,fontWeight:700,border:`1px solid ${D.teal}35`}}>{xi.tier}</span></div>
            <div style={s({color:"rgba(255,255,255,0.3)",fontSize:11,marginTop:8})}>Update times in Power Index</div>
          </HeroCard>
        </Fade>
      </div>
    </div>
  );
}

// ─── POWER INDEX ──────────────────────────────────────────────────
function PowerIndex() {
  const [times,setTimes]=useState({"50 libre":"26.0","100 libre":"58.0","200 libre":"2:06.0","100 fly":"63.0","100 back":"65.0"});
  const [tab,setTab]=useState("overview");
  const [tick,setTick]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setTick(x=>x+1),80);return()=>clearInterval(t);},[]);
  const xi=calcXimo(times);
  const prog=[[0,28.1],[1,27.8],[2,27.4],[3,27.1],[4,26.8],[5,26.5],[6,26.2],[7,26.0]];
  const months=["Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"];
  const attrs=[
    {k:"speed",label:"Sprint Power",val:xi.speed,desc:"50/100 free speed vs D1 baseline"},
    {k:"endur",label:"Endurance Core",val:xi.endur,desc:"100/200 free efficiency index"},
    {k:"base",label:"Base Fitness",val:xi.base,desc:"200+ event conditioning score"},
    {k:"veloc",label:"Progression Velocity",val:xi.veloc,desc:"Rate of improvement, 90 days"},
    {k:"consist",label:"Consistency",val:xi.consist,desc:"Time variance across competitions"},
    {k:"relay",label:"Relay Value",val:xi.relay,desc:"Estimated relay contribution"},
    {k:"overall",label:"NCAA Fit",val:xi.overall,desc:"Overall D1 compatibility"},
    {k:"potential",label:"Potential Index",val:xi.potential,desc:"Projected ceiling on trajectory"},
  ];
  return (
    <div style={{display:"flex",gap:20}}>
      <div style={{flex:1,minWidth:0}}>
        <Fade>
          <div style={{marginBottom:18}}>
            <div style={s({fontWeight:800,fontSize:20,color:D.text,letterSpacing:-0.5,marginBottom:3})}>Power Index</div>
            <div style={s({fontSize:13,color:D.textLight,marginBottom:14})}>Your cinematic athlete intelligence score — beyond a number.</div>
            <GrecaDivider color={D.teal} opacity={0.25}/>
          </div>
        </Fade>

        <Fade delay={50}>
          <HeroCard tick={tick} style={{padding:"26px 28px",marginBottom:18}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:28}}>
              <div style={{textAlign:"center",flexShrink:0}}>
                <div style={s({color:"rgba(255,255,255,0.28)",fontSize:9,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:7})}>XIMO Score</div>
                <div style={s({color:D.teal,fontWeight:900,fontSize:68,letterSpacing:-4,lineHeight:1,fontFamily:mono})}>{xi.overall}</div>
                <div style={{marginTop:9}}>
                  <span style={{background:`${D.teal}25`,color:D.teal,borderRadius:20,padding:"4px 14px",fontSize:12,fontWeight:700,border:`1px solid ${D.teal}38`}}>{xi.tier}</span>
                </div>
              </div>
              <div style={{flex:1}}>
                <GrecaDivider color={D.teal} opacity={0.16} style={{marginBottom:14}}/>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
                  {attrs.slice(0,4).map(a=>(
                    <div key={a.k} style={{background:"rgba(255,255,255,0.05)",borderRadius:D.rSm,padding:"10px 12px",border:"1px solid rgba(46,139,139,0.1)"}}>
                      <div style={s({color:"rgba(255,255,255,0.3)",fontSize:9,fontWeight:700,letterSpacing:0.7,textTransform:"uppercase",marginBottom:4})}>{a.label}</div>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{flex:1,height:3,background:"rgba(255,255,255,0.08)",borderRadius:3,overflow:"hidden"}}>
                          <div style={{width:`${a.val}%`,height:"100%",background:D.teal,borderRadius:3,transition:"width 0.9s ease"}}/>
                        </div>
                        <span style={s({color:D.teal,fontWeight:700,fontSize:13,fontFamily:mono,minWidth:26})}>{a.val}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </HeroCard>
        </Fade>

        <div style={{display:"flex",gap:6,marginBottom:16}}>
          {["overview","attributes","trajectory","fit"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={s({background:tab===t?D.navy:"transparent",color:tab===t?D.white:D.textMid,border:`1px solid ${tab===t?D.navy:D.border}`,borderRadius:D.rSm,padding:"6px 14px",fontSize:12,fontWeight:500,cursor:"pointer",textTransform:"capitalize"})}>{t}</button>
          ))}
        </div>

        {tab==="overview"&&<Fade>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}>
            {attrs.map(a=>(
              <Card key={a.k} style={{padding:"16px 18px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <span style={s({fontWeight:600,fontSize:13,color:D.text})}>{a.label}</span>
                  <span style={s({fontWeight:800,color:D.teal,fontSize:18,fontFamily:mono,letterSpacing:-0.5})}>{a.val}</span>
                </div>
                <ProgressBar value={a.val} color={a.val>=75?D.teal:a.val>=60?D.accent:D.amber} height={4}/>
                <div style={s({fontSize:11,color:D.textLight,marginTop:6})}>{a.desc}</div>
              </Card>
            ))}
          </div>
        </Fade>}

        {tab==="attributes"&&<Fade>
          <Card style={{padding:"20px 24px"}}>
            <SectionTitle>Event specialization</SectionTitle>
            {[{e:"50 libre",t:times["50 libre"],std:21.5},{e:"100 libre",t:times["100 libre"],std:45.8},{e:"200 libre",t:times["200 libre"],std:98},{e:"100 fly",t:times["100 fly"],std:48.5},{e:"100 back",t:times["100 back"],std:50.0}].map(ev=>{
              const my=parseFloat(ev.t)||99;
              const pct=Math.max(0,Math.min(100,Math.round((ev.std/my)*100)));
              return (
                <div key={ev.e} style={{padding:"11px 0",borderBottom:`1px solid ${D.border}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                    <span style={s({fontSize:13,fontWeight:600,color:D.text})}>{ev.e}</span>
                    <div style={{display:"flex",gap:10,alignItems:"center"}}>
                      <span style={s({fontSize:12,color:D.textLight})}>Your: <span style={{fontFamily:mono,color:D.text,fontWeight:600}}>{ev.t}s</span></span>
                      <span style={s({fontSize:12,color:D.textLight})}>D1 avg: <span style={{fontFamily:mono,color:D.teal,fontWeight:600}}>{ev.std}</span></span>
                      <Badge text={`${pct}%`} color={pct>=88?D.teal:pct>=75?D.accent:D.amber}/>
                    </div>
                  </div>
                  <ProgressBar value={pct} color={pct>=88?D.teal:pct>=75?D.accent:D.amber} height={5}/>
                </div>
              );
            })}
          </Card>
        </Fade>}

        {tab==="trajectory"&&<Fade>
          <Card style={{padding:"20px 24px"}}>
            <SectionTitle>50 libre — progression (seconds)</SectionTitle>
            <svg width="100%" height="200" viewBox="0 0 640 200" style={{overflow:"visible"}}>
              <defs>
                <linearGradient id="tg" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={D.accent}/><stop offset="100%" stopColor={D.teal}/>
                </linearGradient>
              </defs>
              {prog.map(([i,t],idx,arr)=>{
                if(idx===0)return null;
                const prev=arr[idx-1];
                const x1=((idx-1)/7)*600+20,y1=175-((prev[1]-25)/(29.5-25))*150;
                const x2=(idx/7)*600+20,y2=175-((t-25)/(29.5-25))*150;
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#tg)" strokeWidth="2.5" strokeLinecap="round"/>;
              })}
              {prog.map(([i,t])=>{
                const x=(i/7)*600+20,y=175-((t-25)/(29.5-25))*150;
                return <g key={i}>
                  <circle cx={x} cy={y} r={i===7?6:4} fill={i===7?D.teal:D.accent}/>
                  <text x={x} y={y-10} textAnchor="middle" fontSize={10} fill={i===7?D.teal:D.accent} fontWeight="700">{t}</text>
                  <text x={x} y={196} textAnchor="middle" fontSize={9} fill={D.textXLight}>{months[i]}</text>
                </g>;
              })}
            </svg>
            <GrecaDivider color={D.teal} opacity={0.15} style={{margin:"10px 0 8px"}}/>
            <div style={s({fontSize:12,color:D.textMid})}>Total: <strong style={{color:D.text}}>−2.1s</strong> in 7 months · Rate: ~0.30s/mo · Projected 25.0s in ~3 months</div>
          </Card>
        </Fade>}

        {tab==="fit"&&<Fade>
          <div style={{display:"flex",flexDirection:"column",gap:13}}>
            <HeroCard style={{padding:"20px 24px"}}>
              <div style={s({color:"rgba(255,255,255,0.3)",fontSize:9,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:7})}>XIMO AI — Recruitment Fit</div>
              <div style={s({color:D.white,fontSize:14,lineHeight:1.7})}>Score <strong style={{color:D.teal}}>{xi.overall}</strong> positions you for <strong style={{color:D.teal}}>{xi.tier}</strong> programs. Optimal recruiting window: <strong style={{color:D.teal}}>December 2025 – March 2026</strong> at current pace.</div>
            </HeroCard>
            <Card style={{padding:"20px 24px"}}>
              <SectionTitle>Division fit matrix</SectionTitle>
              {[{d:"D1 Elite (Top 15)",p:18,n:"Need ~24.5s"},{d:"D1 Competitive (Top 30)",p:38,n:"Need ~25.2s"},{d:"D1 Accessible",p:72,n:"Need ~25.8s — reachable in 2–3 mo"},{d:"D1 CAA / Horizon",p:91,n:"Within reach now — strong target"},{d:"D2 Elite",p:97,n:"Well above standard"}].map(({d,p,n})=>(
                <div key={d} style={{marginBottom:13}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={s({fontSize:13,fontWeight:500,color:D.text})}>{d}</span>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}><span style={s({fontSize:11,color:D.textLight})}>{n}</span><Badge text={`${p}%`} color={p>=75?D.teal:p>=50?D.accent:D.amber}/></div>
                  </div>
                  <ProgressBar value={p} color={p>=75?D.teal:p>=50?D.accent:D.amber} height={5}/>
                </div>
              ))}
            </Card>
          </div>
        </Fade>}
      </div>

      <div style={{width:224,flexShrink:0,display:"flex",flexDirection:"column",gap:12}}>
        <Card style={{padding:"16px 18px"}}>
          <SectionTitle>Update times</SectionTitle>
          {Object.keys(times).map(ev=>(
            <Input key={ev} label={ev} value={times[ev]} onChange={e=>setTimes(t=>({...t,[ev]:e.target.value}))} style={{marginBottom:9}}/>
          ))}
          <div style={s({fontSize:11,color:D.textLight,marginTop:4,lineHeight:1.5})}>Score recalculates live as you type.</div>
        </Card>
        <HeroCard style={{padding:"16px 18px"}}>
          <div style={s({color:"rgba(255,255,255,0.28)",fontSize:9,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:5})}>Current tier</div>
          <div style={s({color:D.teal,fontWeight:800,fontSize:21,letterSpacing:-0.5})}>{xi.tier}</div>
          <div style={s({color:"rgba(255,255,255,0.3)",fontSize:12,marginTop:3})}>Score: <span style={s({color:D.teal,fontWeight:700,fontFamily:mono})}>{xi.overall}</span></div>
        </HeroCard>
      </div>
    </div>
  );
}

// ─── TEAM FIT ─────────────────────────────────────────────────────
function TeamFit() {
  const [myTime,setMyTime]=useState("26.0");
  const [sel,setSel]=useState(null);
  const [fitTab,setFitTab]=useState("fit");

  if(sel){
    const fit=calcFit(myTime,sel.times["50 free"]);
    const rosterData=[
      {r:1,t:sel.times["50 free"],label:"Top swimmer"},
      {r:2,t:(parseFloat(sel.times["50 free"])+0.2).toFixed(1)},
      {r:3,t:(parseFloat(sel.times["50 free"])+0.4).toFixed(1)},
      {r:fit.rosterPos,t:myTime,me:true},
      {r:fit.rosterPos+1,t:(parseFloat(myTime)+0.2).toFixed(1)},
      {r:fit.rosterPos+2,t:(parseFloat(myTime)+0.5).toFixed(1)},
    ].sort((a,b)=>a.r-b.r);

    return (
      <div style={{display:"flex",gap:20}}>
        <div style={{flex:1,minWidth:0}}>
          <Btn variant="ghost" size="sm" onClick={()=>setSel(null)} style={{marginBottom:14}}>← Back to all programs</Btn>
          <Fade>
            <HeroCard style={{padding:"24px 28px",marginBottom:16}}>
              <Badge text={sel.difficulty} color={diffColor[sel.difficulty]||D.teal} style={{marginBottom:9}}/>
              <div style={s({color:D.white,fontWeight:800,fontSize:22,letterSpacing:-0.6,marginTop:5})}>{sel.name}</div>
              <div style={s({color:"rgba(255,255,255,0.38)",fontSize:13,marginTop:4})}>{sel.conf} · {sel.state} · Coach: {sel.coach}</div>
              <GrecaDivider color={D.teal} opacity={0.18} style={{margin:"14px 0 12px"}}/>
              <div style={{display:"flex",gap:20,alignItems:"flex-start"}}>
                <div style={{textAlign:"center"}}>
                  <div style={s({color:"rgba(255,255,255,0.28)",fontSize:9,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:6})}>Team Fit</div>
                  <div style={s({color:D.teal,fontWeight:900,fontSize:52,letterSpacing:-2.5,lineHeight:1,fontFamily:mono})}>{fit.pct}<span style={{fontSize:22}}>%</span></div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,flex:1}}>
                  {[["Roster position",`#${fit.rosterPos} / 25`],["Time gap",`+${fit.gap}s`],["Coach interest",fit.interest],["Schol. estimate",`~${fit.scholPct}%`]].map(([l,v])=>(
                    <div key={l} style={{background:"rgba(255,255,255,0.055)",borderRadius:D.rSm,padding:"9px 12px",border:"1px solid rgba(46,139,139,0.1)"}}>
                      <div style={s({color:"rgba(255,255,255,0.28)",fontSize:9,fontWeight:700,letterSpacing:0.7,textTransform:"uppercase"})}>{l}</div>
                      <div style={s({color:D.white,fontWeight:700,fontSize:14,marginTop:4})}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </HeroCard>
          </Fade>

          <div style={{display:"flex",gap:6,marginBottom:14}}>
            {["fit","roster","academics","actions"].map(t=>(
              <button key={t} onClick={()=>setFitTab(t)} style={s({background:fitTab===t?D.navy:"transparent",color:fitTab===t?D.white:D.textMid,border:`1px solid ${fitTab===t?D.navy:D.border}`,borderRadius:D.rSm,padding:"6px 14px",fontSize:12,fontWeight:500,cursor:"pointer",textTransform:"capitalize"})}>{t==="academics"?"Academics":"actions"===t?"Next Steps":t.charAt(0).toUpperCase()+t.slice(1)}</button>
            ))}
          </div>

          {fitTab==="fit"&&<Fade>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <Card style={{padding:"18px 22px"}}>
                <SectionTitle>Conference competitiveness</SectionTitle>
                <p style={s({fontSize:13,color:D.textMid,lineHeight:1.65,marginBottom:12})}>In the <strong>{sel.conf}</strong>, your current 50 free of <strong>{myTime}s</strong> places you in the developing tier. A target of <strong>{(parseFloat(myTime)-0.8).toFixed(1)}s</strong> would make you mid-roster competitive.</p>
                <div style={{background:D.bg,borderRadius:D.rSm,border:`1px solid ${D.border}`,padding:"10px 14px"}}>
                  <div style={s({fontSize:12,fontWeight:600,color:D.text,marginBottom:4})}>Roster gap analysis</div>
                  <div style={s({fontSize:12,color:D.textMid})}>There is a <strong style={{color:D.teal}}>sprint freestyle roster gap</strong> at {sel.name}. Coaches actively recruit for this slot — improving your interest probability significantly.</div>
                </div>
              </Card>
              <Card style={{padding:"18px 22px"}}>
                <SectionTitle>Scholarship estimate</SectionTitle>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
                  {[["Annual cost","$"+sel.tuition.toLocaleString()],["Aid probability",fit.pct>=70?"40–60%":"20–35%"],["Full ride chance",fit.pct>=85?"Realistic":"Unlikely"],["Net estimated","$"+(Math.round(sel.tuition*(1-fit.scholPct/100)/1000)*1000).toLocaleString()]].map(([l,v])=>(
                    <div key={l} style={{background:D.bg,borderRadius:D.rSm,padding:"12px 14px",border:`1px solid ${D.border}`}}>
                      <div style={s({fontSize:10,fontWeight:700,color:D.textLight,textTransform:"uppercase",letterSpacing:0.7})}>{l}</div>
                      <div style={s({fontWeight:700,fontSize:15,color:D.text,marginTop:4,fontFamily:mono})}>{v}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </Fade>}

          {fitTab==="roster"&&<Fade>
            <Card style={{padding:"18px 22px"}}>
              <SectionTitle>Simulated roster position (50 free)</SectionTitle>
              {rosterData.map((p,i)=>(
                <div key={i} style={{display:"flex",gap:11,alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${p.me?D.tealBorder:D.border}`,background:p.me?D.tealLight:"transparent",borderRadius:p.me?D.rSm:0,paddingLeft:p.me?8:0,marginLeft:p.me?-8:0}}>
                  <div style={{width:24,height:24,borderRadius:6,background:p.me?D.teal:D.bg,border:`1px solid ${p.me?D.teal:D.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:p.me?D.white:D.textLight,flexShrink:0}}>#{p.r}</div>
                  <div style={{flex:1}}><span style={s({fontSize:13,fontWeight:p.me?700:400,color:p.me?D.teal:D.text})}>{p.me?"→ You (projected)":p.label||"Teammate"}</span></div>
                  <span style={s({fontWeight:p.me?700:500,fontSize:13,fontFamily:mono,color:p.me?D.teal:D.textMid})}>{p.t}s</span>
                </div>
              ))}
            </Card>
          </Fade>}

          {fitTab==="academics"&&<Fade>
            <Card style={{padding:"18px 22px"}}>
              <SectionTitle>Academic compatibility</SectionTitle>
              {[["Min GPA avg",sel.gpa,"3.8","✓"],["Major focus",sel.major,"STEM","✓"],["Intl. friendly",sel.intl?"Yes":"No","Yes","✓"],["Annual cost","$"+sel.tuition.toLocaleString(),"Budget","—"],["TOEFL required","Yes","In progress","→"],["NCAA Eligibility","Required","Register now","→"]].map(([l,v,yours,st])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${D.border}`}}>
                  <span style={s({fontSize:13,color:D.textMid})}>{l}</span>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <span style={s({fontSize:12,color:D.textLight})}>{v}</span>
                    <span style={s({fontSize:12,fontWeight:700,color:st==="✓"?D.teal:st==="→"?D.amber:D.textLight})}>{st}</span>
                  </div>
                </div>
              ))}
            </Card>
          </Fade>}

          {fitTab==="actions"&&<Fade>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <HeroCard style={{padding:"20px 24px"}}>
                <div style={s({color:"rgba(255,255,255,0.28)",fontSize:9,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:8})}>XIMO Recommended Actions</div>
                {[{n:"1",t:`Email Coach ${sel.coach.split(" ")[1]}`,d:"Use the XIMO cold email template. Your sprint gap is close enough for a positive response."},
                  {n:"2",t:"Upload a race highlight video",d:`Coaches at ${sel.name} respond better to athletes who share performance footage.`},
                  {n:"3",t:`Target ${(parseFloat(myTime)-0.5).toFixed(1)}s in 50 free`,d:"This places you mid-roster and significantly improves coach interest to High."},
                  {n:"4",t:"Complete NCAA Eligibility Center",d:"Required before any formal scholarship offer can be extended."}].map(a=>(
                  <div key={a.n} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                    <div style={{width:22,height:22,borderRadius:6,background:"rgba(46,139,139,0.22)",border:"1px solid rgba(46,139,139,0.32)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:D.teal,flexShrink:0}}>{a.n}</div>
                    <div><div style={s({color:D.white,fontWeight:600,fontSize:13})}>{a.t}</div><div style={s({color:"rgba(255,255,255,0.36)",fontSize:11,marginTop:3,lineHeight:1.5})}>{a.d}</div></div>
                  </div>
                ))}
              </HeroCard>
              <div style={{display:"flex",gap:10}}>
                <Btn variant="primary" size="md">Use recruiting template →</Btn>
                <Btn variant="secondary" size="md">Add to pipeline</Btn>
              </div>
            </div>
          </Fade>}
        </div>
        <div style={{width:224,flexShrink:0}}>
          <Card style={{padding:"16px 18px"}}>
            <SectionTitle>Same conference</SectionTitle>
            {UNIS.filter(u=>u.conf===sel.conf&&u.id!==sel.id).slice(0,5).map(u=>{
              const f=calcFit(myTime,u.times["50 free"]);
              return (
                <div key={u.id} onClick={()=>setSel(u)} style={{padding:"8px 0",borderBottom:`1px solid ${D.border}`,cursor:"pointer"}}>
                  <div style={s({fontSize:12,fontWeight:600,color:D.accent})}>{u.name}</div>
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:2}}>
                    <span style={s({fontSize:11,color:D.textLight})}>Rank #{u.rank}</span>
                    <Badge text={`${f.pct}%`} color={f.pct>=70?D.teal:D.amber}/>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div style={{display:"flex",gap:20}}>
      <div style={{flex:1,minWidth:0}}>
        <Fade>
          <div style={{marginBottom:18}}>
            <div style={s({fontWeight:800,fontSize:20,color:D.text,letterSpacing:-0.5,marginBottom:3})}>Team Fit Intelligence</div>
            <div style={s({fontSize:13,color:D.textLight,marginBottom:14})}>See exactly where you'd place on any D1 roster — position, scholarship potential, and coach interest.</div>
            <GrecaDivider color={D.teal} opacity={0.25}/>
          </div>
        </Fade>
        <Fade delay={40}>
          <div style={{display:"flex",gap:10,alignItems:"flex-end",marginBottom:16}}>
            <div style={{maxWidth:220}}><Input label="Your best 50 free (seconds)" value={myTime} onChange={e=>setMyTime(e.target.value)}/></div>
            <div style={s({fontSize:12,color:D.textLight,paddingBottom:10})}>← All fits update live</div>
          </div>
        </Fade>
        {UNIS.map((u,i)=>{
          const fit=calcFit(myTime,u.times["50 free"]);
          return (
            <Fade key={u.id} delay={i*10}>
              <Card hover style={{padding:"13px 16px",marginBottom:8}} onClick={()=>setSel(u)}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:40,height:40,borderRadius:10,background:D.bg,border:`1px solid ${D.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,color:D.textMid,flexShrink:0}}>#{u.rank}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={s({fontWeight:600,fontSize:14,color:D.text,marginBottom:2})}>{u.name}</div>
                    <div style={s({fontSize:11,color:D.textLight,marginBottom:6})}>{u.conf} · {u.state} · {u.major}</div>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <div style={{width:120}}><ProgressBar value={fit.pct} color={fit.pct>=75?D.teal:fit.pct>=55?D.accent:D.amber} height={4}/></div>
                      <Badge text={`${fit.pct}% fit`} color={fit.pct>=75?D.teal:fit.pct>=55?D.accent:D.amber}/>
                      <Badge text={`#${fit.rosterPos}`}/>
                      <Badge text={fit.interest} color={fit.interestColor}/>
                    </div>
                  </div>
                  <span style={s({color:D.textXLight,fontSize:18})}>›</span>
                </div>
              </Card>
            </Fade>
          );
        })}
      </div>
      <div style={{width:224,flexShrink:0}}>
        <Card style={{padding:"16px 18px"}}>
          <SectionTitle>Best fits for you</SectionTitle>
          {UNIS.slice().sort((a,b)=>calcFit(myTime,b.times["50 free"]).pct-calcFit(myTime,a.times["50 free"]).pct).slice(0,6).map(u=>{
            const f=calcFit(myTime,u.times["50 free"]);
            return (
              <div key={u.id} onClick={()=>setSel(u)} style={{marginBottom:10,cursor:"pointer"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={s({fontSize:12,fontWeight:600,color:D.text})}>{u.name}</span>
                  <Badge text={`${f.pct}%`} color={f.pct>=75?D.teal:D.accent}/>
                </div>
                <ProgressBar value={f.pct} color={f.pct>=75?D.teal:D.accent} height={3}/>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}

// ─── UNIVERSITIES ─────────────────────────────────────────────────
function Universities() {
  const [search,setSearch]=useState("");
  const [conf,setConf]=useState("All");
  const [diff,setDiff]=useState("All");
  const [major,setMajor]=useState("All");
  const [intl,setIntl]=useState(false);
  const [sel,setSel]=useState(null);
  const confs=["All","SEC","Big Ten","ACC","Pac-12","Big 12","CAA"];
  const diffs=["All","Elite","High","Medium","Accessible"];
  const majors=["All","STEM","Engineering","Business","Liberal Arts"];
  const filtered=UNIS.filter(u=>(conf==="All"||u.conf===conf)&&(diff==="All"||u.difficulty===diff)&&(major==="All"||u.major===major)&&(!intl||u.intl)&&(u.name.toLowerCase().includes(search.toLowerCase())||u.state.toLowerCase().includes(search.toLowerCase())||u.coach.toLowerCase().includes(search.toLowerCase())));

  if(sel) return (
    <div style={{display:"flex",gap:20}}>
      <div style={{flex:1,minWidth:0}}>
        <Btn variant="ghost" size="sm" onClick={()=>setSel(null)} style={{marginBottom:14}}>← Back to programs</Btn>
        <Fade>
          <HeroCard style={{padding:"24px 28px",marginBottom:16}}>
            <Badge text={sel.difficulty} color={diffColor[sel.difficulty]||D.teal} style={{marginBottom:9}}/>
            <div style={s({color:D.white,fontWeight:800,fontSize:22,letterSpacing:-0.6,marginTop:5})}>{sel.name}</div>
            <div style={s({color:"rgba(255,255,255,0.38)",fontSize:13,marginTop:4})}>{sel.conf} · {sel.state} · Coach: {sel.coach}</div>
          </HeroCard>
        </Fade>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <Card style={{padding:"18px 20px"}}>
            <SectionTitle>Reference times</SectionTitle>
            {Object.entries(sel.times).map(([ev,t])=>(
              <div key={ev} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${D.border}`}}>
                <span style={s({fontSize:13,color:D.textMid})}>{ev}</span>
                <span style={s({fontWeight:700,color:D.teal,fontSize:13,fontFamily:mono})}>{t}</span>
              </div>
            ))}
          </Card>
          <Card style={{padding:"18px 20px"}}>
            <SectionTitle>Program details</SectionTitle>
            {[["GPA avg",sel.gpa],["Scholarships","9.9 equiv."],["Annual cost","$"+sel.tuition.toLocaleString()],["Major focus",sel.major],["Intl. friendly",sel.intl?"Yes":"No"],["Conference",sel.conf]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${D.border}`}}>
                <span style={s({fontSize:12,color:D.textLight})}>{l}</span>
                <span style={s({fontWeight:500,color:D.text,fontSize:12})}>{v}</span>
              </div>
            ))}
          </Card>
        </div>
        <Card style={{padding:"18px 20px"}}>
          <SectionTitle>Contact {sel.coach}</SectionTitle>
          <div style={{background:D.bg,borderRadius:D.rSm,border:`1px solid ${D.border}`,padding:"10px 14px",marginBottom:12}}>
            <div style={s({fontWeight:600,fontSize:13,color:D.text})}>{sel.coach}</div>
            <div style={s({fontSize:12,color:D.textLight,marginTop:2,fontFamily:mono})}>{sel.email}</div>
          </div>
          <div style={{display:"flex",gap:10}}><Btn size="md">Use XIMO template →</Btn><Btn variant="secondary" size="md">See Team Fit</Btn></div>
        </Card>
      </div>
      <div style={{width:224,flexShrink:0}}>
        <Card style={{padding:"16px 18px"}}>
          <SectionTitle>Same conference</SectionTitle>
          {UNIS.filter(u=>u.conf===sel.conf&&u.id!==sel.id).slice(0,4).map(u=>(
            <div key={u.id} onClick={()=>setSel(u)} style={{padding:"7px 0",borderBottom:`1px solid ${D.border}`,cursor:"pointer"}}>
              <div style={s({fontSize:12,fontWeight:600,color:D.accent})}>{u.name}</div>
              <div style={s({fontSize:11,color:D.textLight})}>{u.conf} · #{u.rank}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );

  return (
    <div style={{display:"flex",gap:20}}>
      <div style={{flex:1,minWidth:0}}>
        <Fade>
          <div style={{marginBottom:16}}>
            <div style={s({fontWeight:800,fontSize:20,color:D.text,letterSpacing:-0.5,marginBottom:3})}>NCAA D1 Programs</div>
            <div style={s({fontSize:13,color:D.textLight,marginBottom:14})}>Filter by conference, difficulty, major, and international friendliness.</div>
            <input placeholder="Search by name, state, coach…" value={search} onChange={e=>setSearch(e.target.value)}
              style={s({width:"100%",border:`1px solid ${D.border}`,borderRadius:D.r,padding:"11px 16px",fontSize:14,background:"rgba(255,255,255,0.88)",color:D.text,outline:"none",boxSizing:"border-box",boxShadow:D.shadow})}
              onFocus={e=>e.target.style.borderColor=D.teal} onBlur={e=>e.target.style.borderColor=D.border}/>
          </div>
        </Fade>
        <Fade delay={40}>
          <div style={{display:"flex",gap:5,marginBottom:7,flexWrap:"wrap"}}>
            {confs.map(c=><button key={c} onClick={()=>setConf(c)} style={s({background:conf===c?D.navy:"transparent",color:conf===c?D.white:D.textMid,border:`1px solid ${conf===c?D.navy:D.border}`,borderRadius:D.rSm,padding:"4px 11px",fontSize:11,fontWeight:500,cursor:"pointer"})}>{c}</button>)}
          </div>
          <div style={{display:"flex",gap:5,marginBottom:7,flexWrap:"wrap"}}>
            {diffs.map(d=><button key={d} onClick={()=>setDiff(d)} style={s({background:diff===d?(diffColor[d]||D.navy):"transparent",color:diff===d?D.white:(diffColor[d]||D.textMid),border:`1px solid ${diffColor[d]||D.border}`,borderRadius:D.rSm,padding:"4px 11px",fontSize:11,fontWeight:500,cursor:"pointer"})}>{d}</button>)}
          </div>
          <div style={{display:"flex",gap:5,marginBottom:7,flexWrap:"wrap",alignItems:"center"}}>
            {majors.map(m=><button key={m} onClick={()=>setMajor(m)} style={s({background:major===m?D.teal:"transparent",color:major===m?D.white:D.textLight,border:`1px solid ${major===m?D.teal:D.border}`,borderRadius:D.rSm,padding:"4px 11px",fontSize:11,fontWeight:500,cursor:"pointer"})}>{m}</button>)}
            <label style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontSize:12,color:D.textMid,marginLeft:4}}>
              <input type="checkbox" checked={intl} onChange={e=>setIntl(e.target.checked)} style={{accentColor:D.teal}}/>International friendly
            </label>
          </div>
        </Fade>
        <div style={s({fontSize:11,color:D.textLight,marginBottom:9})}>{filtered.length} programs found</div>
        {filtered.map((u,i)=>(
          <Fade key={u.id} delay={i*10}>
            <Card hover style={{padding:"13px 16px",marginBottom:8}} onClick={()=>setSel(u)}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:40,height:40,borderRadius:10,background:D.bg,border:`1px solid ${D.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,color:D.textMid,flexShrink:0}}>#{u.rank}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={s({fontWeight:600,fontSize:14,color:D.text,marginBottom:2})}>{u.name}</div>
                  <div style={s({fontSize:11,color:D.textLight,marginBottom:6})}>{u.conf} · {u.state} · {u.major}</div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                    <Badge text={`50: ${u.times["50 free"]}`} color={D.teal}/>
                    <Badge text={`$${Math.round(u.tuition/1000)}k/yr`} color={D.textMid} bg={D.bg}/>
                    <Badge text={u.difficulty} color={diffColor[u.difficulty]||D.teal}/>
                    {u.intl&&<Badge text="Intl ✓" color={D.green}/>}
                  </div>
                </div>
                <span style={s({color:D.textXLight,fontSize:18})}>›</span>
              </div>
            </Card>
          </Fade>
        ))}
        {filtered.length===0&&<EmptyState icon="⬡" title="No programs match your filters" sub="Try broadening your search criteria or removing some filters." action="Clear filters" onAction={()=>{setConf("All");setDiff("All");setMajor("All");setIntl(false);setSearch("");}}/>}
      </div>
      <div style={{width:224,flexShrink:0}}>
        <Card style={{padding:"16px 18px"}}>
          <SectionTitle>Best fits (26.0s)</SectionTitle>
          {[{n:"Towson",m:91},{n:"Indiana",m:74},{n:"Virginia Tech",m:68},{n:"NC State",m:62},{n:"Purdue",m:58}].map(({n,m})=>(
            <div key={n} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}>
                <span style={s({color:D.text,fontWeight:500})}>{n}</span>
                <span style={s({color:D.teal,fontWeight:700,fontFamily:mono})}>{m}%</span>
              </div>
              <ProgressBar value={m} color={D.teal} height={4}/>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ─── COMMUNITY ────────────────────────────────────────────────────
function Community({user}) {
  const [posts,setPosts]=useState(INIT_POSTS);
  const [text,setText]=useState(""); const [tag,setTag]=useState("Progress"); const [media,setMedia]=useState("");
  const [filter,setFilter]=useState("All"); const [commentOn,setCommentOn]=useState(null); const [cText,setCText]=useState("");
  const TAGS=["Progress","Achievement","Question","Testimonial","Motivation"];
  const handlePost=()=>{if(!text.trim())return;setPosts([{id:Date.now(),user:user.name,role:"Athlete",time:"now",text,tag,verified:false,likes:0,comments:0,liked:false,media:media||null},...posts]);setText("");setMedia("");};
  const like=(id)=>setPosts(ps=>ps.map(p=>p.id===id?{...p,liked:!p.liked,likes:p.liked?p.likes-1:p.likes+1}:p));
  const addComment=(id)=>{setPosts(ps=>ps.map(p=>p.id===id?{...p,comments:p.comments+1}:p));setCommentOn(null);setCText("");};
  const feed=filter==="All"?posts:posts.filter(p=>p.tag===filter);
  return (
    <div style={{display:"flex",gap:20}}>
      <div style={{flex:1,minWidth:0}}>
        <Fade>
          <div style={{marginBottom:18}}>
            <div style={s({fontWeight:800,fontSize:20,color:D.text,letterSpacing:-0.5,marginBottom:3})}>Community</div>
            <div style={s({fontSize:13,color:D.textLight,marginBottom:14})}>Where serious athletes share progress and grow together.</div>
            <GrecaDivider color={D.teal} opacity={0.25}/>
          </div>
        </Fade>
        <Fade delay={40}>
          <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
            {["All","Achievement","Progress","Question","Testimonial"].map(f=>(
              <button key={f} onClick={()=>setFilter(f)} style={s({background:filter===f?D.navy:"transparent",color:filter===f?D.white:D.textLight,border:`1px solid ${filter===f?D.navy:D.border}`,borderRadius:D.rSm,padding:"5px 13px",fontSize:12,fontWeight:500,cursor:"pointer",transition:"all 0.15s"})}>{f}</button>
            ))}
          </div>
        </Fade>
        <Fade delay={80}>
          <Card style={{padding:"16px 18px",marginBottom:14}}>
            <div style={{display:"flex",gap:10}}>
              <div style={{width:32,height:32,borderRadius:8,background:D.tealLight,border:`1px solid ${D.tealBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:D.teal,fontWeight:700,flexShrink:0}}>{user.name[0]}</div>
              <div style={{flex:1}}>
                <textarea placeholder="Share progress, ask a question, celebrate a win…" value={text} onChange={e=>setText(e.target.value)} rows={3}
                  style={s({width:"100%",border:`1px solid ${D.border}`,borderRadius:D.rSm,padding:"8px 12px",fontSize:13,background:"rgba(255,255,255,0.75)",color:D.text,boxSizing:"border-box",outline:"none",resize:"none",fontFamily:font,lineHeight:1.55})}
                  onFocus={e=>e.target.style.borderColor=D.teal} onBlur={e=>e.target.style.borderColor=D.border}/>
                <div style={{display:"flex",gap:5,marginTop:8,alignItems:"center",flexWrap:"wrap"}}>
                  <span style={s({fontSize:10,color:D.textLight,fontWeight:700,letterSpacing:0.5})}>TAG:</span>
                  {TAGS.map(tg=><button key={tg} onClick={()=>setTag(tg)} style={s({background:tag===tg?D.navy:"transparent",color:tag===tg?D.white:D.textLight,border:`1px solid ${tag===tg?D.navy:D.border}`,borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:500,cursor:"pointer"})}>{tg}</button>)}
                  <Btn onClick={handlePost} size="sm" style={{marginLeft:"auto"}}>Post</Btn>
                </div>
                {(tag==="Progress"||tag==="Achievement")&&<input placeholder={tag==="Achievement"?"e.g. Accepted to UC San Diego D1":"e.g. 49.8 — 100 free LC"} value={media} onChange={e=>setMedia(e.target.value)} style={s({marginTop:9,width:"100%",border:`1px solid ${D.border}`,borderRadius:D.rSm,padding:"7px 12px",fontSize:12,background:"rgba(255,255,255,0.75)",color:D.text,boxSizing:"border-box",outline:"none"})}/>}
              </div>
            </div>
          </Card>
        </Fade>
        {feed.map((p,idx)=>(
          <div key={p.id}>
            {idx===2&&<Fade><div style={{background:"rgba(255,255,255,0.55)",border:`1px solid ${D.border}`,borderRadius:D.r,padding:"13px 17px",marginBottom:11}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                <div><span style={s({fontSize:9,fontWeight:700,color:D.textXLight,letterSpacing:1.2,textTransform:"uppercase"})}>Sponsored · Speedo Performance</span></div>
                <Btn variant="ghost" size="sm" style={{fontSize:11}}>Learn more</Btn>
              </div>
              <div style={s({fontSize:13,color:D.textMid})}>Built for the elite. 2025 Pro racing collection — engineered for speed.</div>
            </div></Fade>}
            {idx===4&&<Fade><div style={{background:"rgba(255,255,255,0.55)",border:`1px solid ${D.border}`,borderRadius:D.r,padding:"13px 17px",marginBottom:11}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                <div><span style={s({fontSize:9,fontWeight:700,color:D.textXLight,letterSpacing:1.2,textTransform:"uppercase"})}>Sponsored · MySwimPro</span></div>
                <Btn variant="ghost" size="sm" style={{fontSize:11}}>Learn more</Btn>
              </div>
              <div style={s({fontSize:13,color:D.textMid})}>AI-powered swim training. Plans that adapt to your performance in real time.</div>
            </div></Fade>}
            <Fade delay={idx*15}>
              <Card style={{padding:"16px 18px",marginBottom:10}}>
                <div style={{display:"flex",gap:10}}>
                  <div style={{width:32,height:32,borderRadius:8,background:p.verified?D.navy:D.bg,border:`1px solid ${p.verified?D.tealBorder:D.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:p.verified?D.teal:D.textLight,fontWeight:700,flexShrink:0}}>{p.verified?"X":p.user[0]}</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap",marginBottom:5}}>
                      <span style={s({fontWeight:700,fontSize:13,color:D.text})}>{p.user}</span>
                      {p.verified&&<span style={{background:D.tealLight,color:D.teal,borderRadius:6,padding:"1px 7px",fontSize:10,fontWeight:700,border:`1px solid ${D.tealBorder}`}}>XIMO</span>}
                      <Badge text={p.tag} color={tagColor[p.tag]||D.teal}/>
                      <span style={s({fontSize:11,color:D.textXLight,marginLeft:"auto"})}>{p.time}</span>
                    </div>
                    <p style={s({fontSize:13,color:D.textMid,lineHeight:1.65,margin:"0 0 9px"})}>{p.text}</p>
                    {p.media&&<div style={{background:D.bg,border:`1px solid ${D.border}`,borderRadius:D.rSm,padding:"6px 12px",fontSize:12,fontWeight:600,color:D.textMid,marginBottom:9}}>{p.media}</div>}
                    <div style={{display:"flex",gap:15,alignItems:"center"}}>
                      <button onClick={()=>like(p.id)} style={s({background:"none",border:"none",cursor:"pointer",fontSize:12,color:p.liked?D.red:D.textLight,fontWeight:500,padding:0})}>{p.liked?"♥":"♡"} {p.likes}</button>
                      <button onClick={()=>setCommentOn(commentOn===p.id?null:p.id)} style={s({background:"none",border:"none",cursor:"pointer",fontSize:12,color:D.textLight,padding:0})}>◎ {p.comments}</button>
                      <button style={s({background:"none",border:"none",cursor:"pointer",fontSize:12,color:D.textLight,padding:0})}>↗ Share</button>
                    </div>
                    {commentOn===p.id&&<div style={{marginTop:9,display:"flex",gap:7}}>
                      <input value={cText} onChange={e=>setCText(e.target.value)} placeholder="Comment…" style={s({flex:1,border:`1px solid ${D.border}`,borderRadius:D.rSm,padding:"6px 11px",fontSize:12,background:"rgba(255,255,255,0.8)",color:D.text,outline:"none"})}/>
                      <Btn size="sm" onClick={()=>addComment(p.id)}>Send</Btn>
                    </div>}
                  </div>
                </div>
              </Card>
            </Fade>
          </div>
        ))}
        {feed.length===0&&<EmptyState icon="◎" title="No posts yet" sub="Be the first to share your progress with the community."/>}
      </div>
      <div style={{width:224,flexShrink:0,display:"flex",flexDirection:"column",gap:12}}>
        <Card style={{padding:"16px 18px"}}>
          <SectionTitle>Top this month</SectionTitle>
          {[{u:"AlejandroR",a:"UC San Diego D1"},{u:"FerSwim_GDL",a:"−2.1s on 100 free"},{u:"ValSwim_CDMX",a:"3 coaches replied"}].map(({u,a})=>(
            <div key={u} style={{padding:"7px 0",borderBottom:`1px solid ${D.border}`}}>
              <div style={s({fontSize:12,fontWeight:600,color:D.text})}>{u}</div>
              <div style={s({fontSize:11,color:D.textLight,marginTop:1})}>{a}</div>
            </div>
          ))}
        </Card>
        <HeroCard style={{padding:"16px 18px"}}>
          <div style={s({color:"rgba(255,255,255,0.28)",fontSize:9,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",marginBottom:5})}>Advertise on XIMO</div>
          <div style={s({color:D.white,fontWeight:700,fontSize:13,marginBottom:4})}>Reach 1,200+ elite athletes</div>
          <div style={s({color:"rgba(255,255,255,0.32)",fontSize:11,lineHeight:1.5})}>Premium · Targeted · High intent</div>
        </HeroCard>
      </div>
    </div>
  );
}

// ─── RECRUITMENT ──────────────────────────────────────────────────
function Recruitment({user}) {
  const [contacts,setContacts]=useState(INIT_CONTACTS);
  const [tab,setTab]=useState("pipeline");
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({university:"",coach:"",email:"",status:"identified",priority:"medium",notes:"",date:""});
  const [tmpl,setTmpl]=useState({event:"50 libre",time:"26.0",gpa:"3.8"});
  const [copied,setCopied]=useState(false);
  const addContact=()=>{if(!form.university)return;setContacts(c=>[...c,{id:Date.now(),...form,div:"D1",response:null}]);setModal(false);setForm({university:"",coach:"",email:"",status:"identified",priority:"medium",notes:"",date:""});};
  const move=(id,s)=>setContacts(cs=>cs.map(c=>c.id===id?{...c,status:s}:c));
  const remove=(id)=>setContacts(cs=>cs.filter(c=>c.id!==id));
  const stageSummary=PIPELINE_STAGES.map(s=>({...s,count:contacts.filter(c=>c.status===s.id).length}));
  const followUp=(c)=>{if(c.status==="replied"||c.status==="interested")return"⏱ Follow up today";if(c.status==="contacted"&&c.date)return"⏱ Follow up in 7 days";return null;};
  const emailDraft=`Dear Coach {last_name},\n\nMy name is ${user.name} and I am a competitive swimmer from Mexico, nationally ranked Top 15. My primary event is the ${tmpl.event} with a best of ${tmpl.time}s LC.\n\nI am very interested in the [University] program and would like to explore recruitment opportunities. My GPA is ${tmpl.gpa} and I am enrolled in IB-level coursework.\n\nI would be glad to share my full athlete profile, competition video, and coach references.\n\nCould we schedule a brief call to discuss the process?\n\nSincerely,\n${user.name}\n${tmpl.event} · ${tmpl.time}s LC · Mexico · ximo.academy`;

  return (
    <div style={{display:"flex",gap:20}}>
      <div style={{flex:1,minWidth:0}}>
        <Fade>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div>
              <div style={s({fontWeight:800,fontSize:20,color:D.text,letterSpacing:-0.5})}>Recruitment</div>
              <div style={s({fontSize:13,color:D.textLight,marginTop:2})}>Your NCAA recruiting command center.</div>
            </div>
            <Btn onClick={()=>setModal(true)}>+ Add coach</Btn>
          </div>
          <div style={{display:"flex",gap:6,marginBottom:16}}>
            {["pipeline","contacts","template"].map(t=><button key={t} onClick={()=>setTab(t)} style={s({background:tab===t?D.navy:"transparent",color:tab===t?D.white:D.textMid,border:`1px solid ${tab===t?D.navy:D.border}`,borderRadius:D.rSm,padding:"6px 14px",fontSize:12,fontWeight:500,cursor:"pointer"})}>{t==="pipeline"?"Pipeline":t==="contacts"?"All Contacts":"Email Template"}</button>)}
          </div>
        </Fade>

        {tab==="pipeline"&&<Fade>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:16}}>
            {stageSummary.map(st=>(
              <div key={st.id} style={{background:D.bgCard,borderRadius:D.rSm,border:`1px solid ${D.border}`,padding:"10px 13px",display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:st.dot,flexShrink:0}}/>
                <div style={{flex:1,fontSize:11,fontWeight:600,color:D.textMid}}>{st.label}</div>
                <span style={s({fontWeight:800,fontSize:17,color:st.color,fontFamily:mono})}>{st.count}</span>
              </div>
            ))}
          </div>
          {PIPELINE_STAGES.filter(st=>contacts.some(c=>c.status===st.id)).map(stage=>(
            <div key={stage.id} style={{marginBottom:15}}>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:7}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:stage.dot}}/>
                <span style={s({fontWeight:700,fontSize:11,color:D.textMid,textTransform:"uppercase",letterSpacing:0.7})}>{stage.label}</span>
                <span style={s({fontSize:10,color:D.textXLight})}>({contacts.filter(c=>c.status===stage.id).length})</span>
              </div>
              {contacts.filter(c=>c.status===stage.id).map(c=>{
                const fp=followUp(c);
                return (
                  <Card key={c.id} style={{padding:"12px 15px",marginBottom:7}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                          <span style={s({fontWeight:600,fontSize:13,color:D.text})}>{c.university}</span>
                          <Badge text={c.priority} color={c.priority==="high"?D.red:c.priority==="medium"?D.amber:D.textLight}/>
                          {c.response&&<Badge text={`★ ${c.response}/5`} color={D.teal}/>}
                        </div>
                        <div style={s({fontSize:11,color:D.textLight})}>{c.coach}{c.email&&` · ${c.email}`}</div>
                        {c.notes&&<div style={{fontSize:11,color:D.textMid,marginTop:5,background:D.bg,borderRadius:D.rSm,padding:"5px 9px",lineHeight:1.45}}>{c.notes}</div>}
                        {fp&&<div style={{fontSize:10,color:D.teal,fontWeight:600,marginTop:5}}>{fp}</div>}
                      </div>
                      <div style={{display:"flex",gap:4,flexShrink:0,flexWrap:"wrap",justifyContent:"flex-end"}}>
                        {PIPELINE_STAGES.filter(ss=>ss.id!==stage.id).slice(0,2).map(ns=>(
                          <button key={ns.id} onClick={()=>move(c.id,ns.id)} style={s({fontSize:10,background:`${ns.dot}14`,color:ns.dot,border:`1px solid ${ns.dot}28`,borderRadius:6,padding:"3px 7px",cursor:"pointer",fontWeight:600})}>→ {ns.label}</button>
                        ))}
                        <button onClick={()=>remove(c.id)} style={s({fontSize:10,background:D.redL,color:D.red,border:"none",borderRadius:6,padding:"3px 7px",cursor:"pointer"})}>✕</button>
                      </div>
                    </div>
                    {c.date&&<div style={s({fontSize:10,color:D.textXLight,marginTop:5})}>{c.date}</div>}
                  </Card>
                );
              })}
            </div>
          ))}
          {contacts.length===0&&<EmptyState icon="⬘" title="No coaches yet" sub="Start adding coaches to build your recruitment pipeline." action="Add first coach" onAction={()=>setModal(true)}/>}
        </Fade>}

        {tab==="contacts"&&<Fade>
          <Card style={{padding:"18px 22px"}}>
            <SectionTitle>All contacts ({contacts.length})</SectionTitle>
            {contacts.map(c=>{
              const st=PIPELINE_STAGES.find(ss=>ss.id===c.status);
              return (
                <div key={c.id} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"10px 0",borderBottom:`1px solid ${D.border}`}}>
                  <div style={{width:7,height:7,borderRadius:"50%",background:st?.dot||D.textXLight,marginTop:5,flexShrink:0}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={s({fontWeight:600,fontSize:13,color:D.text})}>{c.university}</div>
                    <div style={s({fontSize:11,color:D.textLight,marginTop:1})}>{c.coach}{c.email&&` · ${c.email}`}</div>
                    {c.notes&&<div style={s({fontSize:11,color:D.textMid,marginTop:3})}>{c.notes}</div>}
                  </div>
                  <div style={{display:"flex",gap:5,alignItems:"center",flexShrink:0}}>
                    <Badge text={st?.label||c.status} color={st?.color||D.textMid}/>
                    <Badge text={c.priority} color={c.priority==="high"?D.red:c.priority==="medium"?D.amber:D.textLight}/>
                    <span style={s({fontSize:10,color:D.textXLight})}>{c.date}</span>
                  </div>
                </div>
              );
            })}
          </Card>
        </Fade>}

        {tab==="template"&&<Fade>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <Card style={{padding:"18px 22px"}}>
              <SectionTitle>Personalize your email</SectionTitle>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:11}}>
                <Input label="Main event" value={tmpl.event} onChange={e=>setTmpl(t=>({...t,event:e.target.value}))}/>
                <Input label="Best time" value={tmpl.time} onChange={e=>setTmpl(t=>({...t,time:e.target.value}))}/>
                <Input label="GPA" value={tmpl.gpa} onChange={e=>setTmpl(t=>({...t,gpa:e.target.value}))}/>
              </div>
            </Card>
            <Card style={{padding:"18px 22px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:11}}>
                <SectionTitle style={{marginBottom:0}}>Generated email</SectionTitle>
                <Btn variant="secondary" size="sm" onClick={()=>{navigator.clipboard?.writeText(emailDraft);setCopied(true);setTimeout(()=>setCopied(false),2000);}}>{copied?"Copied ✓":"Copy"}</Btn>
              </div>
              <pre style={s({background:D.bg,border:`1px solid ${D.border}`,borderRadius:D.rSm,padding:"13px 15px",fontSize:12,color:D.textMid,lineHeight:1.75,whiteSpace:"pre-wrap",overflowY:"auto",maxHeight:280,fontFamily:mono,margin:0})}>{emailDraft}</pre>
            </Card>
          </div>
        </Fade>}

        {modal&&(
          <div style={{position:"fixed",inset:0,background:"rgba(13,31,45,0.75)",backdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999}}>
            <Card style={{width:440,padding:"28px 32px",position:"relative",overflow:"visible"}}>
              <CornerMark style={{position:"absolute",top:8,left:8}} opacity={0.18}/>
              <div style={s({fontWeight:700,fontSize:17,color:D.text,marginBottom:16})}>Add coach</div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <Input label="University" value={form.university} onChange={e=>setForm(f=>({...f,university:e.target.value}))}/>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <Input label="Coach name" value={form.coach} onChange={e=>setForm(f=>({...f,coach:e.target.value}))}/>
                  <Input label="Email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} type="email"/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                  <Sel label="Status" value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} options={PIPELINE_STAGES.map(s=>({value:s.id,label:s.label}))}/>
                  <Sel label="Priority" value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))} options={["high","medium","low"]}/>
                  <Input label="Date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} placeholder="Mar 15"/>
                </div>
                <div>
                  <label style={s({fontSize:10,fontWeight:700,color:D.textLight,display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:0.8})}>Notes</label>
                  <textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} rows={2} style={s({width:"100%",border:`1px solid ${D.border}`,borderRadius:D.rSm,padding:"8px 11px",fontSize:13,background:"rgba(255,255,255,0.88)",color:D.text,resize:"none",outline:"none",boxSizing:"border-box",fontFamily:font})}/>
                </div>
              </div>
              <div style={{display:"flex",gap:9,marginTop:16}}>
                <Btn onClick={addContact}>Save coach</Btn>
                <Btn variant="ghost" onClick={()=>setModal(false)}>Cancel</Btn>
              </div>
            </Card>
          </div>
        )}
      </div>
      <div style={{width:224,flexShrink:0}}>
        <Card style={{padding:"16px 18px"}}>
          <SectionTitle>Pipeline</SectionTitle>
          {stageSummary.map(st=>(
            <div key={st.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${D.border}`}}>
              <div style={{display:"flex",alignItems:"center",gap:7}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:st.dot}}/><span style={s({fontSize:12,color:D.textMid})}>{st.label}</span>
              </div>
              <span style={s({fontWeight:700,color:st.color,fontFamily:mono,fontSize:13})}>{st.count}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ─── COURSES ──────────────────────────────────────────────────────
function Courses() {
  const [sel,setSel]=useState(null);
  const [progress,setProgress]=useState({4:35});
  if(sel) return (
    <div style={{display:"flex",gap:20}}>
      <div style={{flex:1,minWidth:0}}>
        <Btn variant="ghost" size="sm" onClick={()=>setSel(null)} style={{marginBottom:14}}>← Back to courses</Btn>
        <Fade>
          <HeroCard style={{padding:"24px 28px",marginBottom:16}}>
            <div style={s({color:"rgba(255,255,255,0.28)",fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:7})}>{sel.sub}</div>
            <div style={s({color:D.white,fontWeight:800,fontSize:21,letterSpacing:-0.5})}>{sel.title}</div>
            <GrecaDivider color={D.teal} opacity={0.2} style={{margin:"11px 0"}}/>
            <div style={s({color:"rgba(255,255,255,0.3)",fontSize:12})}>{sel.lessons} lessons · {sel.duration} · {sel.students} enrolled · ★ {sel.rating}</div>
          </HeroCard>
        </Fade>
        <Fade delay={60}><Card style={{padding:"18px 22px",marginBottom:12}}>
          <SectionTitle>About this course</SectionTitle>
          <p style={s({fontSize:13,color:D.textMid,lineHeight:1.7,margin:0})}>A practical, no-fluff course built from real experience. Every module reflects a real step in the XIMO recruitment process. No theory — only what works for competitive swimmers pursuing D1 in the United States.</p>
        </Card></Fade>
        <Fade delay={100}><Card style={{padding:"18px 22px"}}>
          <SectionTitle>Course content</SectionTitle>
          {["Introduction and mindset","The step-by-step XIMO process","Common mistakes to avoid","Advanced recruiting strategy","Q&A with real athlete case studies","Downloadable XIMO resources and templates"].slice(0,sel.lessons).map((l,i)=>{
            const done=(progress[sel.id]||0)>i;
            return (
              <div key={l} onClick={()=>setProgress(p=>({...p,[sel.id]:Math.max(p[sel.id]||0,i+1)}))}
                style={{display:"flex",gap:11,alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${D.border}`,cursor:"pointer",transition:"background 0.15s",borderRadius:D.rSm}}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(46,139,139,0.04)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{width:26,height:26,borderRadius:7,background:done?D.greenL:i===0?D.tealLight:D.bg,border:`1px solid ${done?D.green:i===0?D.tealBorder:D.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:done?D.green:i===0?D.teal:D.textLight,flexShrink:0}}>{done?"✓":i===0?"▶":i+1}</div>
                <span style={s({fontSize:13,color:D.text,fontWeight:done||i===0?500:400})}>Lesson {i+1}: {l}</span>
                {done&&<Badge text="Done" color={D.green} style={{marginLeft:"auto"}}/>}
              </div>
            );
          })}
        </Card></Fade>
      </div>
      <div style={{width:224,flexShrink:0}}>
        <HeroCard style={{padding:"18px 20px"}}>
          <div style={s({color:"rgba(255,255,255,0.28)",fontSize:9,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:5})}>{sel.free?"Free course":"Included in XIMO"}</div>
          <div style={s({color:D.white,fontWeight:800,fontSize:19,letterSpacing:-0.5,marginBottom:13})}>{sel.free?"No cost":"Full access"}</div>
          <div style={{background:"rgba(255,255,255,0.07)",borderRadius:D.rSm,padding:"9px 13px",color:D.white,fontWeight:600,fontSize:13,textAlign:"center",cursor:"pointer",border:`1px solid ${D.tealBorder}`}}>{sel.free?"Start now →":"Continue →"}</div>
          {(progress[sel.id]||0)>0&&<div style={{marginTop:13}}>
            <ProgressBar value={progress[sel.id]||0} max={sel.lessons} color={D.teal} height={3}/>
            <div style={s({fontSize:10,color:"rgba(255,255,255,0.28)",marginTop:4})}>{Math.round(((progress[sel.id]||0)/sel.lessons)*100)}% complete</div>
          </div>}
        </HeroCard>
      </div>
    </div>
  );

  return (
    <Fade>
      <div style={{marginBottom:16}}>
        <div style={s({fontWeight:800,fontSize:20,color:D.text,letterSpacing:-0.5,marginBottom:3})}>Courses</div>
        <div style={s({fontSize:13,color:D.textLight,marginBottom:13})}>Built from real experience. Learn from someone actively living the process.</div>
        <GrecaDivider color={D.teal} opacity={0.25}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:13}}>
        {COURSES.map((c,i)=>(
          <Fade key={c.id} delay={i*30}>
            <Card hover style={{padding:"18px 17px",cursor:"pointer"}} onClick={()=>setSel(c)}>
              <div style={s({fontSize:10,fontWeight:700,color:D.textXLight,letterSpacing:0.8,textTransform:"uppercase",marginBottom:6})}>{c.sub}</div>
              <div style={s({fontWeight:700,fontSize:14,color:D.text,letterSpacing:-0.3,marginBottom:9,lineHeight:1.3})}>{c.title}</div>
              <div style={{display:"flex",gap:5,marginBottom:12,flexWrap:"wrap"}}>
                <Badge text={`${c.lessons} lessons`}/>
                <Badge text={c.free?"Free":"Premium"} color={c.free?D.green:D.amber}/>
              </div>
              {(progress[c.id]||0)>0
                ?<div><ProgressBar value={progress[c.id]} max={c.lessons} height={4}/><div style={s({fontSize:10,color:D.textXLight,marginTop:4})}>{Math.round((progress[c.id]/c.lessons)*100)}%</div></div>
                :<div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:D.textXLight}}><span>★ {c.rating}</span><span>{c.students}</span><span>{c.duration}</span></div>
              }
            </Card>
          </Fade>
        ))}
      </div>
    </Fade>
  );
}

// ─── EXAMS ────────────────────────────────────────────────────────
function Exams() {
  const types=["SAT","TOEFL","Admissions","NCAA"];
  const typeColor={SAT:D.teal,TOEFL:"#7C3AED",Admissions:D.amber,NCAA:D.green};
  return (
    <Fade>
      <div style={{marginBottom:16}}>
        <div style={s({fontWeight:800,fontSize:20,color:D.text,letterSpacing:-0.5,marginBottom:3})}>SAT · TOEFL · Admissions · NCAA</div>
        <div style={s({fontSize:13,color:D.textLight,marginBottom:13})}>Direct access to the resources that matter for your US university application.</div>
        <GrecaDivider color={D.teal} opacity={0.25}/>
      </div>
      <div style={{background:D.bg,border:`1px solid ${D.border}`,borderRadius:D.r,padding:"12px 16px",marginBottom:20,display:"flex",gap:11,alignItems:"flex-start",position:"relative",overflow:"hidden"}}>
        <CornerMark size={12} color={D.teal} opacity={0.18} style={{position:"absolute",top:4,left:4}}/>
        <DiamondMark color={D.teal} opacity={0.6} size={14} style={{marginTop:2,flexShrink:0}}/>
        <div style={s({fontSize:13,color:D.textMid,lineHeight:1.6})}><strong style={{color:D.text}}>From XIMO:</strong> Start SAT and TOEFL at least 12 months before your target application date. Coaches ask for your scores — have them ready before reaching out.</div>
      </div>
      {types.map(type=>(
        <div key={type} style={{marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:11}}>
            <div style={{width:4,height:17,borderRadius:2,background:typeColor[type]}}/>
            <span style={s({fontWeight:700,fontSize:15,color:D.text,letterSpacing:-0.2})}>{type}</span>
            <GrecaDivider color={typeColor[type]} opacity={0.14} style={{flex:1}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
            {EXAMS.filter(r=>r.type===type).map(r=>(
              <Card hover key={r.name} style={{padding:"16px 18px"}}>
                <div style={s({fontWeight:600,fontSize:14,color:D.text,marginBottom:4})}>{r.name}</div>
                <div style={s({fontSize:12,color:D.textMid,lineHeight:1.55,marginBottom:11})}>{r.desc}</div>
                <Btn variant="secondary" size="sm">Visit →</Btn>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </Fade>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────
function Profile({user}) {
  const [form,setForm]=useState({name:user.name,age:"17",country:user.country||"Mexico",event:user.event||"50 libre",gpa:"3.8",sat:"",toefl:"",weight:"68",height:"180",wingspan:"182",gradYear:"2026",club:"Tigres MTY",coach:"Martín Espinoza",bio:"High-performance competitive swimmer from Monterrey, Mexico. Top 15 nationally. Building my path to NCAA D1. Cheetah mindset."});
  const [saved,setSaved]=useState(false);
  const [tab,setTab]=useState("info");
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const xi=calcXimo({"50 libre":form.event==="50 libre"?"26.0":"27.0","100 libre":"58.0","200 libre":"130"});
  const [tick,setTick]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setTick(x=>x+1),80);return()=>clearInterval(t);},[]);

  return (
    <div style={{display:"flex",gap:20}}>
      <div style={{flex:1,minWidth:0}}>
        <Fade>
          <HeroCard tick={tick} style={{padding:"24px 28px",marginBottom:18}}>
            <div style={{display:"flex",gap:16,alignItems:"center"}}>
              <div style={{width:64,height:64,borderRadius:16,background:"rgba(46,139,139,0.18)",border:"2px solid rgba(46,139,139,0.35)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,color:D.teal,fontWeight:800,flexShrink:0}}>{form.name[0]}</div>
              <div>
                <div style={s({color:D.white,fontWeight:800,fontSize:21,letterSpacing:-0.5})}>{form.name}</div>
                <div style={s({color:"rgba(255,255,255,0.38)",fontSize:13,marginTop:3})}>{form.country} · {form.event} · Class of {form.gradYear}</div>
                <div style={{display:"flex",gap:7,marginTop:9,flexWrap:"wrap"}}>
                  <Badge text="Top 15 Mexico" color="rgba(255,255,255,0.72)" bg="rgba(255,255,255,0.08)"/>
                  <Badge text="Open to recruit" color={D.teal} bg="rgba(46,139,139,0.16)"/>
                  <Badge text={`XIMO ${xi.overall} · ${xi.tier}`} color={D.teal} bg="rgba(46,139,139,0.2)"/>
                </div>
              </div>
            </div>
            <GrecaDivider color={D.teal} opacity={0.18} style={{margin:"13px 0 9px"}}/>
            <div style={s({fontSize:13,color:"rgba(255,255,255,0.38)",lineHeight:1.6,fontStyle:"italic"})}>{form.bio}</div>
          </HeroCard>
        </Fade>

        <div style={{display:"flex",gap:6,marginBottom:16}}>
          {["info","academic","bio"].map(t=><button key={t} onClick={()=>setTab(t)} style={s({background:tab===t?D.navy:"transparent",color:tab===t?D.white:D.textMid,border:`1px solid ${tab===t?D.navy:D.border}`,borderRadius:D.rSm,padding:"6px 14px",fontSize:12,fontWeight:500,cursor:"pointer",textTransform:"capitalize"})}>{t==="info"?"Personal Info":t==="academic"?"Academic & Athletic":"Bio & Links"}</button>)}
        </div>

        {tab==="info"&&<Fade>
          <Card style={{padding:"20px 22px"}}>
            <SectionTitle>Personal information</SectionTitle>
            <div style={{display:"flex",flexDirection:"column",gap:11}}>
              <Input label="Full name" value={form.name} onChange={e=>set("name",e.target.value)}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <Input label="Age" value={form.age} onChange={e=>set("age",e.target.value)} type="number"/>
                <Input label="Grad year" value={form.gradYear} onChange={e=>set("gradYear",e.target.value)}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <Input label="Country" value={form.country} onChange={e=>set("country",e.target.value)}/>
                <Sel label="Main event" value={form.event} onChange={e=>set("event",e.target.value)} options={["50 libre","100 libre","200 libre","100 fly","200 fly","100 back","200 breast","200 IM","400 IM"]}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                <Input label="Weight (kg)" value={form.weight} onChange={e=>set("weight",e.target.value)}/>
                <Input label="Height (cm)" value={form.height} onChange={e=>set("height",e.target.value)}/>
                <Input label="Wingspan (cm)" value={form.wingspan} onChange={e=>set("wingspan",e.target.value)}/>
              </div>
            </div>
          </Card>
        </Fade>}

        {tab==="academic"&&<Fade>
          <Card style={{padding:"20px 22px"}}>
            <SectionTitle>Academic & athletic profile</SectionTitle>
            <div style={{display:"flex",flexDirection:"column",gap:11}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <Input label="GPA" value={form.gpa} onChange={e=>set("gpa",e.target.value)}/>
                <Input label="SAT score" value={form.sat} onChange={e=>set("sat",e.target.value)} placeholder="e.g. 1350"/>
              </div>
              <Input label="TOEFL score" value={form.toefl} onChange={e=>set("toefl",e.target.value)} placeholder="e.g. 95"/>
              <Input label="Club / team" value={form.club} onChange={e=>set("club",e.target.value)}/>
              <Input label="Current coach" value={form.coach} onChange={e=>set("coach",e.target.value)}/>
            </div>
          </Card>
        </Fade>}

        {tab==="bio"&&<Fade>
          <Card style={{padding:"20px 22px"}}>
            <SectionTitle>Public bio</SectionTitle>
            <textarea value={form.bio} onChange={e=>set("bio",e.target.value)} rows={4}
              style={s({width:"100%",border:`1px solid ${D.border}`,borderRadius:D.rSm,padding:"10px 13px",fontSize:13,background:"rgba(255,255,255,0.8)",color:D.text,resize:"none",outline:"none",boxSizing:"border-box",fontFamily:font,lineHeight:1.6})}
              onFocus={e=>e.target.style.borderColor=D.teal} onBlur={e=>e.target.style.borderColor=D.border}/>
            <div style={s({fontSize:11,color:D.textLight,marginTop:8,marginBottom:14})}>This appears on your public coach-shareable profile.</div>
            <Btn onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2000);}}>{saved?"Saved ✓":"Save profile"}</Btn>
          </Card>
        </Fade>}
      </div>

      <div style={{width:224,flexShrink:0,display:"flex",flexDirection:"column",gap:12}}>
        <Fade delay={80}>
          <Card style={{padding:"16px 18px"}}>
            <SectionTitle>Recruit profile score</SectionTitle>
            {[["GPA",form.gpa||"—",!!form.gpa],["SAT",form.sat||"Not set",!!form.sat],["TOEFL",form.toefl||"Not set",!!form.toefl],["XIMO Score",`${xi.overall} · ${xi.tier}`,true],["Status","Open to recruit",true],["Times","Set in Power Index",true]].map(([l,v,ok])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${D.border}`}}>
                <span style={s({fontSize:12,color:D.textLight})}>{l}</span>
                <span style={s({fontWeight:500,color:ok?D.text:D.textXLight,fontSize:12})}>{v}</span>
              </div>
            ))}
            {(!form.sat||!form.toefl)&&<div style={s({fontSize:11,color:D.textMid,marginTop:8,lineHeight:1.5})}>Add SAT and TOEFL to maximize coach visibility.</div>}
          </Card>
          <HeroCard style={{padding:"15px 17px"}}>
            <div style={{display:"flex",alignItems:"center",gap:9}}>
              <AppIcon size={26}/>
              <div>
                <div style={s({color:D.teal,fontWeight:700,fontSize:12,letterSpacing:0.5})}>XIMO Profile</div>
                <div style={s({color:"rgba(255,255,255,0.28)",fontSize:10,marginTop:1})}>Visible to 130+ coaches</div>
              </div>
            </div>
            <div style={{marginTop:12}}>
              <Btn variant="secondary" size="sm" style={{width:"100%",justifyContent:"center",color:"rgba(255,255,255,0.7)",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(46,139,139,0.2)"}}>Share public profile →</Btn>
            </div>
          </HeroCard>
        </Fade>
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────
export default function App() {
  const [screen,setScreen]=useState("landing");
  const [authMode,setAuthMode]=useState("login");
  const [user,setUser]=useState(null);
  const [tab,setTab]=useState("dashboard");

  const handleAuth=(u)=>{setUser(u);setScreen("app");};

  if(screen==="landing") return <Landing onLogin={()=>{setAuthMode("login");setScreen("auth");}} onRegister={()=>{setAuthMode("register");setScreen("auth");}}/>;
  if(screen==="auth") return <AuthModal mode={authMode} onAuth={handleAuth} onSwitch={()=>setAuthMode(m=>m==="login"?"register":"login")} onBack={()=>setScreen("landing")}/>;

  const screens={
    dashboard: <Dashboard user={user} setTab={setTab}/>,
    power:     <PowerIndex/>,
    teamfit:   <TeamFit/>,
    universities: <Universities/>,
    community: <Community user={user}/>,
    recruitment: <Recruitment user={user}/>,
    courses:   <Courses/>,
    exams:     <Exams/>,
    profile:   <Profile user={user}/>,
  };

  return (
    <div style={{display:"flex",minHeight:"100vh",background:D.bg}}>
      <style>{`
        *{box-sizing:border-box;}
        body{margin:0;background:${D.bg};}
        ::-webkit-scrollbar{width:5px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(13,31,45,0.11);border-radius:3px;}
        input::placeholder,textarea::placeholder{color:${D.textXLight};}
        select{appearance:auto;}
      `}</style>
      <Sidebar active={tab} setActive={setTab} user={user}/>
      <main style={{flex:1,padding:"22px 30px",overflowY:"auto",maxHeight:"100vh"}}>
        {/* Topbar */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <DiamondMark color={D.teal} opacity={0.55}/>
            <span style={s({fontWeight:700,fontSize:15,color:D.text,letterSpacing:-0.3})}>{NAV.find(n=>n.id===tab)?.label}</span>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={s({fontSize:12,color:D.textLight})}>{user.name.split(" ")[0]}</div>
            <div style={{width:30,height:30,borderRadius:8,background:D.navy,border:"1px solid rgba(46,139,139,0.22)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:D.teal,fontWeight:800,cursor:"pointer"}}>{user.name[0]}</div>
          </div>
        </div>
        {screens[tab]}
      </main>
    </div>
  );
}
