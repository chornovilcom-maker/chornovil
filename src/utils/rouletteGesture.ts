/** Let native page scrolling win for vertical or ambiguous touch gestures. */
export function rouletteIntent(dx:number,dy:number,touch:boolean):'pending'|'page'|'rotate'{
 if(Math.hypot(dx,dy)<10)return 'pending';
 if(!touch)return 'rotate';
 return Math.abs(dx)>Math.abs(dy)*1.4?'rotate':'page';
}
