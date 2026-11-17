const fs=require('node:fs'), vm=require('node:vm'), assert=require('node:assert/strict');
const source=fs.readFileSync(new URL('../index.html', require('node:url').pathToFileURL(__filename)),'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
const elements=new Map(), data=new Map();
const context2d=new Proxy({},{get:(o,k)=>o[k]||(()=>{})});
class Element {
 constructor(){this.children=[];this.open=false;this.style={};this.dataset={};this.width=620;this.height=392;this.value='';}
 set innerHTML(value){for(const match of value.matchAll(/\bid="([^"]+)"/g))elements.set(match[1],new Element());}
 getContext(){return context2d;}
 append(...children){this.children.push(...children);}
 replaceChildren(...children){this.children=children;}
 setAttribute(){}
 querySelectorAll(){return [];}
 addEventListener(){}
 focus(){}
 showModal(){this.open=true;}
 close(){this.open=false;}
}
const document={getElementById(id){if(!elements.has(id))elements.set(id,new Element());return elements.get(id);},createElement:()=>new Element(),querySelectorAll:()=>[]};
const env=vm.createContext({document,console,window:{addEventListener(){}},localStorage:{getItem:key=>data.get(key),setItem:(k,v)=>data.set(k,v)},requestAnimationFrame(){},assert});
vm.runInContext(source,env);
vm.runInContext(`
assert.equal(actors.length,12);
assert.equal(boarding.length,2);
assert.equal(Object.keys(city.featured).length,3);
assert(city.width>2500&&city.height>1900);
assert(directory.some(item=>item.name.includes('Altipiano')));
const phases=cars.map(c=>carPose(c));
updateTraffic(.1);
assert(cars.some((car,i)=>carPose(car).x!==phases[i].x||carPose(car).y!==phases[i].y));
assert(inCityEdges.some(lane=>lane.kind==='primary'));
assert(actors.every(a=>canWalk(a.point)));
assert(boarding.every(a=>canWalk(a.point)));
console.log(actors.map(a=>[a.id,a.site,a.point]),boarding);
const frontier=[[Math.round(spawn[0]),Math.round(spawn[1])]], seen=new Set();
const key=([x,y])=>x+y*(city.width+1);
for(let i=0;i<frontier.length;i++){
 const [x,y]=frontier[i];
 for(const p of [[x+2,y],[x-2,y],[x,y+2],[x,y-2]]){
  if(seen.has(key(p)))continue;
  seen.add(key(p));
  if(canWalk(p)&&canWalk([(x+p[0])/2,(y+p[1])/2]))frontier.push(p);
 }
}
for(const a of [...actors,...boarding]){
 assert(frontier.some(p=>distance(p,a.point)<5),'reachable: '+a.name);
}
for(const id of ['market','restaurant','coffee','books','square','moro','aragno','donalfo','altipiano','station']){
 const actor=actors.find(a=>a.id===id);
 player=actor.point;
 assert.equal(nearby().actor.id,id);
 interact();
 $('topics').children[0].onclick();
 actor.turns.forEach((t,j)=>{
  if(j===0){$('choices').children[(t.answer+1)%3].onclick();assert.equal($('reaction').hidden,false);}
  $('answer').value=t.replies[t.answer];
  $('answerForm').onsubmit({preventDefault(){}});
  $('advance').onclick();
 });
 assert(saved.done[id]);
}
assert(saved.ticket);
player=boarding[0].point;
assert(nearby().station);
interact();$('board').onclick();tick(2500);assert.equal(trip,null);assert.deepEqual(player,boarding[1].point);
player=actors.find(a=>a.id==='mediation').point;
assert.equal(nearby().actor.id,'mediation');
interact();$('topics').children[0].onclick();
$('draft').value='Propongo una prova di quattro settimane.';
$('writing').onsubmit({preventDefault(){}});
assert(saved.done.mediation);modal.close();
mapDialog();$('mapSearch').value='Via Sant Agostino';$('mapSearch').oninput();
assert($('results').children.length>0);
$('results').children[0].onclick();assert(pin);
for(const query of ['Bar del Moro','Caffe Aragno','Don Alfo','Altipiano']){
 mapDialog();$('mapSearch').value=query;$('mapSearch').oninput();
 assert($('results').children.length>0,'searchable '+query);modal.close();
}
const first=Object.values(saved.phrases)[0];first.due=0;
journal();$('review').onclick();$('reveal').onclick();$('remembered').onclick();assert.equal(first.stage,1);
assert.equal(Object.keys(saved.done).length,11);
assert(pedestrians.length>=100);
const pedestrianStart=pedestrians[0].point;updatePedestrians(1);assert.notDeepEqual(pedestrians[0].point,pedestrianStart);
modal.close();
const mission=missions.find(m=>m.id==='piazza');
trackMission(mission);assert(pin);assert(navigationRoute);
for(const id of ['market','mediation','interview']){
 const a=actorById(id);player=a.point;
 if(id==='market'){startEncounter(a);for(const t of a.turns){finishTurn(t);$('advance').onclick();}}
 else {startEncounter(a);$('draft').value='Propongo una prova con una scadenza.';$('writing').onsubmit({preventDefault(){}});modal.close();}
}
assert.equal(missionStep(mission),3);assert.equal(pin,null);
assert.equal(Object.keys(saved.done).length,12);
assert(parked.length>=2&&parked.every(v=>driveable(v.point)));
player=parked[0].point;vehicleAction();assert(driven);
setPin(parked[1].point,'Carro');assert(navigationRoute);
const old=player;const lane=nearStreets(player).filter(s=>s.motor).sort((a,b)=>distance(player,nearestOn(player,a.a,a.b))-distance(player,nearestOn(player,b.a,b.b)))[0];
keys.add(lane.b[0]>=lane.a[0]?'ArrowRight':'ArrowLeft');
keys.add(lane.b[1]>=lane.a[1]?'ArrowDown':'ArrowUp');
tick(2533);keys.clear();assert.notDeepEqual(player,old);
vehicleAction();assert.equal(driven,null);
mapDialog();$('zoomIn').onclick();$('zoomOut').onclick();$('centerMap').onclick();$('resetMap').onclick();modal.close();
assert(saved.geoPosition);
console.log('Verified navigability, all encounters in arbitrary order, the ticket and station trip, search, review and persistence.');
`,env);
