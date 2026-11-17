const $=id=>document.getElementById(id);
const canvas=$("world"), ctx=canvas.getContext("2d"), modal=$("modal");
const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const clamp=(n,low,high)=>Math.min(high,Math.max(n,low));
const escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const coord=([lat,lon])=>[(lon-city.west)*city.lonScale,(city.north-lat)*city.latScale];
const geographic=([x,y])=>[city.north-y/city.latScale,city.west+x/city.lonScale];
const normalize=text=>text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9 ]/g," ").replace(/\s+/g," ").trim();
const cacheKey="mondovi-open-city-v2";
let saved={done:{},phrases:{},drafts:{},ticket:false,visited:{}};
try{Object.assign(saved,JSON.parse(localStorage.getItem(cacheKey))||{});}catch{}
function persist(){try{localStorage.setItem(cacheKey,JSON.stringify(saved));}catch{}}
const places=new Map(city.places.map(p=>[p[0],p]));
const bounds=points=>points.reduce(([l,t,r,b],[x,y])=>[Math.min(x,l),Math.min(y,t),Math.max(x,r),Math.max(y,b)],[Infinity,Infinity,-Infinity,-Infinity]);
const buildings=city.buildings.map(([kind,points])=>({kind,points,box:bounds(points)}));
const areas=city.areas.map(([kind,points,name])=>({kind,points,name,box:bounds(points)}));
function nearestOn(p,a,b){
 const dx=b[0]-a[0],dy=b[1]-a[1];
 const t=clamp(((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy||1),0,1);
 return [a[0]+t*dx,a[1]+t*dy];
}
function polygonContains(p,polygon){
 let inside=false;
 for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
  const [x,y]=polygon[i],[a,b]=polygon[j];
  if((y>p[1])!==(b>p[1])&&p[0]<(a-x)*(p[1]-y)/(b-y)+x)inside=!inside;
 }
 return inside;
}
function segments(features){
 return features.flatMap(([name,kind,points,bridge,tunnel,motor])=>points.slice(1).map((b,i)=>({
  a:points[i],b,name,kind,bridge,tunnel,motor
 })));
}
const streets=segments(city.roads), water=segments(city.rivers);
const cell=32;
function spatial(items,getBox,pad){
 const grid=new Map();
 for(const item of items){
  const [l,t,r,b]=getBox(item);
  for(let y=Math.max(-1,Math.floor((t-pad)/cell));y<=Math.min(Math.ceil(city.height/cell),Math.floor((b+pad)/cell));y++){
   for(let x=Math.max(-1,Math.floor((l-pad)/cell));x<=Math.min(Math.ceil(city.width/cell),Math.floor((r+pad)/cell));x++){
    const key=x+","+y;
    if(!grid.has(key))grid.set(key,[]);
    grid.get(key).push(item);
   }
  }
 }
 return ([x,y])=>grid.get(Math.floor(x/cell)+","+Math.floor(y/cell))||[];
}
const nearStreets=spatial(streets,s=>bounds([s.a,s.b]),24);
const nearWater=spatial(water,s=>bounds([s.a,s.b]),18);
const nearBuildings=spatial(buildings,b=>b.box,0);
const nearAreas=spatial(areas.filter(a=>a.kind==="plaza"),a=>a.box,0);
const roadWidth=kind=>({primary:13,secondary:12,tertiary:10,residential:8.5,pedestrian:9,unclassified:8.5,service:5,footway:3.6,path:3.3,steps:3.5,track:4,cycleway:3.5}[kind]||3.3);
function canWalk(p){
 const [x,y]=p;
 if(x<2||y<2||x>city.width-2||y>city.height-2)return false;
 const roads=nearStreets(p);
 const passage=roads.some(s=>s.tunnel&&distance(p,nearestOn(p,s.a,s.b))<2.5);
 if(!passage&&nearBuildings(p).some(b=>b.kind!=="roof"&&polygonContains(p,b.points)))return false;
 if(nearWater(p).some(s=>distance(p,nearestOn(p,s.a,s.b))<(s.kind==="river"?6:2))){
  return roads.some(s=>s.bridge&&distance(p,nearestOn(p,s.a,s.b))<Math.max(2,roadWidth(s.kind)/2));
 }
 return true;
}
function closestStreet(p,roads=nearStreets(p)){
 let best=null,r=Infinity;
 for(const segment of roads){
  const point=nearestOn(p,segment.a,segment.b),d=distance(p,point);
  if(d<r){r=d;best={segment,point,d};}
 }
 return best;
}
function arrival(point){
 const options=nearStreets(point).map(s=>nearestOn(point,s.a,s.b)).filter(canWalk).sort((a,b)=>distance(point,a)-distance(point,b));
 if(options.length)return options[0];
 for(let r=0;r<30;r+=2){
  for(let step=0;step<8;step++){
   const angle=step*Math.PI/4,p=[point[0]+r*Math.cos(angle),point[1]+r*Math.sin(angle)];
   if(canWalk(p))return p;
  }
 }
 return city.stations.Breo;
}
const actors=encounters.flatMap(encounter=>{
 const place=places.get(encounter.place);
 const real=encounter.station?city.stations[encounter.station]:encounter.landmark?coord(encounter.landmark):place?.[3];
 if(!real)return [];
 const offset=encounter.id==="mediation"?[real[0]+9,real[1]+6]:real;
 return [{...encounter,site:place?.[1]||encounter.label||"Funicolare · "+encounter.station,point:arrival(offset)}];
});
const boarding=Object.entries(city.stations).map(([name,p])=>({
 name,point:name==="Breo"?breoBoardingPoint(p):arrival(p)
}));
function breoBoardingPoint(p){
 const clerk=actors.find(actor=>actor.id==="station").point;
 const candidates=nearStreets(p).flatMap(segment=>[segment.a,segment.b]);
 return candidates.filter(point=>canWalk(point)&&distance(point,clerk)>12)
  .sort((a,b)=>distance(a,p)-distance(b,p))[0]||arrival(p);
}
const spawn=arrival(places.get("1916401476")[3]);
const oldPosition=Array.isArray(saved.position)?saved.position:null;
const restored=Array.isArray(saved.geoPosition)?coord(saved.geoPosition):oldPosition?coord([44.393-oldPosition[1]*.0062/689,7.8175+oldPosition[0]*.0135/1074]):null;
let player=restored?.every(Number.isFinite)&&canWalk(restored)?restored:restored?.every(Number.isFinite)?arrival(restored):spawn;
let lastSavedPoint=player;
let pin=null,trip=null, active=null,turn=0,previous=0,lastPersist=0,priorLabel="";
const keys=new Set();
const zoom=2.68;
const parkColor={forest:"#71865e",grass:"#a5aa7d",meadow:"#a8ad81",orchard:"#899467",farmland:"#b2a47b",plaza:"#d7c5a4"};
function savePosition(){
 saved.geoPosition=geographic(player);delete saved.position;persist();
}
function trace(context,points,close=false,offset=0){
 context.beginPath();
 points.forEach(([x,y],i)=>i?context.lineTo(x+offset,y+offset):context.moveTo(x+offset,y+offset));
 if(close)context.closePath();
}
function poly(context,points,color,offset=0){
 trace(context,points,true,offset);context.fillStyle=color;context.fill();
}
function stroke(context,points,color,width){
 trace(context,points);context.lineJoin="round";context.lineCap="round";context.strokeStyle=color;context.lineWidth=width;context.stroke();
}
let seed=7841;
function random(){seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;}
const trafficEdges=[],junctions=new Map();
function addLane(a,b,kind,tunnel,both){
 const length=distance(a,b);
 if(length<.1)return;
 const exit=b.join(","),start=a.join(",");
 const lane={a,b,length,exit,start,kind,tunnel,both};
 trafficEdges.push(lane);
 if(!junctions.has(start))junctions.set(start,[]);
 junctions.get(start).push(lane);
}
for(const [,kind,points,,tunnel,direction] of city.roads){
 if(!direction)continue;
 for(let i=1;i<points.length;i++){
  if(direction>0)addLane(points[i-1],points[i],kind,tunnel,direction===2);
  if(direction!==1)addLane(points[i],points[i-1],kind,tunnel,direction===2);
 }
}
const inCityEdges=trafficEdges.filter(lane=>lane.a[0]>0&&lane.a[0]<city.width&&lane.a[1]>0&&lane.a[1]<city.height);
const trafficColors=["#a04d3b","#556f77","#e2d6b7","#55544b","#71815e","#b18a54"];
const localLanes=inCityEdges.filter(lane=>distance(lane.a,spawn)<135&&lane.length>4);
const pick=list=>list[Math.floor(random()*list.length)];
const cars=Array.from({length:150},(_,i)=>{
 const lane=pick(i<8&&localLanes.length?localLanes:inCityEdges);
 return {lane,offset:random()*lane.length,speed:8+random()*8,color:trafficColors[i%trafficColors.length]};
});
function updateTraffic(dt){
 for(const car of cars){
  car.offset+=car.speed*dt;
  while(car.offset>=car.lane.length){
   car.offset-=car.lane.length;
   const exits=junctions.get(car.lane.exit)||[];
   const forward=exits.filter(lane=>lane.exit!==car.lane.start);
   car.lane=pick(forward.length?forward:exits.length?exits:inCityEdges);
  }
 }
}
function carPose(car){
 const {a,b,length,both}=car.lane;
 const dx=(b[0]-a[0])/length,dy=(b[1]-a[1])/length,offset=both?roadWidth(car.lane.kind)*.22:0;
 return {x:a[0]+dx*car.offset-dy*offset,y:a[1]+dy*car.offset+dx*offset,angle:Math.atan2(dy,dx)};
}
function drawTraffic(screen){
 for(const car of cars){
  if(car.lane.tunnel)continue;
  const {x,y,angle}=carPose(car),[sx,sy]=screen([x,y]);
  if(sx<-12||sy<-12||sx>canvas.width+12||sy>canvas.height+12)continue;
  ctx.save();ctx.translate(Math.round(sx),Math.round(sy));ctx.rotate(angle);
  ctx.fillStyle="#423c31a0";ctx.fillRect(-7,-3,14,7);
  ctx.fillStyle=car.color;ctx.fillRect(-6,-3,12,6);
  ctx.fillStyle="#344d54";ctx.fillRect(-3,-2,2,4);ctx.fillRect(2,-2,2,4);
  ctx.fillStyle="#f2dda5";ctx.fillRect(5,-2,1,1);ctx.fillRect(5,1,1,1);
  ctx.restore();
 }
}
const terrain=document.createElement("canvas");
const raster=1.5;
terrain.width=Math.ceil(city.width*raster);terrain.height=Math.ceil(city.height*raster);
function renderTerrain(){
 const g=terrain.getContext("2d");
 g.scale(raster,raster);
 g.fillStyle="#9a9f73";g.fillRect(0,0,city.width,city.height);
 areas.forEach(a=>poly(g,a.points,parkColor[a.kind]));
 for(let i=0;i<135000;i++){
  const x=random()*city.width,y=random()*city.height;
  g.fillStyle=i%2?"#d6c39545":"#52674732";g.fillRect(x,y,1+random()*2,.45);
 }
 for(let i=0;i<28000;i++){
  const p=[random()*city.width,random()*city.height];
  if(closestStreet(p)?.d<7||nearBuildings(p).length||nearWater(p).length||nearAreas(p).length)continue;
  if(i%3&&nearStreets(p).length)continue;
  const [x,y]=p;
  g.fillStyle="#3d63455c";g.fillRect(x-2,y,6,3);
  g.fillStyle=i%3?"#608456":"#6b8b57";g.fillRect(x-2,y-4,4,5);
  g.fillStyle="#91aa68";g.fillRect(x-1,y-4,2,1);
 }
 city.rivers.forEach(([,kind,p])=>{
  const w=kind==="river"?14:5;
  stroke(g,p,"#9aac8a",w+3);stroke(g,p,"#508891",w);stroke(g,p,"#75a5a3",w-2);
 });
 for(const track of city.trainTracks||[]){
  stroke(g,track,"#8d806b",4.8);stroke(g,track,"#504b43",1.9);
  g.setLineDash([.7,2]);stroke(g,track,"#b4a386",2.8);g.setLineDash([]);
 }
 const ordered=[...city.roads].sort((a,b)=>Number(a[3])-Number(b[3])||roadWidth(a[1])-roadWidth(b[1]));
 ordered.forEach(([,kind,p,bridge,tunnel,motor])=>{
  const w=roadWidth(kind);
  stroke(g,p,bridge?"#8a7967":"#ad9b7d",w+1.6);
  stroke(g,p,tunnel?"#b0a18b":motor?"#bfb29a":"#d8c7a8",w);
  if(kind==="steps"){
   g.setLineDash([.4,1.2]);stroke(g,p,"#9a8665",w-.5);g.setLineDash([]);
  }
 });
 ordered.forEach(([,kind,p,,tunnel,motor])=>{
  if(motor!==2||tunnel||roadWidth(kind)<10)return;
  g.setLineDash([2.5,3.3]);stroke(g,p,"#ebdec3",.45);g.setLineDash([]);
 });
 city.rails.forEach(p=>{stroke(g,p,"#706454",3);stroke(g,p,"#e0c399",.8);});
 const colors=["#b66e52","#c38464","#a2634f","#b9795c","#ae8e77","#c48a6b","#8b7d72"];
 buildings.forEach(({kind,points,box},i)=>{
  const [l,t,r,b]=box;
  const landmark=["church","cathedral","chapel","train_station"].includes(kind);
  const depth=landmark?3.3:1.8;
  poly(g,points,"#473d3b62",depth+1.3);
  for(let j=1;j<points.length;j++){
   const a=points[j-1],p=points[j];
   poly(g,[a,p,[p[0]+depth,p[1]+depth],[a[0]+depth,a[1]+depth]],p[1]>a[1]?"#876955":"#ae8a69");
  }
  poly(g,points,["church","cathedral","chapel"].includes(kind)?"#9c8880":colors[i%colors.length]);
  g.save();trace(g,points,true);g.clip();
  const wide=r-l>b-t,axis=wide?(t+b)/2:(l+r)/2;
  g.fillStyle="#f4c7a04b";g.fillRect(l,t,wide?r-l:axis-l,wide?axis-t:b-t);
  g.fillStyle="#5f3d4029";g.fillRect(wide?l:axis,wide?axis:t,wide?r-l:r-axis,wide?b-axis:b-t);
  stroke(g,wide?[[l,axis],[r,axis]]:[[axis,t],[axis,b]],"#ecd2aa88",.65);
  g.fillStyle="#704b3c3d";
  for(let row=t+2;row<b;row+=2.5)g.fillRect(l,row,r-l,.33);
  g.restore();
  trace(g,points,true);g.strokeStyle="#725347";g.lineWidth=.55;g.stroke();
 });
}
function pixelPerson(context,x,y,color,moving,time,hero=false){
 const step=moving?Math.floor(time/100)%2:0;
 const size=.73;
 const rect=(dx,dy,w,h,c)=>{context.fillStyle=c;context.fillRect(Math.round(x+dx*size),Math.round(y+dy*size),Math.max(1,Math.round(w*size)),Math.max(1,Math.round(h*size)));};
 rect(-6,0,13,3,"#263b3750");rect(-5,-4-step,4,6,"#303b43");rect(1,-4+step,4,6,"#303b43");
 rect(-6,-12,12,9,color);rect(-8,-11,3,6,color);rect(5,-11,3,6,color);
 rect(-5,-21,10,10,"#563b32");rect(-4,-17,8,5,"#e7ae7e");
 if(hero){rect(-6,-22,12,5,"#a33f33");rect(1,-19,7,2,"#bb6349");rect(-5,-11,3,7,"#ebbd62");}
}
function marker(context,x,y,text,fill){
 context.font="bold 10px monospace";context.textAlign="center";
 context.fillStyle=fill;context.fillRect(Math.round(x)-7,Math.round(y)-14,14,13);
 context.fillStyle="#283b32";context.fillText(text,Math.round(x),Math.round(y)-4);
}
function draw(time,moving){
 const viewW=canvas.width/zoom,viewH=canvas.height/zoom;
 const left=clamp(player[0]-viewW/2,0,city.width-viewW),top=clamp(player[1]-viewH/2,0,city.height-viewH);
 const screen=([x,y])=>[(x-left)*zoom,(y-top)*zoom];
 ctx.imageSmoothingEnabled=false;
 ctx.drawImage(terrain,left*raster,top*raster,viewW*raster,viewH*raster,0,0,canvas.width,canvas.height);
 if(navigationRoute) {
  ctx.save();ctx.beginPath();ctx.rect(0,0,canvas.width,canvas.height);ctx.clip();
  const route=navigationRoute.map(screen);
  stroke(ctx,route,"#272e38aa",5);stroke(ctx,route,driven?"#6eaec7":"#eac369",2.4);ctx.restore();
 }
 drawTraffic(screen);
 drawPlayerVehicle(screen);
 city.places.forEach(([id,name,,p])=>{
  if(!name)return;
  const [x,y]=screen(p);
  if(x<-10||y<-10||x>canvas.width+10||y>canvas.height+10)return;
  ctx.fillStyle="#785842";ctx.fillRect(Math.round(x)-2,Math.round(y)-2,5,5);
  ctx.fillStyle="#e5b97b";ctx.fillRect(Math.round(x)-1,Math.round(y)-1,3,3);
  if(city.featured[id]&&distance(player,p)<48){
   const label=id==="11646092315"?"MORO CAFÈ":id==="7123095496"?"CAFFÈ ARAGNO":"DON ALFÒ";
   const w=label.length*6+8;
   ctx.fillStyle="#f2e1bd";ctx.fillRect(Math.round(x-w/2),Math.round(y-25),w,13);
   ctx.fillStyle="#624535";ctx.font="bold 9px monospace";ctx.textAlign="center";ctx.fillText(label,x,y-16);
  }
 });
 boarding.forEach(({point})=>{const [x,y]=screen(point);marker(ctx,x,y-3,"F","#cfdfcc");});
 if(pin){
  const [a,b]=screen(pin.point),x=clamp(a,19,canvas.width-19),y=clamp(b,45,canvas.height-33);
  ctx.fillStyle="#9e463a";ctx.fillRect(x-2,y-15,4,17);
  ctx.fillStyle="#f3d276";ctx.fillRect(x+2,y-15,11,7);
 }
 const entities=[...actors,...pedestrians.map(p=>({...p,ambient:true})),...(driven?[]:[{point:player,color:"#497588",hero:true}])].sort((a,b)=>a.point[1]-b.point[1]);
 entities.forEach(actor=>{
  const [x,y]=screen(actor.point);
  if(x<-30||y<-30||x>canvas.width+30||y>canvas.height+30)return;
  pixelPerson(ctx,x,y,actor.color,actor.ambient||actor.hero&&moving,time,actor.hero);
  if(!actor.hero&&!actor.ambient){
   const target=tracked?.steps[missionStep(tracked)]?.[0]===actor.id;
   marker(ctx,x,y-17+Math.round(Math.sin(time/250)*1.5),target?"★":saved.done[actor.id]?"✓":"!",target?"#ffca68":"#f5de97");
  }
 });
 if(trip){
  ctx.fillStyle="#25392de6";ctx.fillRect(0,0,canvas.width,canvas.height);
  const f=clamp((time-trip.started)/2400,0,1), fraction=trip.from==="Breo"?f:1-f;
  stroke(ctx,[[95,295],[518,100]],"#b1a083",5);
  const x=95+423*fraction,y=295-195*fraction;
  ctx.fillStyle="#aa5141";ctx.fillRect(x-17,y-22,34,23);
  ctx.fillStyle="#f0c57b";ctx.fillRect(x-12,y-17,24,9);
  ctx.fillStyle="#f7ecd2";ctx.font="20px Georgia";ctx.textAlign="center";ctx.fillText("Funicolare di Mondovì",310,61);
  ctx.font="12px monospace";ctx.fillText("BREO",95,323);ctx.fillText("PIAZZA",518,78);
 }
}
function nearby(){
 if(driven)return {driving:true};
 const target=actor=>distance(player,actor.point);
 const residents=actors.filter(a=>target(a)<=12).sort((a,b)=>target(a)-target(b));
 const station=boarding.filter(a=>target(a)<=11).sort((a,b)=>target(a)-target(b))[0];
 if(station&&saved.ticket&&(!residents[0]||target(station)<target(residents[0])))return {station};
 if(residents.length)return {actor:residents[0]};
 if(station)return {station};
 const place=city.places.filter(([,name,,point])=>name&&distance(player,point)<=9).sort((a,b)=>distance(player,a[3])-distance(player,b[3]))[0];
 if(place)return {place};
 if(nearVehicle())return {vehicle:true};
 return nearestPedestrian()?{pedestrian:true}:null;
}
function tick(time){
 const dt=Math.min(.033,(time-(previous||time))/1000);
 previous=time;
 let moving=false;
 if(trip&&time-trip.started>=2400){
  player=trip.destination.point;trip=null;savePosition();
 }
 if(!modal.open&&!trip){
  const pressed=(arrow,letter)=>Number(keys.has(arrow)||keys.has(letter));
  const dx=pressed("ArrowRight","d")-pressed("ArrowLeft","a"),dy=pressed("ArrowDown","s")-pressed("ArrowUp","w");
  if(dx||dy){
   const step=(driven?115:38)*dt/Math.hypot(dx,dy);
   const allowed=driven?driveable:canWalk;
   const horizontal=[player[0]+dx*step,player[1]];
   if(dx&&allowed(horizontal)){player=horizontal;moving=true;}
   const vertical=[player[0],player[1]+dy*step];
   if(dy&&allowed(vertical)){player=vertical;moving=true;}
   if(driven&&moving)driveAngle=Math.atan2(dy,dx);
  }
 }
 updateTraffic(dt);
 updatePedestrians(dt);refreshRoute(time);
 if(time-lastPersist>900&&lastSavedPoint!==player){savePosition();lastSavedPoint=player;lastPersist=time;}
 const near=trip?null:nearby(), button=$("near");
 button.hidden=!near||modal.open;
 if(near){
  const text=near.actor?"E · Falar com "+near.actor.name:near.station?"E · Funicolare / "+near.station.name:near.place?"E · "+near.place[1]:
   near.driving?"V · Estacionar":near.vehicle?"V · Pegar o carro":"E · Pedir informações";
  if(button.textContent!==text)button.textContent=text;
 }
 const plaza=nearAreas(player).find(a=>a.name&&polygonContains(player,a.points));
 const street=closestStreet(player,nearStreets(player).filter(s=>s.name));
 const [lat,lon]=geographic(player);
 const district=lon<7.819&&lat>44.389?"Altipiano":lon>7.827?"Piazza":"Breo";
 const label=plaza?.name||(street&&street.d<16?street.segment.name:"Mondovì · "+district);
 if(label!==priorLabel){$("location").textContent=label;priorLabel=label;}
 if(pin)$("navigation").textContent=pin.name+" · "+(distance(player,pin.point)<12?"Você chegou":remainingDistance());
 draw(time,moving);
 requestAnimationFrame(tick);
}
function modalHeader(label,title){
 return '<div class="modalHead"><div><span class="kicker">'+escapeHtml(label)+'</span><h2 id="modalTitle">'+escapeHtml(title)+'</h2></div><button id="closeModal" aria-label="Fechar">×</button></div>';
}
function open(label,title,body){
 keys.clear();modal.innerHTML=modalHeader(label,title)+body;
 $("closeModal").onclick=()=>modal.close();
 if(!modal.open)modal.showModal();
 $("closeModal").focus();
}
function speak(text){
 if(!("speechSynthesis" in window))return;
 speechSynthesis.cancel();
 const utterance=new SpeechSynthesisUtterance(text);
 utterance.lang="it-IT";utterance.rate=.91;
 const voice=speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith("it"));
 if(voice)utterance.voice=voice;
 speechSynthesis.speak(utterance);
}
function toggle(button,panel){
 button.onclick=()=>{panel.hidden=!panel.hidden;button.setAttribute("aria-expanded",String(!panel.hidden));};
}
function setPin(point,name){
 pin=point?{point,name}:null;
 refreshRoute(previous,true);
 $("clearPin").hidden=!pin;
 if(!pin)$("navigation").textContent="Marque um destino no mapa ou ande até um balão de conversa.";
}
function updateSidebar(){
 $("progress").textContent=Object.keys(saved.done).length+" de "+actors.length+" situações praticadas nesta versão.";
 $("visits").replaceChildren(...actors.map(actor=>{
  const button=document.createElement("button");
  button.textContent=(saved.done[actor.id]?"✓ ":"")+actor.level+" · "+actor.title;
  button.onclick=()=>setPin(actor.point,actor.site+" / "+actor.name);
  return button;
 }));
}
function interact(){
 if(modal.open||trip)return;
 const near=nearby();
 if(!near){open("Esplorazione","Quem está por perto?",'<p>Aproxime-se de um personagem, um comércio marcado ou uma estação para interagir.</p>');return;}
 if(near.actor){conversationMenu(near.actor);return;}
 if(near.vehicle||near.driving){vehicleAction();return;}
 if(near.pedestrian){pedestrianTalk();return;}
 if(near.station){
  if(!saved.ticket){
   const giulia=actors.find(a=>a.id==="station");
   open("Funicolare",near.station.name,'<p>Fale com Giulia na bilheteria de Breo. Você também pode seguir pelas ruas e escadarias a pé.</p><button id="findTicket">Marcar a bilheteria</button>');
   $("findTicket").onclick=()=>{setPin(giulia.point,giulia.site);modal.close();};
  }else{
   const destination=boarding.find(b=>b.name!==near.station.name);
   open("Funicolare",near.station.name,'<p lang="it">Prossima fermata: '+escapeHtml(destination.name)+'.</p><button class="primary" id="board">Embarcar</button>');
   $("board").onclick=()=>{modal.close();trip={from:near.station.name,destination,started:previous};};
  }
  return;
 }
 const [id,name,kind,point]=near.place;
 saved.visited[id]=true;persist();
 const resident=actors.find(actor=>actor.place===id);
 const details=city.featured[id];
 open(typeNames[kind]||"Local mapeado",name,(details?'<p>'+escapeHtml(details[0])+'</p><p><a target="_blank" rel="noopener" href="'+details[1]+'">Fonte do endereço ↗</a></p>':'<p>Você está neste local do mapa.</p>')+(resident?'<button id="findResident">Marcar '+escapeHtml(resident.name)+'</button>':'')+
  '<p><a target="_blank" rel="noopener" href="'+osmLink(point)+'">Ver no OpenStreetMap ↗</a></p>');
 if(resident)$("findResident").onclick=()=>{setPin(resident.point,resident.name);modal.close();};
}
function startEncounter(actor){
 active=actor;turn=0;
 if(actor.brief){mediation();return;}
 renderTurn();
}
function renderTurn(){
 const t=active.turns[turn];
 open(active.site+" · "+active.level,active.name,
  '<p class="utterance" lang="it">'+escapeHtml(t.line)+'</p><div class="row"><button id="listen">♪ Ouvir</button><button id="showHint" aria-expanded="false">Pista</button><button id="showChoices" aria-expanded="'+(active.level==="A1")+'">Respostas sugeridas</button></div>'+
  '<p class="note" id="hint" hidden>'+escapeHtml(t.hint)+'</p><div class="choices" id="choices" '+(active.level==="A1"?"":"hidden style='display:none'")+'></div>'+
  '<form id="answerForm"><label for="answer">Responda em italiano</label><textarea id="answer" lang="it" required></textarea><button class="primary">Responder</button></form><p class="note" id="reaction" role="status" hidden></p>');
 $("listen").onclick=()=>speak(t.line);toggle($("showHint"),$("hint"));
 const choices=$("choices");
 $("showChoices").onclick=()=>{
  choices.hidden=!choices.hidden;choices.style.display=choices.hidden?"none":"grid";
  $("showChoices").setAttribute("aria-expanded",String(!choices.hidden));
 };
 t.replies.forEach((reply,i)=>{
  const button=document.createElement("button");button.lang="it";button.textContent=reply;
  button.onclick=()=>i===t.answer?finishTurn(t):retry(t);
  choices.append(button);
 });
 $("answerForm").onsubmit=e=>{
  e.preventDefault();
  const original=$("answer").value.trim(), typed=normalize(original);
  if(!typed)return;
  const exact=t.replies.findIndex(reply=>normalize(reply)===typed);
  if(exact>=0){if(exact===t.answer)finishTurn(t);else retry(t);return;}
  if(t.accept){
   if(t.accept.test(typed))finishTurn(t);
   else retry(t,true);
   return;
  }
  finishTurn(t,original);
 };
}
function retry(t,typed=false){
 const p=$("reaction");p.hidden=false;
 p.textContent=t.retry+(typed?" Tente outra formulação ou abra as respostas sugeridas.":" "+t.feedback);
}
function remember([it,pt]){
 saved.phrases[it] ||= {pt,due:Date.now()+60000,stage:0};
}
function finishTurn(t,original=""){
 const finalTurn=turn+1===active.turns.length;
 let nextMission="";
 remember(t.memory);
 if(finalTurn){
  saved.done[active.id]=original?"comparação com modelo":"diálogo";
  if(active.id==="station")saved.ticket=true;
  nextMission=advanceMission(active.id);
 }
 persist();updateSidebar();
 open(active.site+" · "+active.level,active.name,
  (original?'<p><strong>Sua resposta</strong></p><p lang="it">'+escapeHtml(original)+'</p><p><strong>Uma resposta possível</strong></p><p lang="it">'+escapeHtml(t.replies[t.answer])+'</p><p class="small">Compare a intenção e o registro. Esta resposta aberta foi registrada para revisão, sem correção automática.</p>':'')+
  '<p class="utterance" lang="it">'+escapeHtml(t.reply)+'</p><p class="note">'+escapeHtml(t.feedback)+'</p>'+nextMission+
  '<div class="row"><button id="listen">♪ Ouvir</button><button class="primary" id="advance">'+(finalTurn?"Voltar à rua":"Continuar")+'</button></div>');
 $("listen").onclick=()=>speak(t.reply);
 $("advance").onclick=()=>{if(finalTurn)modal.close();else{turn++;renderTurn();}};
}
function mediation(){
 const a=active;
 open(a.site+" · C1",a.title,'<p>'+escapeHtml(a.brief)+'</p>'+
  a.voices.map(([name,line],i)=>'<p><strong>'+escapeHtml(name)+'</strong> <button data-voice="'+i+'">♪ Ouvir</button></p>'+
   (a.audioFirst?'<details><summary>Ver transcrição</summary><p lang="it">'+escapeHtml(line)+'</p></details>':'<p lang="it">'+escapeHtml(line)+'</p>')).join("")+
  '<form id="writing"><label for="draft">Sua mensagem em italiano</label><textarea id="draft" lang="it" rows="5" required>'+escapeHtml(saved.drafts[a.id]||"")+'</textarea><div class="row"><button type="button" id="saveDraft">Salvar rascunho</button><button class="primary">Comparar com modelo</button></div><p class="small" id="draftStatus" role="status"></p></form>');
 modal.querySelectorAll("[data-voice]").forEach(button=>button.onclick=()=>speak(a.voices[button.dataset.voice][1]));
 $("saveDraft").onclick=()=>{saved.drafts[a.id]=$("draft").value;persist();$("draftStatus").textContent="Rascunho salvo."};
 $("writing").onsubmit=e=>{
  e.preventDefault();
  const draft=$("draft").value.trim();if(!draft)return;
  saved.drafts[a.id]=draft;saved.done[a.id]="comparação com modelo";const nextMission=advanceMission(a.id);persist();updateSidebar();
  open(a.site+" · C1","Releia sua síntese",
   '<h3>Sua mensagem</h3><p lang="it" style="white-space:pre-wrap">'+escapeHtml(draft)+'</p><h3>Uma versão possível</h3><p lang="it">'+escapeHtml(a.model)+'</p><button id="listen">♪ Ouvir o modelo</button>'+
   '<p>Use estes critérios para revisar seu texto:</p><ul>'+a.criteria.map(item=>"<li>"+escapeHtml(item)+"</li>").join("")+'</ul>'+nextMission+'<button class="primary" id="rewrite">Revisar minha mensagem</button>');
  $("listen").onclick=()=>speak(a.model);$("rewrite").onclick=mediation;
 };
}
const typeNames={cafe:"Café",bar:"Bar",restaurant:"Restaurante",pharmacy:"Farmácia",marketplace:"Mercado",books:"Livraria",museum:"Museu",clothes:"Roupas",butcher:"Açougue",bank:"Banco",hotel:"Hotel",guest_house:"Hospedagem",theatre:"Teatro",townhall:"Prefeitura",supermarket:"Supermercado",pastry:"Confeitaria"};
function osmLink([x,y]){
 const [lat,lon]=geographic([x,y]).map(number=>number.toFixed(6));
 return "https://www.openstreetmap.org/?mlat="+lat+"&mlon="+lon+"#map=19/"+lat+"/"+lon;
}
const mapItems=new Map();
city.roads.forEach(([name,,points])=>{
 if(name&&!mapItems.has("street:"+name)){
  const p=points[Math.floor(points.length/2)];
  if(p[0]>=0&&p[0]<=city.width&&p[1]>=0&&p[1]<=city.height)mapItems.set("street:"+name,{name,kind:"Rua",point:p});
 }
});
areas.filter(a=>a.kind==="plaza"&&a.name).forEach(a=>{
 const [l,t,r,b]=a.box;mapItems.set("street:"+a.name,{name:a.name,kind:"Praça",point:[(l+r)/2,(t+b)/2]});
});
city.places.forEach(([id,name,kind,point])=>{if(name)mapItems.set(id,{name,kind:typeNames[kind]||kind,point,address:city.featured[id]?.[0]});});
boarding.forEach(({name,point})=>mapItems.set("station-"+name,{name:"Funicolare · "+name,kind:"Estação",point}));
const altipiano=actors.find(actor=>actor.id==="altipiano");
mapItems.set("altipiano",{name:altipiano.site,kind:"Estação ferroviária",point:altipiano.point});
const collator=new Intl.Collator("it");
const directory=[...mapItems.values()].sort((a,b)=>collator.compare(a.name,b.name));
function mapDialog(){
 open("Cartografia · OpenStreetMap","Mapa de Mondovì",
  '<label for="mapSearch">Buscar rua, praça ou comércio mapeado</label><input type="search" id="mapSearch" placeholder="Via Sant’Agostino, libreria, Piazza…">'+
  '<div class="row" style="margin-top:8px"><button id="zoomIn" aria-label="Aproximar mapa">+</button><button id="zoomOut" aria-label="Afastar mapa">−</button><button id="centerMap">Minha posição</button><button id="resetMap">Mapa inteiro</button></div>'+
  '<canvas width="620" height="'+Math.round(620*city.height/city.width)+'" id="overview" class="mapCanvas" aria-label="Mapa de Altipiano, Breo e Piazza. Use a busca para navegar pelo teclado."></canvas>'+
  '<p id="mapLegend" class="small">Azul = você · Vermelho = personagem · Verde = veículo. Arraste para mover o mapa ou clique para marcar um destino.</p><div class="results" id="results" aria-label="Locais mapeados"></div>');
 const overview=$("overview"),g=overview.getContext("2d");
 const sx=overview.width/city.width,sy=overview.height/city.height;
 let scale=1,left=0,top=0,drag=null;
 const project=([x,y])=>[(x-left)*sx*scale,(y-top)*sy*scale];
 const viewPoint=([x,y])=>[left+x/(sx*scale),top+y/(sy*scale)];
 function constrain(){
  left=clamp(left,0,city.width*(1-1/scale));top=clamp(top,0,city.height*(1-1/scale));
 }
 const dot=(p,color,radius)=>{
  const [x,y]=project(p);
  if(x<-8||y<-8||x>overview.width+8||y>overview.height+8)return;
  g.beginPath();g.arc(x,y,radius,0,Math.PI*2);g.fillStyle=color;g.fill();
  g.strokeStyle="#fff0c7";g.lineWidth=1;g.stroke();
 };
 function drawMap(){
  g.drawImage(terrain,left*raster,top*raster,city.width*raster/scale,city.height*raster/scale,0,0,overview.width,overview.height);
  if(navigationRoute){
   const route=navigationRoute.map(project);
   stroke(g,route,"#5a462c",4.3);stroke(g,route,driven?"#7fc4dd":"#f6d06e",2.6);
  }
  city.places.forEach(([,name,,p])=>{if(name)dot(p,"#8c604c",2);});
  actors.forEach(a=>dot(a.point,"#a34335",4));
  parked.forEach(v=>{if(v!==driven)dot(v.point,"#35694d",4);});
  dot(player,"#203a5b",5);if(pin)dot(pin.point,"#e7a63a",6);
 }
 const center=[overview.width/2,overview.height/2];
 function zoomMap(factor,at=center){
  const anchor=viewPoint(at);scale=clamp(scale*factor,1,9);
  left=anchor[0]-at[0]/(sx*scale);top=anchor[1]-at[1]/(sy*scale);constrain();drawMap();
 }
 function centerMap(point,zoom){
  scale=zoom;left=point[0]-city.width/scale/2;top=point[1]-city.height/scale/2;constrain();drawMap();
 }
 const localPoint=e=>{
  const box=overview.getBoundingClientRect();
  return [(e.clientX-box.left)*overview.width/box.width,(e.clientY-box.top)*overview.height/box.height];
 };
 overview.addEventListener("wheel",e=>{e.preventDefault();zoomMap(e.deltaY<0?1.3:1/1.3,localPoint(e));},{passive:false});
 overview.onpointerdown=e=>{overview.setPointerCapture(e.pointerId);drag={at:localPoint(e),left,top,moved:false};};
 overview.onpointermove=e=>{
  if(!drag)return;
  const p=localPoint(e);drag.moved||=distance(p,drag.at)>4;
  if(!drag.moved)return;
  left=drag.left-(p[0]-drag.at[0])/(sx*scale);top=drag.top-(p[1]-drag.at[1])/(sy*scale);constrain();drawMap();
 };
 overview.onpointerup=e=>{
  if(drag&&!drag.moved){setPin(viewPoint(localPoint(e)),"Ponto no mapa");drawMap();}
  drag=null;
 };
 overview.onpointercancel=()=>{drag=null;};
 $("zoomIn").onclick=()=>zoomMap(1.5);$("zoomOut").onclick=()=>zoomMap(1/1.5);
 $("centerMap").onclick=()=>centerMap(player,Math.max(3,scale));
 $("resetMap").onclick=()=>centerMap([city.width/2,city.height/2],1);
 drawMap();
 const search=$("mapSearch");
 search.oninput=()=>{
  const query=normalize(search.value);
  const terms=query.split(" ").filter(Boolean);
  const found=directory.filter(item=>terms.every(term=>normalize(item.name+" "+item.kind+" "+(item.address||"")).includes(term)));
  $("results").replaceChildren(...found.map(item=>{
   const button=document.createElement("button");button.textContent=item.name+" · "+(item.address||item.kind);
   button.onclick=()=>{setPin(item.point,item.name);centerMap(item.point,Math.max(3,scale));};return button;
  }));
  if(!found.length)$("results").textContent="Nenhum local no recorte atual.";
 };
 search.oninput();search.focus();
}
function journal(){
 const entries=Object.entries(saved.phrases);
 const due=entries.find(([,record])=>record.due<=Date.now());
 open("Revisão espaçada","Caderno de viagem",
  (entries.length?'<p>'+entries.length+' expressões encontradas.</p>':'<p>Converse pela cidade para guardar suas primeiras expressões.</p>')+
  (due?'<button class="primary" id="review">Tentar lembrar uma frase</button>':'')+'<dl id="phrases"></dl>');
 entries.forEach(([it,record])=>{
  const dt=document.createElement("dt"),dd=document.createElement("dd"),button=document.createElement("button");
  dt.lang="it";dt.textContent=it+" ";dd.textContent=record.pt;
  button.textContent="♪";button.setAttribute("aria-label","Ouvir "+it);button.onclick=()=>speak(it);
  dt.append(button);$("phrases").append(dt,dd);
 });
 if(due)$("review").onclick=()=>review(due);
}
function review([it,record]){
 open("Revisão espaçada","Como você diria?",
  '<p>'+escapeHtml(record.pt)+'</p><label for="recall">Escreva ou diga em voz alta</label><textarea id="recall" lang="it"></textarea><button id="reveal">Ver a expressão</button>'+
  '<div id="recallResult" hidden><p class="utterance" lang="it">'+escapeHtml(it)+'</p><div class="row"><button id="again">Quero rever logo</button><button class="primary" id="remembered">Lembrei da ideia</button></div></div>');
 $("reveal").onclick=()=>{$("recallResult").hidden=false;};
 function schedule(ok){
  record.stage=ok?Math.min(record.stage+1,4):0;
  record.due=Date.now()+[60000,86400000,259200000,604800000,1209600000][record.stage];
  persist();journal();
 }
 $("again").onclick=()=>schedule(false);$("remembered").onclick=()=>schedule(true);
}
function skillsDialog(){
 open("Quadro Europeu Comum de Referência","A trilha até C1",
  '<p>Você pode praticar em qualquer ordem. Cada situação treina parte do nível indicado.</p><dl>'+
  skills.map(([level,description])=>{
   const relevant=actors.filter(a=>a.level===level);
   return '<dt>'+level+'</dt><dd>'+escapeHtml(description)+' '+relevant.filter(a=>saved.done[a.id]).length+'/'+relevant.length+' situações praticadas.</dd>';
  }).join("")+'</dl><p>O cenário C1 atual tem resposta escrita e autoavaliação com modelo. A trilha completa também precisa de prática oral, escuta longa e revisão de respostas livres.</p>'+
  '<a target="_blank" rel="noopener" href="https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors">Descritores do Conselho da Europa ↗</a>');
}
const movement=["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","w","a","s","d"];
window.addEventListener("keydown",e=>{
 if(modal.open||e.ctrlKey||e.altKey||e.metaKey)return;
 const key=e.key.length===1?e.key.toLowerCase():e.key;
 if(movement.includes(key)){e.preventDefault();keys.add(key);}
 if(!e.repeat&&key==="e"){e.preventDefault();interact();}
 if(!e.repeat&&key==="m"){e.preventDefault();mapDialog();}
});
window.addEventListener("keyup",e=>keys.delete(e.key.length===1?e.key.toLowerCase():e.key));
window.addEventListener("blur",()=>keys.clear());
window.addEventListener("pagehide",savePosition);
document.querySelectorAll("[data-key]").forEach(button=>{
 const key=button.dataset.key;
 button.onpointerdown=e=>{button.setPointerCapture(e.pointerId);keys.add(key);};
 button.onpointerup=button.onpointercancel=button.onlostpointercapture=()=>keys.delete(key);
 button.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();keys.add(key);}};
 button.onkeyup=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();keys.delete(key);}};
});
$("openMap").onclick=mapDialog;$("openJournal").onclick=journal;$("openSkills").onclick=skillsDialog;
$("clearPin").onclick=()=>setPin(null);$("talk").onclick=$("near").onclick=interact;
modal.addEventListener("close",()=>{if("speechSynthesis" in window)speechSynthesis.cancel();});
renderTerrain();updateSidebar();requestAnimationFrame(tick);
