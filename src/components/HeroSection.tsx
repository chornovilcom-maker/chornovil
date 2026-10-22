import {useEffect,useRef,useState} from 'react';
import {motion,useAnimationFrame,useMotionValue,useMotionValueEvent,useReducedMotion,useScroll,useSpring,useTransform} from 'framer-motion';
import {ArrowDown,ArrowUpRight,MoveRight} from 'lucide-react';
import {SectionMeta,SourceLink,goToSection} from './ArchiveUI';
const moments=[{year:'1937',label:'ЛЮДИНА',title:'Власний шлях починається з вибору.',text:'Народився на Черкащині. Обрав журналістику — і право говорити власним голосом.'},{year:'1965',label:'СЛОВО',title:'Крок проти мовчання.',text:'Разом з Іваном Дзюбою та Василем Стусом виступив проти арештів української інтелігенції.'},{year:'1972',label:'СПРОТИВ',title:'Йти далі. Навіть у неволі.',text:'Табори й заслання не змусили Чорновола відмовитися від переконань та правозахисної роботи.'},{year:'1991',label:'ДЕРЖАВА',title:'Від спротиву — до незалежності.',text:'Разом з іншими депутатами вніс синьо-жовтий прапор до сесійної зали Верховної Ради.'}];
// Atlas layout is isolated so a higher-fidelity cycle can be substituted without changing choreography.
const gait={src:'/images/chornovil-walk-sheet-v1.webp',columns:4,rows:2,frames:8};
// Stabilise the head across the original atlas cells before interpolating poses.
const headAnchors=[[240.7,44.1],[213.5,43.8],[202.7,43.7],[192.9,44.2],[236.5,42.6],[217.4,42.4],[200,42.5],[195.2,42.6]];
export function HeroSection(){
 const ref=useRef<HTMLDivElement>(null),lane=useRef<HTMLDivElement>(null),figure=useRef<HTMLDivElement>(null),frames=useRef<(HTMLDivElement|null)[]>([]);
 const [phase,setPhase]=useState(0),[percent,setPercent]=useState(0),[turnFrame,setTurnFrame]=useState(0),[geometry,setGeometry]=useState({width:1000,figureWidth:400});
 const travel=useMotionValue(0);
 const turnProgress=useMotionValue(0);
 const reduced=useReducedMotion(),{scrollYProgress}=useScroll({target:ref,offset:['start start','end end']});
 const smooth=useSpring(scrollYProgress,{stiffness:75,damping:25,mass:.7,restDelta:.0001,restSpeed:.001});
 useEffect(()=>{const update=()=>{if(!lane.current||!figure.current)return;const width=lane.current.clientWidth,figureWidth=figure.current.offsetWidth;setGeometry(prev=>prev.width===width&&prev.figureWidth===figureWidth?prev:{width,figureWidth})};const observer=new ResizeObserver(update);if(lane.current)observer.observe(lane.current);if(figure.current)observer.observe(figure.current);update();return()=>observer.disconnect()},[]);
 useMotionValueEvent(smooth,'change',p=>{if(reduced)return;const v=Math.max(0,Math.min(1,p));setPhase(Math.min(3,Math.floor(v*4)));setPercent(Math.round(v*100))});
 // Translation and pose share ONE physical distance. Fast scrolling cannot detach
 // the feet from the body or trigger the turn before the figure has arrived.
 useAnimationFrame((_time,delta)=>{
  if(reduced)return;
  const p=Math.max(0,Math.min(1,smooth.get()));
  const end=Math.max(0,geometry.width-geometry.figureWidth*.96);
  const target=Math.min(1,p/.84)*end;
  const current=travel.get(),diff=target-current,dt=Math.min(delta,32)/1000;
  const speed=geometry.figureWidth*.65;
  const next=current+Math.sign(diff)*Math.min(Math.abs(diff),speed*dt);
  travel.set(next);
  const arrived=Math.abs(next-end)<.5;
  const desiredTurn=arrived?Math.max(0,Math.min(1,(p-.86)/.12)):0;
  const t=turnProgress.get(),turnDiff=desiredTurn-t;
  const turn=t+Math.sign(turnDiff)*Math.min(Math.abs(turnDiff),dt/.65);
  turnProgress.set(turn);
  setTurnFrame(Math.min(3,Math.max(0,Math.floor(turn*4))));
  const stride=Math.max(110,geometry.figureWidth*.55);
  const index=Math.floor(next/stride*gait.frames)%gait.frames;
  const el=frames.current[0];
  if(el){el.style.backgroundPosition=`${index%gait.columns/(gait.columns-1)*100}% ${Math.floor(index/gait.columns)/(gait.rows-1)*100}%`;el.style.transform=`translate(${(225-headAnchors[index][0])/384*100}%,${(43.5-headAnchors[index][1])/512*100}%)`}
 });
 const center=Math.max(0,(geometry.width-geometry.figureWidth)/2);
 const profileOpacity=useTransform(turnProgress,t=>t>0?0:1),frontOpacity=useTransform(turnProgress,t=>t>0?1:0);
 const nameX=useTransform(smooth,[0,.82,1],['20%','-2%','0%']);const nameClip=useTransform(smooth,p=>reduced?'inset(0 0 0 0)':`inset(0 ${Math.max(0,100-p*138)}% 0 0)`);const nameSpacing=useTransform(smooth,[0,.85,1],['-.12em','-.055em','-.055em']);
 const introOpacity=useTransform(smooth,[0,.18],[1,0]);const directionOpacity=useTransform(smooth,[0,.62,.76,1],[1,1,0,0]);
 const active=moments[phase];
 const jump=(i:number)=>{if(reduced){setPhase(i);return}const el=ref.current;if(!el)return;const top=el.getBoundingClientRect().top+window.scrollY;window.scrollTo({top:top+(el.offsetHeight-innerHeight)*[0,.32,.61,.99][i],behavior:'smooth'})};
 return <div id="hero-scroll-container" ref={ref} className="walking-hero smooth-walk-hero"><section id="hero" className="walking-stage"><SectionMeta number="01" date="1937 — 1999">В’ЯЧЕСЛАВ ЧОРНОВІЛ</SectionMeta><div className="walking-main">
 <motion.div className="walk-intro" style={{opacity:reduced?0:introOpacity}}><span><i/>ЛЮДИНА, ЯКА ОБРАЛА</span><h2>ЙТИ СВОЇМ<br/><em>ШЛЯХОМ.</em></h2></motion.div><motion.div className="walk-direction" style={{opacity:reduced?0:directionOpacity}}><span>СКРОЛ КЕРУЄ ІСТОРІЄЮ</span><MoveRight size={29}/></motion.div>
 <div className="walk-name-outline" aria-hidden="true">ЧОРНОВІЛ</div><motion.div className="walk-name-reveal" style={{clipPath:nameClip}}><motion.h1 style={{x:reduced?0:nameX,letterSpacing:reduced?'-.055em':nameSpacing}}>ЧОРНОВІЛ</motion.h1></motion.div>
 <div className="walk-lane" ref={lane}><motion.div className="walking-positioner" ref={figure} style={{x:reduced?center:travel}}><motion.div className="walk-blended-body walk-profile-plane" style={{opacity:reduced?0:profileOpacity}} role="img" aria-label="Анімована художня реконструкція ходи В’ячеслава Чорновола">{[0].map(i=><div key={i} ref={el=>{frames.current[i]=el}} className="walking-sprite blended-frame" style={{backgroundImage:`url('${gait.src}')`,backgroundSize:`${gait.columns*100}% ${gait.rows*100}%`,opacity:i===0?1:0}}/>)}</motion.div><motion.div className="walk-front-plane" style={{opacity:reduced?1:frontOpacity}}><div className="walk-turn-sprite" role="img" aria-label="Художня реконструкція: Чорновіл зупиняється й повертається до глядача" style={{backgroundPosition:`${(reduced?3:turnFrame)%2*100}% ${Math.floor((reduced?3:turnFrame)/2)*100}%`,transform:`translate(${[0,9.6,-.4,10][reduced?3:turnFrame]}%,-3.5%) scale(.95)`}}/></motion.div><span className="walking-shadow"/></motion.div><div className="walk-floor"/><motion.div className="walk-red-thread" style={{scaleX:smooth}}/></div>
 <span className="walk-reconstruction">ХУДОЖНЯ РЕКОНСТРУКЦІЯ / НЕ ІСТОРИЧНИЙ ВІДЕОЗАПИС</span></div>
 <div className="walking-summary"><div className="walk-year" key={'year'+phase}>{active.year}<span>{active.label}</span></div><div className="walk-fact" key={phase}><span className="walk-chapter-index">0{phase+1} / 04 — ХРОНІКА ВИБОРУ</span><h3>{active.title}</h3><p>{active.text}</p></div><SourceLink href={phase===3?'https://www.rada.gov.ua/news/Novyny/213061.html':undefined}>{phase===3?'Верховна Рада':'Біографія · УІНП'}</SourceLink></div><div className="walking-controls"><span className="archive-eyebrow">РУХАЙ ІСТОРІЮ<br/>ВЛАСНИМ СКРОЛОМ</span><div className="walking-years" role="group" aria-label="Ключові етапи шляху Чорновола">{moments.map((m,i)=><button key={m.year} aria-pressed={phase===i} onClick={()=>jump(i)} className={phase===i?'selected':''}><span>{m.year}</span><span>{m.label}</span><i/></button>)}</div><button className="walk-next" onClick={()=>goToSection('protest')} aria-label="До розділу про самвидав"><ArrowDown size={20}/></button></div><div className="walking-footer"><span>ХІД ІСТОРІЇ / {String(percent).padStart(2,'0')}%</span><button onClick={()=>goToSection('protest')}>ДАЛІ / СЛОВО ПРОТИ СИСТЕМИ<ArrowUpRight size={12}/></button></div></section></div>
}

