import {ArchiveInvitation} from './archive/ArchivePages';
import { JourneyNotebook } from './components/JourneyNotebook';
import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { HeaderHud } from './components/HeaderHud';
import { TimelineHud } from './components/TimelineHud';
import { HeroSection } from './components/HeroSection';
import { ProtestSection } from './components/ProtestSection';
import { KgbSection } from './components/KgbSection';
import { CampSection } from './components/CampSection';
import { TribuneSection } from './components/TribuneSection';
import { TragedyAndLegacySection } from './components/TragedyAndLegacySection';
export const App: React.FC = () => {
 const [activeSection,setActiveSection]=useState('hero');
 const [currentYear,setCurrentYear]=useState('1937');
 useEffect(()=>{
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const lenis=new Lenis({duration:.9,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)),orientation:'vertical',gestureOrientation:'vertical',smoothWheel:!reduced,wheelMultiplier:1});
 let animId:number;
 function raf(time:number){lenis.raf(time);animId=requestAnimationFrame(raf)}
 animId=requestAnimationFrame(raf);
 const handleScroll=()=>{const sections=[{id:'hero-scroll-container',year:'1937'},{id:'protest',year:'1965'},{id:'kgb',year:'1972'},{id:'camps',year:'1985'},{id:'tribune',year:'1991'},{id:'tragedy',year:'1999'},{id:'legacy',year:'2026'}];for(let i=sections.length-1;i>=0;i--){const el=document.getElementById(sections[i].id);if(el&&el.getBoundingClientRect().top<=innerHeight*.45){setActiveSection(sections[i].id==='hero-scroll-container'?'hero':sections[i].id);setCurrentYear(sections[i].year);break}}};
 window.addEventListener('scroll',handleScroll,{passive:true});handleScroll();
 return()=>{cancelAnimationFrame(animId);lenis.destroy();window.removeEventListener('scroll',handleScroll)};
 },[]);
 return <div className="relative min-h-screen bg-[#070709] text-[#F4F4F6] selection:bg-[#E6192E] selection:text-white"><div className="noise-overlay"/><div className="vignette-overlay"/>{[['top-2 left-2','⌜'],['top-2 right-2','⌝'],['bottom-2 left-2','⌞'],['bottom-2 right-2','⌟']].map(([position,symbol])=><div key={symbol} className={`fixed ${position} z-50 text-[#E6192E] text-xs font-mono font-bold pointer-events-none opacity-60`}>{symbol}</div>)}<HeaderHud activeSection={activeSection}/><TimelineHud currentYear={currentYear}/><JourneyNotebook activeSection={activeSection}/><main className="w-full"><HeroSection/><ProtestSection/><KgbSection/><CampSection/><TribuneSection/><ArchiveInvitation/><TragedyAndLegacySection/></main></div>;
};
