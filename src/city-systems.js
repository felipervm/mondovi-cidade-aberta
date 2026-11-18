const missions = [
 {id:"benvenuto",name:"Un pomeriggio a Breo",level:"A1–A2",brief:"Parti dal bar e scopri le altre attività del quartiere.",
  steps:[["coffee","Ordina un espresso e decidi dove berlo."],["aragno","Raggiungi corso Statuto 26 e chiedi un consiglio sui dolci."],["moro","Vai in piazza San Pietro e chiedi un tavolo all’aperto."]]},
 {id:"cena",name:"Una cena per due",level:"B1–B2",brief:"Risolvi un imprevisto con la prenotazione e concorda un’alternativa.",
  steps:[["restaurant","Incontra Marta alla Cantina Bonaparte e chiarisci la prenotazione."],["square","Racconta a Paolo come hai raggiunto piazza Maggiore."],["donalfo","Torna in piazza Cesare Battisti e ordina una pizza da dividere."]]},
 {id:"partenza",name:"Dalla collina alla stazione",level:"A2–B1",brief:"Organizza il viaggio, dal biglietto alla coincidenza.",
  steps:[["station","Chiedi a Giulia un biglietto di sola andata per Piazza."],["books","Alla Libreria Confabula scegli un regalo da portare con te."],["altipiano","Raggiungi piazza Franco Centro e aiuta Matteo a controllare il treno."]]},
 {id:"piazza",name:"Il futuro della piazza",level:"B2–C1",brief:"Visita il mercato, ascolta esigenze diverse e formula una proposta.",
  steps:[["market","Parla con Elena al mercato."],["mediation","Ascolta l’ambulante e il residente e proponi una sperimentazione."],["interview","Vai in piazza Monteregale e difendi la tua proposta in un’intervista."]]}
];
saved.missions ||= {};
let tracked=missions.find(m=>m.id===saved.tracked)||null;
const actorById=id=>actors.find(actor=>actor.id===id);
const missionStep=m=>Math.min(saved.missions[m.id]||0,m.steps.length);
function trackMission(m){
 tracked=m;saved.tracked=m?.id||null;persist();
 const actor=m&&actorById(m.steps[missionStep(m)]?.[0]);
 if(actor)setPin(actor.point,actor.site+" / "+actor.name);
 renderMissionStatus();
}
function renderMissionStatus(){
 const panel=$("missionStatus");
 if(!tracked){
  panel.innerHTML='<p>Scegli una missione per scoprire la prima destinazione.</p><button id="chooseMission">Scegli una missione</button>';
  $("chooseMission").onclick=missionDialog;return;
 }
 const i=missionStep(tracked),step=tracked.steps[i],actor=step&&actorById(step[0]);
 panel.innerHTML='<h3>'+escapeHtml(tracked.name)+'</h3><p>'+i+'/'+tracked.steps.length+' tappe</p>'+
  (step?'<p>'+escapeHtml(step[1])+'</p><button id="missionPin">Mostra la destinazione</button>':'<p>Missione compiuta!</p><button id="missionPin">Scegline un’altra</button>');
 $("missionPin").onclick=()=>{
  if(actor){setPin(actor.point,actor.site+" / "+actor.name);mapDialog();}else missionDialog();
 };
}
function missionDialog(){
 speaker=null;
 open("Diario delle missioni","Missioni di Mondovì",'<p>Segui una missione e parla con chi incontri lungo il percorso.</p><div id="missionList" class="choices"></div>');
 missions.forEach(m=>{
  const step=missionStep(m),article=document.createElement("article");
  article.className="note";
  article.innerHTML='<h3>'+escapeHtml(m.name)+' <span class="pill">'+m.level+'</span></h3><p>'+escapeHtml(m.brief)+'</p><ol>'+
   m.steps.map(([,task],i)=>'<li>'+(i<step?"✓ ":"")+escapeHtml(task)+'</li>').join("")+'</ol>';
  const button=document.createElement("button");button.textContent=step===m.steps.length?"Missione conclusa":step?"Continua la missione":"Segui la missione";
  button.disabled=step===m.steps.length;
  button.onclick=()=>{trackMission(m);modal.close();};article.append(button);$("missionList").append(article);
 });
}
function advanceMission(id){
 if(!tracked||tracked.steps[missionStep(tracked)]?.[0]!==id)return "";
 saved.missions[tracked.id]=missionStep(tracked)+1;
 const next=actorById(tracked.steps[missionStep(tracked)]?.[0]);
 if(next)setPin(next.point,next.site+" / "+next.name);
 else setPin(null);
 persist();renderMissionStatus();
 return next?'<p class="note"><strong>Prossima tappa</strong> · '+escapeHtml(tracked.steps[missionStep(tracked)][1])+' La destinazione è segnata sulla mappa.</p>':
  '<p class="note"><strong>Missione compiuta!</strong> · '+escapeHtml(tracked.name)+'</p>';
}
const shopTopics={
 moro:[
  ["Chiedere di ripetere","Scusi, potrebbe ripetere più lentamente?","Certo. Le chiedevo se preferisce stare dentro o fuori."],
  ["Chiedere del prossimo posto","Da qui, come arrivo al Gran Caffè Aragno?","Torni verso il centro di Breo e cerchi corso Statuto. Il caffè è al numero ventisei.","aragno"]
 ],
 aragno:[
  ["Chiedere qualcosa di meno dolce","Se volessi qualcosa di meno dolce, che cosa mi consiglierebbe?","Le chiederei prima se preferisce qualcosa di fresco o un biscotto da accompagnare al caffè."],
  ["Chiedere del Moro Cafè","Il Moro Cafè è lontano da qui?","No, vada verso piazza San Pietro. Lo trova proprio sulla piazza.","moro"]
 ],
 donalfo:[
  ["Chiedere conti separati","Scusi, sarebbe possibile fare due conti separati?","Sì. Mi dice che cosa ha preso ciascuno?"],
  ["Chiarire un equivoco","Mi sono spiegato male: volevamo una pizza in tutto, non una a testa.","Ah, ho capito. Allora la portiamo già tagliata, così potete dividerla."]
 ]
};
function conversationMenu(actor){
 speaker=actor;
 const topics=shopTopics[actor.id]||[];
 const next=tracked?.steps[missionStep(tracked)]?.[0];
 open(actor.site,actor.name,'<p class="utterance" lang="it">Buongiorno! Mi dica.</p><div id="topics" class="choices"></div>');
 const button=(label,action)=>{
  const item=document.createElement("button");item.textContent=label;item.onclick=action;$("topics").append(item);
 };
 button((next===actor.id?"Missione · ":"")+actor.title,()=>startEncounter(actor));
 topics.forEach(([title,line,reply,target])=>button(title,()=>ambientDialog(actor.name,line,reply,actorById(target),()=>conversationMenu(actor))));
 button("Mettermi alla prova · lingua e registro",()=>grammarChallenge(actor,()=>conversationMenu(actor)));
 button("Una richiesta imprevista",()=>situationalPractice(actor));
 button("Capire il parlato quotidiano",()=>expressionPractice(actor));
 button("Chiedere indicazioni",()=>{
  const destination=actorById(next===actor.id?undefined:next)||actorById(actor.id==="altipiano"?"moro":"altipiano");
  ambientDialog(actor.name,"Mi scusi, come posso arrivarci?",
   destination.id==="altipiano"?"Cerchi piazza Franco Centro, all’Altipiano. La stazione è lì.":
   "Guardi, le segno il posto sulla mappa. Da qui può seguire le indicazioni.",destination,()=>conversationMenu(actor));
 });
}
function ambientDialog(name,line,reply,destination,back){
 open("Conversazione",name,'<p lang="it">'+escapeHtml(line)+'</p><p class="utterance" lang="it">'+escapeHtml(reply)+'</p>'+
  '<div class="row"><button id="hearQuestion">♪ Ascolta la domanda</button><button id="hearReply">♪ Ascolta la risposta</button>'+
  (destination?'<button class="primary" id="markReply">Segna '+escapeHtml(destination.site)+'</button>':'')+
  (back?'<button id="backTopic">Altri argomenti</button>':'')+'</div>');
 $("hearQuestion").onclick=()=>speak(line);$("hearReply").onclick=()=>speak(reply);
 if(destination)$("markReply").onclick=()=>{setPin(destination.point,destination.site+" / "+destination.name);modal.close();};
 if(back)$("backTopic").onclick=back;
}

