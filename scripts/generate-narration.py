import asyncio,json,os,pathlib,re,sys
sys.path.insert(0,os.path.join(os.environ['TEMP'],'chornovil-tts-runtime'))
import edge_tts
root=pathlib.Path(__file__).resolve().parents[1]
s=(root/'src/components/HeaderHud.tsx').read_text(encoding='utf-8-sig')
m=re.search(r'const NARRATION:Record<string,string>=\{(.*?)\};',s,re.S)
entries=dict(re.findall(r"(\w+):'([^']*)'",m.group(1)))
t=(root/'src/components/TribuneSection.tsx').read_text(encoding='utf-8-sig')
for year,text in re.findall(r"year:'(\d+)',label:'[^']*',title:'[^']*',text:'([^']*)'",t):entries['tribune-'+year]=text
out=root/'public/audio';out.mkdir(exist_ok=True)
async def main():
 voices=await edge_tts.list_voices()
 names=[v['ShortName'] for v in voices if v['Locale']=='uk-UA']
 print('Ukrainian voices:',names,flush=True)
 voice=next((v for v in names if 'Ostap' in v),names[0])
 for key,text in entries.items():
  dest=out/(key+'.mp3')
  if dest.exists() and dest.stat().st_size>5000:continue
  await edge_tts.Communicate(text,voice,rate='-6%').save(str(dest))
  print(key,dest.stat().st_size,flush=True)
 (out/'manifest.json').write_text(json.dumps({'voice':voice,'kind':'synthetic-narration','tracks':entries},ensure_ascii=False,indent=2),encoding='utf-8')
asyncio.run(main())
