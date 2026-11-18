saved.settings={challenge:true,portuguese:false,...saved.settings};
saved.language ||= {attempts:0,correct:0,help:0,seen:{}};
const grammarBank=[
 {id:"prep-bar",topic:"Preposizioni · A2",line:"Vado ___ bar, poi passo ___ farmacia.",answers:["al in"],model:"Vado al bar, poi passo in farmacia.",rule:"Al = a + il. Con farmacia si usa normalmente in.",
  pt:"Complete com duas preposições. Vou ao bar e depois passo na farmácia."},
 {id:"prep-origin",topic:"Preposizioni · A2",line:"Sono appena arrivato ___ Torino e domani parto ___ Milano.",answers:["da per"],model:"Sono appena arrivato da Torino e domani parto per Milano.",rule:"Da indica la provenienza. Partire per introduce la destinazione.",
  pt:"Da indica origem. Per indica o destino com partire."},
 {id:"prep-person",topic:"Preposizioni · B1",line:"Passo ___ libraia prima di andare ___ stazione.",answers:["dalla in"],model:"Passo dalla libraia prima di andare in stazione.",rule:"Da + la diventa dalla. Da si usa per andare presso una persona o la sua attività.",
  pt:"Dalla libraia = na livraria, junto à livreira. In stazione = na estação."},
 {id:"prep-time",topic:"Preposizioni · B1",line:"Abito qui ___ tre mesi; ci vediamo ___ mezz’ora.",answers:["da fra","da tra"],model:"Abito qui da tre mesi; ci vediamo fra mezz’ora.",rule:"Da introduce una durata ancora in corso. Fra e tra indicano un intervallo prima di un evento futuro.",
  pt:"Da para uma duração que continua. Fra/tra para daqui a algum tempo."},
 {id:"prep-from",topic:"Preposizioni · B1",line:"Scendo ___ funicolare e proseguo ___ piedi.",answers:["dalla a"],model:"Scendo dalla funicolare e proseguo a piedi.",rule:"Scendere da un mezzo. L’espressione fissa è a piedi.",
  pt:"Desço do funicular e sigo a pé."},
 {id:"prep-means",topic:"Preposizioni · B1",line:"Salgo ___ funicolare, ma torno ___ macchina.",answers:["in in"],model:"Salgo in funicolare, ma torno in macchina.",rule:"In si usa con molti mezzi di trasporto quando non sono accompagnati dall’articolo.",
  pt:"In funicolare e in macchina indicam meios de transporte."},
 {id:"past-arrival",topic:"Passato prossimo · B1",line:"Ieri noi ___ arrivati tardi, ma Marta ci ___ aspettato. Completa i due ausiliari.",answers:["siamo ha"],model:"Ieri siamo arrivati tardi, ma Marta ci ha aspettato.",rule:"Arrivare forma il passato prossimo con essere. Aspettare richiede avere.",
  pt:"Arrivare usa essere. Aspettare usa avere."},
 {id:"past-background",topic:"Tempi del passato · B1",line:"Mentre ___ (aspettare, io) il treno, ___ (incontrare, io) Matteo.",answers:["aspettavo ho incontrato"],model:"Mentre aspettavo il treno, ho incontrato Matteo.",rule:"L’imperfetto descrive lo sfondo. Il passato prossimo introduce l’evento.",
  pt:"Imperfetto para o pano de fundo. Passato prossimo para o acontecimento."},
 {id:"plural-past",topic:"Accordo · B1",line:"Giulia e Serena ___ (salire) a Piazza ieri. Scrivi il passato prossimo.",answers:["sono salite"],model:"Giulia e Serena sono salite a Piazza ieri.",rule:"Con essere, il participio concorda con il soggetto femminile plurale.",
  pt:"Com essere, salite concorda com Giulia e Serena."},
 {id:"conditional",topic:"Cortesia · B1",line:"Scusi, ___ (potere, Lei) ripetere l’ultima parte? Usa il condizionale.",answers:["potrebbe"],model:"Scusi, potrebbe ripetere l’ultima parte?",rule:"Il condizionale di potere attenua una richiesta formale.",
  pt:"Potrebbe torna o pedido mais cortês."},
 {id:"subjunctive",topic:"Congiuntivo · B2",line:"Non credo che il negozio ___ (essere) ancora aperto.",answers:["sia"],model:"Non credo che il negozio sia ancora aperto.",rule:"Non credo che introduce normalmente il congiuntivo.",
  pt:"Non credo che normalmente pede congiuntivo."},
 {id:"subj-have",topic:"Congiuntivo · B2",line:"Spero che domani voi ___ (avere) il tempo di passare.",answers:["abbiate"],model:"Spero che domani voi abbiate il tempo di passare.",rule:"Sperare che regge il congiuntivo. Avere, voi → abbiate.",
  pt:"Spero che voi abbiate = espero que vocês tenham."},
 {id:"hypothesis",topic:"Periodo ipotetico · B2",line:"Se ___ (avere, io) più tempo, ___ (restare, io) in piazza.",answers:["avessi resterei"],model:"Se avessi più tempo, resterei in piazza.",rule:"Ipotesi possibile ma non realizzata ora → congiuntivo imperfetto e condizionale presente.",
  pt:"Se eu tivesse mais tempo, ficaria na praça."},
 {id:"counterfactual",topic:"Periodo ipotetico · C1",line:"Se lo ___ (sapere, io), ti ___ (avvisare, io). L’occasione è ormai passata.",answers:["avessi saputo avrei avvisato"],model:"Se lo avessi saputo, ti avrei avvisato.",rule:"Ipotesi irreale nel passato → congiuntivo trapassato e condizionale passato.",
  pt:"Se eu tivesse sabido, teria avisado você."},
 {id:"reported",topic:"Discorso indiretto · B2",line:"Marta ha detto che ___ (arrivare, lei) il giorno dopo. Indica il futuro nel passato.",answers:["sarebbe arrivata"],model:"Marta ha detto che sarebbe arrivata il giorno dopo.",rule:"Il condizionale passato esprime un evento futuro rispetto a un momento passato.",
  pt:"Sarebbe arrivata expressa o futuro visto a partir de um momento passado."},
 {id:"clitics",topic:"Pronomi · B2",line:"Ho chiesto due libri e Chiara ___ ha consigliati. Completa con due pronomi.",answers:["me ne"],model:"Ho chiesto due libri e Chiara me ne ha consigliati.",rule:"Mi diventa me davanti a ne. Ne riprende una quantità già nominata.",
  pt:"Me ne retoma para mim e uma quantidade já mencionada."},
 {id:"relative",topic:"Preposizioni e relativi · B2",line:"È la proposta ___ cui abbiamo discusso ieri.",answers:["di"],model:"È la proposta di cui abbiamo discusso ieri.",rule:"Discutere di qualcosa → la proposta di cui abbiamo discusso.",
  pt:"Discutere di qualcosa pede di cui."},
 {id:"concession",topic:"Concessione · C1",line:"Benché la proposta ___ (sembrare) ragionevole, restano alcuni dubbi.",answers:["sembri"],model:"Benché la proposta sembri ragionevole, restano alcuni dubbi.",rule:"Benché introduce una concessione e regge il congiuntivo.",
  pt:"Benché significa embora e rege congiuntivo."},
 {id:"mica",topic:"Parlato · B2",line:"«Hai mica una penna?» Qui mica esprime una negazione o attenua una domanda? Scrivi negazione oppure domanda.",answers:["domanda","attenua una domanda"],model:"Attenua una domanda.",rule:"Nel parlato, mica può rendere meno diretta una domanda. È frequente anche nell’italiano settentrionale.",
  pt:"Hai mica…? suaviza a pergunta, como por acaso você tem…?"},
 {id:"mica-counter",topic:"Parlato · B2",line:"«Non è mica lontano!» La persona conferma che è lontano oppure corregge questa idea? Scrivi conferma oppure corregge.",answers:["corregge"],model:"Corregge questa idea.",rule:"Mica può rafforzare una negazione e contraddire un’aspettativa dell’interlocutore.",
  pt:"Non è mica lontano contradiz a expectativa de que o lugar seja longe."},
 {id:"volentieri",topic:"Pragmatica · B1",line:"Ti offrono un caffè. Accetta con una sola parola che esprima piacere.",answers:["volentieri"],model:"Volentieri!",rule:"Volentieri è una risposta naturale per accettare con piacere un’offerta. Si usa in tutta Italia.",
  pt:"Volentieri = com prazer. É comum em toda a Itália."},
 {id:"figurati",topic:"Registro · B2",line:"Un amico ti ringrazia. Rispondi in modo informale usando il verbo figurare.",answers:["figurati"],model:"Figurati!",rule:"Figurati può rispondere a un ringraziamento. Nel registro formale si può dire Si figuri.",
  pt:"Figurati responde informalmente a um agradecimento, como imagina."},
 {id:"register",topic:"Registro · C1",line:"Un cliente dice «Mi servirebbe una mano». Ti sta ordinando qualcosa oppure sta chiedendo aiuto in modo attenuato? Scrivi ordine oppure richiesta.",answers:["richiesta"],model:"È una richiesta attenuata.",rule:"Il condizionale lascia spazio all’interlocutore e rende meno brusco il bisogno espresso.",
  pt:"O condizionale suaviza a maneira de pedir ajuda."},
 {id:"ci",topic:"Pronomi e luogo · B1",line:"Vai spesso a Breo? Sì, ___ vado quasi tutti i giorni.",answers:["ci"],model:"Sì, ci vado quasi tutti i giorni.",rule:"Ci sostituisce un luogo già menzionato.",
  pt:"Ci substitui um lugar já mencionado."}
];
function questionFor(actor){
 const counts=saved.language.seen;
 const hash=[...(actor.id||actor.name)].reduce((sum,c)=>sum+c.charCodeAt(0),0);
 const pool=grammarBank.filter(q=>actor.level==="C1"?/B2|C1/.test(q.topic):actor.level==="A1"||actor.level==="A2"?!/B2|C1/.test(q.topic):true);
 return pool.sort((a,b)=>(counts[a.id]||0)-(counts[b.id]||0)||((grammarBank.indexOf(a)+hash)%grammarBank.length)-((grammarBank.indexOf(b)+hash)%grammarBank.length))[0];
}
function grammarChallenge(actor,onSuccess){
 speaker=actor;
 const q=questionFor(actor);
 open(q.topic,"Un’ultima cosa…",'<p class="utterance challenge" lang="it">'+escapeHtml(q.line)+'</p><p>Scrivi soltanto le parole mancanti, nell’ordine. Per le domande sul senso, rispondi con la parola richiesta.</p>'+
  '<form id="grammarForm"><label for="grammarAnswer">La tua risposta</label><textarea id="grammarAnswer" lang="it" required></textarea><button class="primary">Verifica</button></form>'+
  '<div class="row"><button id="grammarListen">♪ Ascolta</button><button id="grammarClue">Un indizio in italiano</button></div>'+
  '<p id="grammarFeedback" class="note" role="status" hidden></p>');
 $("grammarListen").onclick=()=>speak(q.line);
 $("grammarClue").onclick=()=>{
  $("grammarFeedback").hidden=false;$("grammarFeedback").textContent=q.rule;saved.language.help++;persist();
 };
 $("grammarForm").onsubmit=e=>{
  e.preventDefault();
  const response=normalize($("grammarAnswer").value);if(!response)return;
  saved.language.attempts++;
  const correct=q.answers.some(answer=>normalize(answer)===response)||normalize(q.model)===response;
  if(!correct){
   $("grammarFeedback").hidden=false;$("grammarFeedback").textContent="Riprova. "+q.rule;persist();return;
  }
  saved.language.correct++;saved.language.seen[q.id]=(saved.language.seen[q.id]||0)+1;
  remember([q.model,q.pt]);saved.phrases[q.model].it=q.rule;persist();
  open(q.topic,"Ci siamo!",'<p class="utterance" lang="it">'+escapeHtml(q.model)+'</p><p>'+escapeHtml(q.rule)+'</p><button id="grammarContinue" class="primary">Continua</button>');
  $("grammarContinue").onclick=onSuccess;
 };
}
function decorateInteraction(){
 if(speaker){
  const portrait=document.createElement("canvas");portrait.className="portrait";portrait.width=40;portrait.height=44;
  portrait.setAttribute("role","img");portrait.setAttribute("aria-label","Ritratto di "+speaker.name);
  modal.insertBefore(portrait,modal.children[1]||null);
  paintPortrait(portrait,speaker);
 }
 if(saved.settings?.portuguese){
  const details=document.createElement("details");details.className="assist";
  const summary=document.createElement("summary");summary.textContent="Aiuto in portoghese";
  const paragraph=document.createElement("p");paragraph.lang="pt-BR";
  const q=grammarBank.find(item=>modal.textContent.includes(item.line));
  paragraph.textContent=q?.pt||(speaker?.id===active?.id?active?.turns?.[turn]?.ptHint:null)||"Ouça a fala, tente responder em italiano e use o indício para entender a intenção. Você pode abrir as respostas sugeridas e compará-las antes de escolher. Nas atividades avançadas, reescreva sua resposta depois de comparar com o modelo.";
  details.append(summary,paragraph);modal.append(details);
 }
}
function paintPortrait(canvas,person){
 const g=canvas.getContext("2d"),hash=[...(person.id||person.name||"Persona")].reduce((sum,c)=>sum*31+c.charCodeAt(0),7)>>>0;
 const skin=["#ecc29b","#cf9972","#aa7555","#754f3d"][hash%4],hair=["#513b31","#98734c","#35332f","#aaa393"][(hash>>>3)%4];
 g.fillStyle=["#a4b197","#abb4bc","#c2ad96","#a7a5b7"][(hash>>>5)%4];g.fillRect(0,0,40,44);
 g.fillStyle="#ffffff22";g.fillRect(2,2,36,38);
 g.fillStyle=person.color||"#687b65";g.fillRect(4,33,32,11);g.fillRect(9,30,22,6);
 g.fillStyle="#433a3440";g.fillRect(10,8,23,27);
 g.fillStyle=hair;g.fillRect(9,6,23,24);g.fillRect(12,3,17,4);
 g.fillStyle=skin;g.fillRect(12,13,17,17);g.fillRect(16,29,9,5);g.fillRect(10,17,3,7);g.fillRect(28,17,3,7);
 g.fillStyle=hair;g.fillRect(11,8,19,6);g.fillRect(hash%2?12:23,12,6,4);
 g.fillStyle="#fff2dc";g.fillRect(15,18,3,2);g.fillRect(24,18,3,2);
 g.fillStyle="#343b35";g.fillRect(16,18,1,2);g.fillRect(24,18,1,2);
 g.fillStyle="#b57e60";g.fillRect(20,20,2,4);g.fillStyle="#875246";g.fillRect(18,26,7,1);
 if(hash%3===0){g.strokeStyle="#514c49";g.strokeRect(13,16,7,5);g.strokeRect(22,16,7,5);}
}
function settingsDialog(){
 speaker=null;
 open("Impostazioni","Come vuoi giocare?",'<p>L’italiano è la lingua della città. Gli aiuti si aprono quando li scegli.</p>'+
  '<p><label><input type="checkbox" id="ptSetting" '+(saved.settings.portuguese?"checked":"")+'> Abilita aiuti facoltativi in portoghese</label></p>'+
  '<p><label><input type="checkbox" id="challengeSetting" '+(saved.settings.challenge?"checked":"")+'> Richiedi una prova di lingua per completare gli incontri</label></p>'+
  '<p>Le prove coprono preposizioni, tempi verbali, pronomi e registro. Le risposte aperte richiedono confronto e revisione personale.</p>'+
  '<button id="saveSettings" class="primary">Salva</button>');
 $("saveSettings").onclick=()=>{
  saved.settings.portuguese=$("ptSetting").checked;saved.settings.challenge=$("challengeSetting").checked;persist();modal.close();
 };
}
const situations=[
 ["Spiega il problema","Il prodotto che hai comprato non è quello che avevi chiesto. Spiega l’equivoco e proponi una soluzione, usando il condizionale.",
  "Mi scusi, credo ci sia stato un equivoco. Avevo chiesto un’altra cosa. Sarebbe possibile cambiarla?"],
 ["Concorda un’alternativa","Il servizio che cercavi oggi non è disponibile. Chiedi una possibilità diversa e specifica entro quando ti serve.",
  "Capisco. Ci sarebbe un’alternativa? Mi servirebbe entro domani, perché poi parto."],
 ["Racconta e chiarisci","Racconta che cosa ti era stato detto e che cosa hai trovato oggi. Distingui il passato dall’aspettativa.",
  "Mi avevano detto che sarebbe stato pronto oggi, ma vedo che c’è ancora da aspettare. Potrebbe dirmi quando posso tornare?"],
 ["Sottintesi e registro","La persona dice «Oggi la vedo dura». Spiega che cosa intendi e chiedi una conferma con tatto.",
  "Se ho capito bene, oggi sarà difficile riuscirci. Possiamo già concordare un altro momento, oppure preferisce che richiami?"]
];
function situationalPractice(actor){
 speaker=actor;
 const index=(saved.language.seen["open-"+actor.id]||0)%situations.length;
 const [title,task,model]=situations[index];
 open(actor.site,title,'<p>'+escapeHtml(task)+'</p><form id="situationForm"><label for="situationDraft">Formula la richiesta in almeno due frasi</label><textarea id="situationDraft" required lang="it"></textarea><button class="primary">Rileggi e confronta</button></form>');
 $("situationForm").onsubmit=e=>{
  e.preventDefault();const draft=$("situationDraft").value.trim();
  if(draft.split(/\s+/).length<12){$("situationDraft").setCustomValidity("Sviluppa la risposta con almeno dodici parole.");$("situationDraft").reportValidity();return;}
  saved.drafts["open-"+actor.id]=draft;saved.language.seen["open-"+actor.id]=(saved.language.seen["open-"+actor.id]||0)+1;persist();
  open(actor.site,"Rivedi il registro",'<p lang="it">'+escapeHtml(draft)+'</p><p class="utterance" lang="it">'+escapeHtml(model)+'</p><p>Hai chiarito il motivo? Hai formulato una richiesta concreta? Il registro è adatto alla persona? La risposta è salvata per il confronto personale.</p><button class="primary" id="reviseSituation">Riprova la situazione</button>');
  $("reviseSituation").onclick=()=>situationalPractice(actor);
 };
 $("situationDraft").oninput=()=>{$("situationDraft").setCustomValidity("");};
}
function pedestrianTurns(person){
 const question=person.id.charCodeAt(person.id.length-1)%3;
 const lines=[
  ["Hai mica un minuto? Sto cercando la stazione. È da questa parte?","Indica che non ne sei sicuro e proponi di controllare insieme.","Non ne sono sicuro. Guardiamo la mappa insieme?","Volentieri, grazie. Non vorrei finire dalla parte sbagliata."],
  ["Dai, facciamo due passi fino in piazza?","Accetta con piacere e chiedi dove vi incontrate.","Volentieri! Ci troviamo davanti al bar?","Perfetto. Ti aspetto lì, allora."],
  ["Non è mica vicino come pensavo. Mi sa che conviene prendere la macchina.","Riconosci che la distanza è maggiore del previsto.","Già, pensavo fosse più vicino anch’io.","Eh sì. A piedi ci vuole un po’, soprattutto con queste salite."]
 ];
 const [line,hint,reply,response]=lines[question];
 return [{line,hint,replies:[reply,"Non c’entra niente, lasciamo perdere.","Ho già pagato il conto."],answer:0,retry:"Come, scusa? Non ho capito che cosa intendi.",
  feedback:"Osserva come l’interlocutore attenua la domanda o corregge un’aspettativa. Le formule cambiano con il contesto.",
  reply:response,memory:[reply,"Reformule a ideia com suas próprias palavras."]}];
}
const serviceLines={
 pharmacy:["Avrebbe bisogno di parlare con il farmacista?","Vorrei chiedere un’informazione al farmacista, per favore."],
 clothes:["Sta cercando una taglia o vuole dare un’occhiata?","Sto cercando una taglia più grande. Posso provarla?"],
 books:["Ha un titolo in mente o preferisce un consiglio?","Cerco un romanzo breve da regalare. Che cosa mi consiglia?"],
 bank:["Deve prendere un appuntamento o chiedere un’informazione?","Vorrei sapere come fissare un appuntamento."],
 hotel:["Ha una prenotazione a suo nome?","Sì, vorrei verificare la prenotazione prima di lasciare i bagagli."],
 restaurant:["Preferisce mangiare qui o ordinare da asporto?","Vorrei ordinare da asporto. Quanto ci sarebbe da aspettare?"],
 cafe:["Lo prende al banco o si accomoda?","Mi accomodo, grazie. Potrebbe portarmi la lista?"],
 supermarket:["Ha trovato tutto quello che cercava?","Mi manca una cosa. Dove trovo il pane?"],
 butcher:["Mi dica, che cosa le preparo?","Me ne dia due etti, tagliati sottili, per favore."],
 post_office:["Deve spedire o ritirare qualcosa?","Vorrei spedire questo pacco. Quali opzioni ci sono?"],
 museum:["Vuole informazioni sulla visita?","Vorrei sapere se c’è una visita guidata e quanto dura."],
 townhall:["Ha già fissato un appuntamento con l’ufficio?","Vorrei sapere a quale ufficio rivolgermi."],
 default:["Buongiorno, come posso aiutarla?","Vorrei un’informazione. Potrebbe spiegarmi come funziona?"]
};
const represented=new Set(actors.map(a=>a.place));
for(const [id,name,kind,point] of city.places){
 if(represented.has(id))continue;
 const type=kind==="bar"||kind==="pastry"?"cafe":kind==="guest_house"?"hotel":kind;
 const [line,response]=serviceLines[type]||serviceLines.default;
 const index=actors.length;
 const actor={id:"shop-"+id,place:id,name:["Alessia","Davide","Federica","Giorgio","Elisa","Stefano"][index%6],
  site:name||((typeNames[kind]||"Attività")+" · "+(closestStreet(point)?.segment.name||"Mondovì")),
  color:folkColors[index%folkColors.length],point:arrival(point),level:"B1",generic:true,title:"Chiedere informazioni",
  turns:[{line,hint:"Chiarisci che cosa cerchi e formula una richiesta cortese.",
   replies:[response,"No, ho già preso il treno.","Il tavolo è dall’altra parte della città."],answer:0,
   retry:"Mi può spiegare meglio di che cosa ha bisogno?",feedback:"Il condizionale e potrebbe attenuano la richiesta nel registro formale.",
   reply:"Certo. Mi spieghi meglio che cosa le serve, così vediamo come procedere.",memory:[response,"Faça um pedido cortês e concreto."]}]};
 actors.push(actor);
 mapItems.set(id,{name:actor.site,kind:typeNames[kind]||"Attività",point:actor.point});
}
directory.splice(0,directory.length,...[...mapItems.values()].sort((a,b)=>collator.compare(a.name,b.name)));
function attachCar(){
 return {speed:0};
}
function moveAssistedCar(dx,dy,dt){
 if(!driveState)driveState=attachCar();
 const length=Math.hypot(dx,dy);
 if(!length){
  driveState.speed=0;
  return false;
 }
 const inputX=dx/length,inputY=dy/length;
 driveState.speed+=(64-driveState.speed)*(1-Math.exp(-dt*16));
 const travel=driveState.speed*dt;
 const steps=Math.max(1,Math.ceil(travel/.45));
 const step=travel/steps;
 const start=player;
 for(let i=0;i<steps;i++){
  const destination=[player[0]+inputX*step,player[1]+inputY*step];
  if(driveable(destination)){
   player=destination;
   continue;
  }
  // Slide along an obstacle only in an axis the player is pressing.
  const horizontal=[player[0]+inputX*step,player[1]];
  if(inputX&&driveable(horizontal))player=horizontal;
  const vertical=[player[0],player[1]+inputY*step];
  if(inputY&&driveable(vertical))player=vertical;
 }
 const movedX=player[0]-start[0],movedY=player[1]-start[1];
 if(Math.hypot(movedX,movedY)<.0001){
  driveState.speed=0;
  return false;
 }
 const angle=Math.atan2(movedY,movedX);
 const diff=Math.atan2(Math.sin(angle-driveAngle),Math.cos(angle-driveAngle));
 driveAngle+=diff*(1-Math.exp(-dt*20));
 return true;
}
$("openSettings").onclick=settingsDialog;
updateSidebar();
const everydayExpressions=[
 {line:"Hai mica una penna?",sense:"Chiede una penna attenuando la domanda.",wrong:"Afferma che non hai una penna.",note:"Mica interrogativo è frequente nel parlato, anche settentrionale. In un contesto formale puoi dire Ha per caso una penna?",pt:"Por acaso você tem uma caneta?"},
 {line:"Mi sa che oggi la vedo dura.",sense:"Pensa che sarà difficile riuscirci oggi.",wrong:"È sicuro che tutto andrà bene.",note:"Mi sa che introduce una valutazione personale. La vedo dura comunica una difficoltà prevista, con tono colloquiale.",pt:"Acho que hoje vai ser difícil."},
 {line:"Dai, facciamo due passi!",sense:"Invita con familiarità a fare una breve passeggiata.",wrong:"Chiede di contare esattamente due passi.",note:"Dai può incoraggiare o sollecitare. Fare due passi è una passeggiata breve. Sono formule dell’italiano comune.",pt:"Vamos, vamos dar uma voltinha!"},
 {line:"Figurati, ci mancherebbe!",sense:"Rassicura chi ha ringraziato o chi si è scusato.",wrong:"Pretende un favore in cambio.",note:"Il senso dipende dal tono. Tra amici può minimizzare un favore. Con una persona a cui dai del Lei puoi dire Si figuri.",pt:"Imagina, por nada!"},
 {line:"Facciamo che ci sentiamo domani?",sense:"Propone di rimandare il contatto a domani.",wrong:"Dice che ci siamo già sentiti ieri.",note:"Facciamo che è colloquiale. Ci sentiamo può riferirsi a una telefonata o a un messaggio, senza specificare il mezzo.",pt:"Que tal a gente se falar amanhã?"},
 {line:"Ci sta, purché non si faccia troppo tardi.",sense:"Accetta la proposta a una condizione.",wrong:"Rifiuta la proposta senza condizioni.",note:"Ci sta può esprimere approvazione nel parlato informale. Purché regge il congiuntivo e introduce una condizione.",pt:"Pode ser, desde que não fique tarde demais."},
 {line:"Cerea! Ci vediamo domani.",sense:"Saluta in modo familiare, con una formula regionale piemontese.",wrong:"Sta chiedendo di cambiare un ordine.",note:"Cerea è un saluto regionale piemontese. Riconoscilo nel contesto locale. Buongiorno e arrivederci restano adatti a un rapporto formale.",pt:"Cerea é uma saudação regional do Piemonte, de uso familiar."}
];
function expressionPractice(actor){
 speaker=actor;
 const index=saved.language.seen["expression"]||0,item=everydayExpressions[index%everydayExpressions.length];
 open("Parlato quotidiano a Mondovì","Che cosa intende?",'<p class="utterance" lang="it">'+escapeHtml(item.line)+'</p><button id="expressionListen">♪ Ascolta</button><div id="expressionOptions" class="choices"></div><p id="expressionResult" class="note" hidden></p>');
 $("expressionListen").onclick=()=>speak(item.line);
 const options=index%2?[item.wrong,item.sense]:[item.sense,item.wrong];
 options.forEach(option=>{
  const button=document.createElement("button");button.textContent=option;
  button.onclick=()=>{
   $("expressionResult").hidden=false;
   if(option!==item.sense){$("expressionResult").textContent="Riascolta e considera il contesto. Riprova.";return;}
   $("expressionResult").textContent=item.note;
   remember([item.line,item.pt]);saved.phrases[item.line].it=item.note;
   saved.language.seen.expression=index+1;persist();
   const next=document.createElement("button");next.textContent="Un’altra espressione";next.onclick=()=>expressionPractice(actor);
   $("expressionOptions").replaceChildren(next);
  };
  $("expressionOptions").append(button);
 });
}