const walkGraph=new Map(), driveGraph=new Map();
const pointKey=p=>p.join(",");
function addEdge(graph,a,b){
 const ak=pointKey(a),bk=pointKey(b);
 if(ak===bk)return;
 if(!graph.has(ak))graph.set(ak,{point:a,edges:[]});
 if(!graph.has(bk))graph.set(bk,{point:b,edges:[]});
 graph.get(ak).edges.push([bk,distance(a,b)]);
}
for(const s of streets){
 if(!s.tunnel||s.kind!=="construction"){
  addEdge(walkGraph,s.a,s.b);addEdge(walkGraph,s.b,s.a);
 }
}
for(const lane of trafficEdges)addEdge(driveGraph,lane.a,lane.b);
function candidates(graph,p){
 return [...graph.values()].map(node=>({node,d:distance(node.point,p)})).filter(({d})=>d<95).sort((a,b)=>a.d-b.d).slice(0,8);
}
class NavQueue {
 items=[];
 push(item){
  const heap=this.items;let i=heap.length;heap.push(item);
  while(i>0){const p=(i-1)>>1;if(heap[p][0]<=item[0])break;heap[i]=heap[p];i=p;}
  heap[i]=item;
 }
 pop(){
  const heap=this.items,first=heap[0],last=heap.pop();
  if(heap.length){
   let i=0;
   while(i*2+1<heap.length){
    let next=i*2+1;if(next+1<heap.length&&heap[next+1][0]<heap[next][0])next++;
    if(heap[next][0]>=last[0])break;
    heap[i]=heap[next];i=next;
   }
   heap[i]=last;
  }
  return first;
 }
}
function buildRoute(from,to,driving){
 const graph=driving?driveGraph:walkGraph, starts=candidates(graph,from), ends=candidates(graph,to);
 if(!starts.length||!ends.length)return null;
 const targetCosts=new Map(ends.map(({node,d})=>[pointKey(node.point),d*2.5]));
 const queue=new NavQueue(), costs=new Map(), came=new Map();
 for(const {node,d} of starts){const k=pointKey(node.point);costs.set(k,d*2.5);queue.push([d*2.5,k]);}
 let end=null,best=Infinity;
 while(queue.items.length){
  const [cost,k]=queue.pop();
  if(cost>=best)break;
  if(cost!==costs.get(k))continue;
  const finish=targetCosts.get(k);
  if(finish!==undefined&&cost+finish<best){end=k;best=cost+finish;}
  for(const [next,length] of graph.get(k).edges){
   const alt=cost+length;
   if(alt>=(costs.get(next)??Infinity))continue;
   costs.set(next,alt);came.set(next,k);queue.push([alt,next]);
  }
 }
 if(!end)return null;
 const points=[];
 for(let k=end;k!==undefined;k=came.get(k))points.push(graph.get(k).point);
 return [from,...points.reverse(),to];
}
let navigationRoute=null,routeOrigin=null,lastRouteUpdate=0;
function refreshRoute(time,force=false){
 if(!pin){navigationRoute=null;routeOrigin=null;return;}
 if(!force&&time-lastRouteUpdate<700)return;
 if(!force&&routeOrigin&&distance(player,routeOrigin)<18)return;
 lastRouteUpdate=time;routeOrigin=player;
 navigationRoute=buildRoute(player,pin.point,Boolean(driven));
}
function remainingDistance(){
 const p=navigationRoute;
 if(!p)return Math.round(distance(player,pin.point))+" m in linea d’aria";
 return Math.round(distance(player,p[1])+p.slice(2).reduce((sum,point,i)=>sum+distance(point,p[i+1]),0))+" m lungo il percorso";
}

