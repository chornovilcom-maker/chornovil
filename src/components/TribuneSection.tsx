import {useEffect,useRef,useState} from 'react';
import {motion,useReducedMotion,useScroll,useSpring,useTransform} from 'framer-motion';
import {Play,Pause,Expand,Radio,ArrowLeft,ArrowRight} from 'lucide-react';
import {sound} from '../utils/sound';
import {ArchiveDialog,SectionMeta,SourceLink} from './ArchiveUI';
const moments=[
 {year:'1989',label:'РУХ',date:'8–10 ВЕРЕСНЯ 1989',kicker:'УСТАНОВЧИЙ З’ЇЗД НАРОДНОГО РУХУ',heading:['ВІД СПРОТИВУ','ДО РУХУ.'],summary:'Ідея свободи виходить із підпілля.\nІ стає голосом тисяч.',image:'/images/rukh-congress-1989.jpg',alt:'Делегати установчого з’їзду Народного руху України у вересні 1989 року',caption:'КИЇВ / З’ЇЗД РУХУ / ВЕРЕСЕНЬ 1989',source:'https://www.uinp.gov.ua/istorychnyy-kalendar/veresen/8/1989-vidkryvsya-ustanovchyy-zyizd-narodnogo-ruhu-ukrayiny-za-perebudovu',credit:'З’їзд Руху · УІНП',description:'Установчий з’їзд Народного руху України за перебудову, Київ, 8–10 вересня 1989 року. Фото Сергія Марченка; публікація Українського інституту національної пам’яті.',title:'Від спротиву — до руху.',text:'Наприкінці 1980-х Чорновіл стає одним із провідних діячів національно-демократичного руху. Ідея незалежності виходить із підпілля на площі.'},
 {year:'1990',label:'РАДА',date:'1990 / ЛЬВІВ',kicker:'ЧОРНОВІЛ ОЧОЛЮЄ ЛЬВІВСЬКУ ОБЛРАДУ',heading:['СВОБОДА','БЕРЕ СЛОВО.'],summary:'Від площі — до парламенту.\nПереконання стають політичною дією.',image:'/images/chornovil-council-1990.jpg',alt:'В’ячеслав Чорновіл на трибуні Львівської обласної ради у 1990 році',caption:'ЧОРНОВІЛ / ЛЬВІВСЬКА ОБЛРАДА / 1990',source:'https://zbruc.eu/node/34801',credit:'Львівський парламент · Збруч',description:'В’ячеслав Чорновіл на трибуні Львівської обласної ради, 1990 рік. Архівне фото з публікації «Львівський парламент першого скликання» видання «Збруч».',title:'Від площі — до парламенту.',text:'У 1990 році Чорновіл стає народним депутатом та очолює Львівську обласну раду. Боротьба за державність переходить у відкриту політичну дію.'},
 {year:'1991',label:'НЕЗАЛЕЖНІСТЬ',date:'24 СЕРПНЯ 1991',kicker:'АКТ ПРОГОЛОШЕННЯ НЕЗАЛЕЖНОСТІ',heading:['НАРОДЖЕННЯ','НЕЗАЛЕЖНОСТІ.'],summary:'Те, за що переслідували,\nстало правом цілої країни.',image:'/images/flag-parliament-1991.jpg',alt:'Внесення прапора до Верховної Ради 24 серпня 1991 року',caption:'ВЕРХОВНА РАДА / 24.08.1991',source:'https://www.rada.gov.ua/news/Novyny/213061.html',credit:'Історія прапора · Верховна Рада',description:'Серед депутатів, які внесли прапор, був В’ячеслав Чорновіл. Документальне фото з офіційного порталу Верховної Ради.',title:'Прапор у сесійній залі.',text:'24 серпня 1991 року В’ячеслав Чорновіл разом з іншими народними депутатами вніс український прапор до сесійної зали Верховної Ради. Над будівлею парламенту прапор підняли 4 вересня.'}
];
export function TribuneSection(){
 const root=useRef<HTMLElement>(null),touch=useRef<number|null>(null);
 const [selected,setSelected]=useState(2),[playing,setPlaying]=useState(false),[photo,setPhoto]=useState<number|null>(null),[elapsed,setElapsed]=useState(0),[duration,setDuration]=useState(0);
 const reduced=useReducedMotion(),moment=moments[selected];
 const {scrollYProgress}=useScroll({target:root,offset:['start end','end start']});
 const progress=useSpring(scrollYProgress,{stiffness:65,damping:25});
 const drift=useTransform(progress,[0,1],[-45,45]),rotation=useTransform(progress,[0,1],[-2,2]);
 useEffect(()=>()=>sound.stopHistoricSpeech(),[]);
 useEffect(()=>{if(!playing)return;const timer=window.setInterval(()=>{const time=sound.getSpeechProgress();setElapsed(time.current);setDuration(time.duration)},100);return()=>window.clearInterval(timer)},[playing]);
 const fraction=duration?elapsed/duration:0;
 const clock=(value:number)=>`${Math.floor(value/60).toString().padStart(2,'0')}:${Math.floor(value%60).toString().padStart(2,'0')}`;

 const play=()=>{if(playing){sound.stopHistoricSpeech();setPlaying(false);setElapsed(0)}else setPlaying(sound.playHistoricSpeech(moment.text,()=>setPlaying(false),`tribune-${moment.year}`))};
 const select=(i:number)=>{if(i===selected)return;sound.stopHistoricSpeech();setPlaying(false);setElapsed(0);setDuration(0);setSelected(i)};
 const transition={duration:reduced?0:.55,ease:[.22,1,.36,1] as [number,number,number,number]};
 return <section ref={root} id="tribune" className={`tribune-refined tribune-scenes tribune-cinema ${playing?'is-projecting':''}`} onPointerMove={e=>{if(reduced||e.pointerType==='touch')return;const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--flag-x',`${((e.clientX-r.left)/r.width-.5)*20}px`);e.currentTarget.style.setProperty('--flag-y',`${((e.clientY-r.top)/r.height-.5)*15}px`)}}>
  <div className="tribune-flag-motion" aria-hidden="true"><motion.div className="tribune-scroll-fabric" style={reduced?{}:{y:drift,rotate:rotation}}><motion.div className="tribune-liquid-texture" animate={{x:reduced?0:(selected-1)*24,scale:reduced?1.08:1.1+selected*.025}} transition={{duration:1.6,ease:'easeInOut'}}/></motion.div></div><div className="tribune-wash"/>
  <SectionMeta number="05" date={moment.date}>НЕЗАЛЕЖНІСТЬ</SectionMeta>
  <div className="tribune-composition">
   <div className="tribune-story-card" onTouchStart={e=>{touch.current=e.touches[0].clientX}} onTouchEnd={e=>{if(touch.current===null)return;const delta=e.changedTouches[0].clientX-touch.current;touch.current=null;if(Math.abs(delta)>65)select(Math.max(0,Math.min(2,selected+(delta<0?1:-1))))}}>
    <div role="tabpanel" id="tribune-scene" aria-labelledby={`tribune-tab-${selected}`} tabIndex={0}>
     <motion.div key={moment.year} initial={reduced?false:{opacity:0,rotateY:-8,x:-22}} animate={{opacity:1,rotateY:0,x:0}} transition={transition} className="tribune-scene-content">
      <div className="archive-contact-label"><span>ІСТОРІЯ В КАДРІ / 0{selected+1}</span><span>{playing?'● ВІДТВОРЕННЯ':'◯ НАТИСНІТЬ PLAY'}</span></div>
      <div className="tribune-photo-stage" onPointerMove={e=>{if(reduced||e.pointerType==='touch')return;const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--photo-rx',`${-(e.clientY-r.top-r.height/2)/r.height*5}deg`);e.currentTarget.style.setProperty('--photo-ry',`${(e.clientX-r.left-r.width/2)/r.width*7}deg`)}} onPointerLeave={e=>{e.currentTarget.style.setProperty('--photo-rx','0deg');e.currentTarget.style.setProperty('--photo-ry','0deg')}}>
       <img className="tribune-archive-image" src={moment.image} alt={moment.alt}/>
       <div className="tribune-photo-shade"/>
       <span className="tribune-frame-corner tl"/><span className="tribune-frame-corner tr"/><span className="tribune-frame-corner bl"/><span className="tribune-frame-corner br"/>
       <span className="tribune-negative-number">{moment.year} — КАДР 0{selected+1}</span>
       <button className="tribune-expand" onClick={()=>setPhoto(selected)} aria-label={`Роздивитися фото: ${moment.alt}`}><Expand size={17}/></button>
       <button className="tribune-projector-trigger" onClick={play} aria-label={playing?'Зупинити історію':'Відтворити історію цього кадру'} aria-pressed={playing}><span className="projector-lens"><svg viewBox="0 0 100 100" aria-hidden="true"><circle className="lens-track" cx="50" cy="50" r="45"/><circle className="lens-progress" cx="50" cy="50" r="45" pathLength="1" strokeDasharray={`${fraction} 1`}/></svg><span>{playing?<Pause size={24}/>:<Play size={24}/>}</span></span><span className="projector-invite">{playing?'ІСТОРІЯ ЗВУЧИТЬ':'ОЖИВИТИ КАДР'}<small>{playing?'НАТИСНІТЬ, ЩОБ ЗУПИНИТИ':'СЛУХАТИ УКРАЇНСЬКОЮ'}</small></span></button>
       <div className="tribune-photo-title"><span className="archive-eyebrow">{moment.kicker}</span><h2>{moment.heading[0]}<br/><em>{moment.heading[1]}</em></h2><p className="tribune-summary">{moment.summary}</p></div>
      </div>
      <div className="tribune-projector-deck"><span className="projector-time">{clock(elapsed)} <i>/ {duration?clock(duration):'АУДІО'}</i></span><div className="projector-wave" aria-hidden="true">{Array.from({length:39},(_,i)=><i key={i} style={{height:`${7+((i*17+i*i*3)%23)}px`,animationDelay:`${i*.043}s`}}/>)}</div><span className="projector-status">{playing?'ЗВУЧИТЬ':'ГОТОВИЙ ДО ПРОСЛУХОВУВАННЯ'}</span><div className="projector-track" role="progressbar" aria-label="Прогрес української розповіді" aria-valuenow={Math.round(fraction*100)} aria-valuemin={0} aria-valuemax={100}><span style={{transform:`scaleX(${fraction})`}}/></div></div>
     </motion.div>
    </div>
    <div className="tribune-tabs" role="tablist" aria-label="Етапи відновлення незалежності" onKeyDown={e=>{let next=selected;if(e.key==='ArrowRight')next=(selected+1)%3;else if(e.key==='ArrowLeft')next=(selected+2)%3;else if(e.key==='Home')next=0;else if(e.key==='End')next=2;else return;e.preventDefault();select(next);document.getElementById(`tribune-tab-${next}`)?.focus()}}>{moments.map((m,i)=><button role="tab" tabIndex={selected===i?0:-1} id={`tribune-tab-${i}`} aria-selected={selected===i} aria-controls="tribune-scene tribune-transcript" key={m.year} onClick={()=>select(i)}>{selected===i&&<motion.i layoutId="tribune-active-year" transition={transition}/>}<img src={m.image} alt="" aria-hidden="true"/><span>{m.year}</span><small>{m.label}</small></button>)}</div>
    <SourceLink href={moment.source}>{moment.credit}</SourceLink>
   </div>
   <div className="tribune-monument"><div className="tribune-year-window"><motion.span key={moment.year} className="tribune-year" initial={reduced?false:{y:'35%',opacity:0,filter:'blur(8px)'}} animate={{y:0,opacity:1,filter:'blur(0px)'}} transition={transition}>{moment.year}</motion.span></div>
    <div className="tribune-chapter-control"><button onClick={()=>select(selected-1)} disabled={selected===0} aria-label="Попередній рік"><ArrowLeft size={16}/></button><span>0{selected+1} / 03 <b>{moment.label}</b></span><button onClick={()=>select(selected+1)} disabled={selected===2} aria-label="Наступний рік"><ArrowRight size={16}/></button></div>
   </div>
  </div>
  <div className={'tribune-transcript '+(playing?'playing':'')} role="tabpanel" id="tribune-transcript" aria-labelledby={`tribune-tab-${selected}`}><div aria-live="polite"><span className="archive-eyebrow"><Radio size={12}/>{moment.year} / {moment.title}</span><p>{moment.text}</p></div><span className="speech-disclaimer">УКРАЇНСЬКИЙ ПЕРЕКАЗ<br/>СИНТЕЗОВАНИЙ ГОЛОС</span></div>
  <div className="tribune-footer"><span>ДОКУМЕНТАЛЬНЕ ФОТО / {moment.credit.toUpperCase()}</span><span>ОБЕРІТЬ РІК · ГОРТАЙТЕ ІСТОРІЮ ↔</span></div>
  {photo!==null&&<ArchiveDialog title={`${moments[photo].date} / ${moments[photo].label}`} onClose={()=>setPhoto(null)}><img className="archive-full-photo" src={moments[photo].image} alt={moments[photo].alt}/><p className="photo-description">{moments[photo].description}</p><SourceLink href={moments[photo].source}>Відкрити оригінальну публікацію</SourceLink></ArchiveDialog>}
 </section>
}
