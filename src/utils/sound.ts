/** Silent interface. Narration starts only after an explicit play action. */
class SoundController {
 public isMuted=false;
 private current:SpeechSynthesisUtterance|null=null;
 private audio:HTMLAudioElement|null=null;
 private onFinished:(()=>void)|undefined;
 public toggleMute(){this.isMuted=!this.isMuted;if(this.isMuted)this.stopHistoricSpeech();return !this.isMuted}
 public playTypewriterKey(){}
 public playScannerBeep(){}
 public playStampThud(){}
 public playCrashImpact(){}
 public getAnalyser():AnalyserNode|null{return null}
 public getContext():AudioContext|null{return null}
 public playHistoricSpeech(text:string,onEnded?:()=>void,trackId?:string):boolean{
 this.stopHistoricSpeech();
 const report=(message:string)=>window.dispatchEvent(new CustomEvent('archive-audio-notice',{detail:message}));
 if(this.isMuted){report('Озвучення вимкнене. Увімкніть його кнопкою у верхньому куті.');onEnded?.();return false}
 if(trackId){
  const audio=new Audio('/audio/'+encodeURIComponent(trackId)+'.mp3');this.audio=audio;this.onFinished=onEnded;
  const finish=()=>{if(this.audio!==audio)return;this.audio=null;const callback=this.onFinished;this.onFinished=undefined;callback?.();window.dispatchEvent(new CustomEvent('archive-speech-state',{detail:false}))};
  audio.onended=finish;audio.onerror=()=>{report('Не вдалося завантажити аудіодоріжку. Перевірте з’єднання й спробуйте ще раз.');finish()};
  window.dispatchEvent(new CustomEvent('archive-speech-state',{detail:true}));
  audio.play().then(()=>{if(this.audio===audio)report('Український аудіопереказ. Синтезований голос оповідача, не голос Чорновола.')}).catch(()=>{if(this.audio===audio){report('Відтворення не почалося. Натисніть кнопку ще раз.');finish()}});return true;
 }
 if(!('speechSynthesis' in window)){report('Цей браузер не підтримує озвучення. Текст доступний на сторінці.');onEnded?.();return false}
 const voice=speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith('uk'));
 if(!voice){report('На пристрої немає українського голосу. Додайте його в системних налаштуваннях мовлення.');onEnded?.();return false}
 const utterance=new SpeechSynthesisUtterance(text.replace(/[«»]/g,''));this.current=utterance;this.onFinished=onEnded;
 utterance.voice=voice;utterance.lang='uk-UA';utterance.rate=.93;
 const finish=()=>{if(this.current!==utterance)return;this.current=null;const callback=this.onFinished;this.onFinished=undefined;callback?.();window.dispatchEvent(new CustomEvent('archive-speech-state',{detail:false}))};
 utterance.onend=finish;utterance.onerror=finish;speechSynthesis.speak(utterance);window.dispatchEvent(new CustomEvent('archive-speech-state',{detail:true}));report('Синтезоване українське озвучення. Це історичний переказ, а не голос Чорновола.');return true;
 }
 public getSpeechProgress(){return {current:this.audio?.currentTime||0,duration:Number.isFinite(this.audio?.duration)?this.audio!.duration:0}}
 public stopHistoricSpeech(){if(this.audio){this.audio.onended=null;this.audio.onerror=null;this.audio.pause();this.audio.currentTime=0;this.audio=null}this.current=null;const callback=this.onFinished;this.onFinished=undefined;if('speechSynthesis'in window)speechSynthesis.cancel();callback?.();window.dispatchEvent(new CustomEvent('archive-speech-state',{detail:false}))}
}
export const sound=new SoundController();