const nearestDrivePoint=(p,radius=95)=>{
 let best=null,min=radius;
 for(const lane of inCityEdges){
  if(lane.tunnel)continue;
  const point=nearestOn(p,lane.a,lane.b),d=distance(p,point);
  if(d<min&&canWalk(point)){min=d;best=point;}
 }
 return best;
};
const parked=[
 {point:nearestDrivePoint(spawn),name:"Breo · Corso Statuto"},
 {point:nearestDrivePoint(actorById("altipiano").point),name:"Altipiano · Stazione"},
 {point:nearestDrivePoint(actorById("square").point),name:"Piazza · Centro storico"}
].filter(v=>v.point);
let driven=null,driveAngle=0,driveState=null;
function driveable(p){
 return canWalk(p)&&nearStreets(p).some(s=>s.motor&&distance(p,nearestOn(p,s.a,s.b))<Math.max(2,roadWidth(s.kind)/2-1));
}
const nearVehicle=()=>parked.find(v=>distance(player,v.point)<19);
function vehicleAction(){
 if(trip||modal.open)return;
 if(driven){
  driven.point=player;driven=null;driveState=null;savePosition();refreshRoute(previous,true);return;
 }
 const vehicle=nearVehicle();
 if(vehicle){
  driven=vehicle;player=vehicle.point;driveState=attachCar(player);refreshRoute(previous,true);return;
 }
 const closest=[...parked].sort((a,b)=>distance(player,a.point)-distance(player,b.point))[0];
 open("Veicoli","Auto condivisa",'<p>Avvicinati a un’auto con il simbolo V. Premi V per salire o scendere. Usa le frecce per scegliere la direzione, la guida assistita segue la strada.</p>'+
  (closest?'<button id="findVehicle" class="primary">Segna l’auto più vicina</button>':''));
 if(closest)$("findVehicle").onclick=()=>{setPin(closest.point,closest.name+" / Auto");modal.close();};
}
function drawPlayerVehicle(screen){
 parked.forEach(v=>{
  if(v===driven)return;
  const [x,y]=screen(v.point);
  if(x<0||x>canvas.width||y<0||y>canvas.height)return;
  drawVehicleIcon(x,y,0,"#527282");marker(ctx,x,y-7,"V","#cddecf");
 });
 if(driven){const [x,y]=screen(player);drawVehicleIcon(x,y,driveAngle,"#426e84");}
}
function drawVehicleIcon(x,y,angle,color){
 ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.rotate(angle);
 ctx.fillStyle="#403f36";ctx.fillRect(-9,-4,18,9);
 ctx.fillStyle=color;ctx.fillRect(-8,-4,16,8);
 ctx.fillStyle="#b8d2cc";ctx.fillRect(1,-3,3,6);
 ctx.fillStyle="#eed8a0";ctx.fillRect(6,-3,2,1);ctx.fillRect(6,2,2,1);ctx.restore();
}
const folkColors=["#886658","#718150","#918c67","#947d9a","#597b84","#a96b4f"];
const footLanes=streets.filter(s=>!["primary","secondary","construction"].includes(s.kind)&&distance(s.a,s.b)>1&&
 [0,.25,.5,.75,1].every(t=>canWalk([s.a[0]+(s.b[0]-s.a[0])*t,s.a[1]+(s.b[1]-s.a[1])*t])));
const nearbyFoot=footLanes.filter(s=>distance(s.a,spawn)<160);
const walkingJunctions=new Map();
for(const segment of footLanes){
 for(const [from,to] of [[segment.a,segment.b],[segment.b,segment.a]]){
  const k=pointKey(from);if(!walkingJunctions.has(k))walkingJunctions.set(k,[]);
  walkingJunctions.get(k).push({a:from,b:to});
 }
}
const pedestrianNames=["Andrea","Giada","Roberto","Irene","Luca","Francesca","Carlo","Silvia","Pietro","Sara","Enrico","Laura"];
const pedestrians=Array.from({length:165},(_,i)=>{
 const segment=pick(i<14&&nearbyFoot.length?nearbyFoot:footLanes);
 const t=random(),point=segment.a.map((v,axis)=>v+(segment.b[axis]-v)*t);
 return {id:"passante-"+i,name:pedestrianNames[i%pedestrianNames.length],segment,length:distance(segment.a,segment.b),
  offset:t*distance(segment.a,segment.b),pause:0,pace:1.1+random()*1.1,color:folkColors[i%folkColors.length],point};
});
function updatePedestrians(dt){
 for(const p of pedestrians){
  if(modal.open&&speaker?.id===p.id)continue;
  if(p.pause>0){p.pause-=dt;continue;}
  p.offset+=dt*p.pace;
  while(p.offset>=p.length){
   p.offset-=p.length;
   const exits=walkingJunctions.get(pointKey(p.segment.b))||[];
   const forward=exits.filter(e=>pointKey(e.b)!==pointKey(p.segment.a));
   p.segment=pick(forward.length?forward:exits.length?exits:[{a:p.segment.b,b:p.segment.a}]);
   p.length=distance(p.segment.a,p.segment.b);
   if(random()<.08)p.pause=.6+random()*2;
  }
  const t=p.offset/p.length,{a,b}=p.segment;
  p.point=[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
 }
}
function nearestPedestrian(){
 return pedestrians.filter(person=>distance(player,person.point)<9).sort((a,b)=>distance(player,a.point)-distance(player,b.point))[0];
}
function pedestrianTalk(){
 const person=nearestPedestrian();
 if(!person)return;
 speaker=person;
 conversationMenu({...person,site:"Per strada a Mondovì",level:"B2",title:"Due parole per strada",generic:true,turns:pedestrianTurns(person)});
}
function setupCitySystems(){
 $("openMissions").onclick=missionDialog;$("vehicle").onclick=vehicleAction;
 window.addEventListener("keydown",e=>{if(!e.repeat&&!e.ctrlKey&&!e.altKey&&!e.metaKey&&e.key.toLowerCase()==="v")vehicleAction();});
 renderMissionStatus();
 if(tracked&&missionStep(tracked)<tracked.steps.length)trackMission(tracked);
}
setupCitySystems();
