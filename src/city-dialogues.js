const encounters = [
 {id:"coffee",place:"1916401476",name:"Lucia",level:"A1", title:"Un caffè al banco",color:"#aa5146",turns:[
  {line:"Buongiorno! Mi dica.",hint:"Ordina un espresso al banco.",ptHint:"Faça o pedido no balcão. «Un caffè» costuma ser um espresso.",
   replies:["Buongiorno! Un caffè, per favore.","Mi fa il conto?","A che ora chiudete?"],answer:0,accept:/\b(un|il) (caffe|espresso)\b/,
   retry:"La macchina è già calda. Cosa le preparo?",feedback:"«Il conto» si chiede al momento di pagare.",
   reply:"Subito. Lo prende qui o da portare via?",memory:["Un caffè, per favore.","Um café, por favor."]},
  {line:"Lo prende qui o da portare via? Se resta, può berlo al banco.",hint:"Decidi di bere il caffè al banco.",ptHint:"Você tem tempo para beber no balcão.",
   replies:["Da portare via, grazie.","Qui, al banco. Grazie!","Non ancora."],answer:1,accept:/^(qui\b|al banco\b)/,
   retry:"Resta al banco o vuole portarlo con sé?",feedback:"«Al banco» indica il luogo. «Da portare via» indica l’asporto.",
   reply:"Eccolo. Attenzione, la tazzina scotta!",memory:["Qui, al banco.","Aqui, no balcão."]}
 ]},
 {id:"market",place:"5658664209",name:"Elena",level:"A2",title:"Al mercato",color:"#a8773a",turns:[
  {line:"Oggi ho delle pere belle mature. Quante gliene metto?",hint:"Chiedi mezzo chilo di pere.",ptHint:"Peça meio quilo de peras. «Gliene» retoma a fruta e o destinatário.",
   replies:["Me ne dia mezzo chilo, per favore.","Ci vediamo tra mezz’ora.","Sono mezzo chilo?"],answer:0,accept:/\b(mezzo chilo|cinquecento grammi)\b/,
   retry:"Mezzo chilo? Oppure ne vuole un chilo intero?",feedback:"«Me ne dia» riprende un prodotto già nominato.",
   reply:"Va bene. Sono due euro. Vuole anche un sacchetto?",memory:["Me ne dia mezzo chilo, per favore.","Me dê meio quilo, por favor."]},
  {line:"Vuole anche un sacchetto?",hint:"Hai già la tua borsa. Rifiuta il sacchetto con cortesia.",ptHint:"Você trouxe a própria bolsa e pode recusar com gentileza.",
   replies:["Sì, ne prendo due.","No, grazie. Ho già una borsa.","No, sono due euro."],answer:1,accept:/\b(ho gia|ho) (una|la|un) (borsa|sacchetto|sporta)\b/,
   retry:"Ha dove mettere le pere?",feedback:"«Già» presenta qualcosa che è disponibile prima della domanda.",
   reply:"Perfetto, allora gliele metto qui.",memory:["Ho già una borsa.","Já tenho uma bolsa."]}
 ]},
 {id:"station",station:"Breo",name:"Giulia",level:"A2",title:"Un biglietto per Piazza",color:"#685d92",turns:[
  {line:"Buongiorno. Solo andata o andata e ritorno?",hint:"Sali in funicolare e torni a piedi.",ptHint:"Você pretende ir a Piazza agora e descer a pé.",
   replies:["Andata e ritorno, grazie.","Un biglietto di sola andata, per favore.","Scendo qui, grazie."],answer:1,accept:/^(?!.*\britorno\b).*\b(sol[ao] andata|soltanto andata|andata soltanto)\b/,
   retry:"Torna anche in funicolare?",feedback:"«Sola andata» indica il viaggio in una sola direzione.",
   reply:"Ecco il biglietto. Può aspettare qui il prossimo vagone.",memory:["Un biglietto di sola andata, per favore.","Um bilhete só de ida, por favor."]}
 ]},
 {id:"books",place:"11116642028",name:"Chiara",level:"B1",title:"Un libro da regalare",color:"#87547c",turns:[
  {line:"Per chi è il regalo? Se mi racconta che cosa legge di solito, le faccio vedere qualcosa.",hint:"Il regalo è per un’amica che ama i gialli e ha poco tempo.",ptHint:"É para uma amiga que adora mistério, mas não tem muito tempo para ler.",
   replies:["È per un’amica. Le piacciono i gialli, ma legge poco. Ha qualcosa di breve?","È per un’amica a cui devo spiegare dove abito.","Mi piacerebbe leggere qualcosa, ma oggi ho fretta."],answer:0,
   retry:"Certo. Ma che genere piace alla sua amica?",feedback:"Dai un contesto, una preferenza e un limite. Un giallo è un racconto poliziesco.",
   reply:"Avrei una raccolta di racconti gialli. Può leggerne uno alla volta, anche quando ha poco tempo.",memory:["Le piacciono i gialli. Ha qualcosa di breve?","Ela gosta de mistérios. Tem algo curto?"]}
 ]},
 {id:"restaurant",place:"5199784509",name:"Marta",level:"B2",title:"Una prenotazione da chiarire",color:"#a3543a",turns:[
  {line:"Ho una prenotazione per due, ma mi risulta per domani. Stasera siamo quasi al completo. Potreste rientrare più tardi?",hint:"Ti aspettavi un tavolo oggi. Chiedi una conferma senza accusare.",ptHint:"Você esperava uma mesa hoje. Confirme se vale a pena voltar, sem soar acusatório.",
   replies:["Non importa, domani alle otto andrà bene.","Capisco. Prima di tornare, potremmo verificare se si libera un tavolo? Altrimenti ci organizziamo diversamente.","Ma come, è impossibile. Ci dovete dare un tavolo subito."],answer:1,
   retry:"Volete aspettare una conferma o preferite cercare un altro posto?",feedback:"«Mi risulta» riferisce un dato. «Potremmo» attenua la richiesta.",
   reply:"Facciamo così: vi confermo entro mezz’ora se riusciamo a sistemarvi.",memory:["Potremmo verificare se si libera un tavolo?","Poderíamos ver se alguma mesa fica livre?"]}
 ]},
 {id:"square",landmark:[44.38868,7.82978],label:"Piazza Maggiore",name:"Paolo",level:"B1",title:"Raccontare il tragitto",color:"#496e85",turns:[
  {line:"Sei salito a piedi? Io di solito evito le scale quando piove.",hint:"Racconta la salita e aggiungi una condizione per il ritorno.",ptHint:"Conte que veio de funicular e quer voltar a pé, se o tempo ajudar. Você pode ensaiar esse trajeto mesmo se chegou por outro caminho.",
   replies:["Sono sceso a piedi e poi è piovuto.","Sono salito in funicolare. Se non piove, torno a piedi.","Non ho ancora preso la funicolare, ma sarebbe sceso."],answer:1,
   retry:"Quindi sei venuto a piedi o in funicolare?",feedback:"«Sono salito» racconta un evento concluso. «Se non piove, torno» indica una possibilità.",
   reply:"Allora ti conviene fare la Viota. Se inizia a piovere, puoi sempre riprendere la funicolare.",memory:["Se non piove, torno a piedi.","Se não chover, volto a pé."]}
 ]},
 {id:"moro",place:"11646092315",name:"Nico",level:"A2",title:"Un tavolo fuori",color:"#4d7482",turns:[
  {line:"Buonasera! Vi accomodate dentro o preferite stare fuori?",hint:"Chiedi un tavolo all’aperto per due persone.",ptHint:"Peça uma mesa ao ar livre para duas pessoas.",
   replies:["Un tavolo fuori per due, se c’è posto.","Siamo fuori da due ore.","Ci vediamo fuori dopo cena."],answer:0,accept:/\b(tavolo|posto)\b.*\b(fuori|aperto)\b/,
   retry:"Avete una preferenza? Posso controllare se c’è posto fuori.",feedback:"«Se c’è posto» lascia spazio a una risposta negativa.",
   reply:"Certo, accomodatevi pure in piazza.",memory:["Un tavolo fuori per due, se c’è posto.","Uma mesa lá fora para dois, se tiver lugar."]}
 ]},
 {id:"aragno",place:"7123095496",name:"Serena",level:"A2",title:"Qualcosa di dolce",color:"#ae6543",turns:[
  {line:"Ha già scelto o vuole dare un’occhiata alla vetrina?",hint:"Non hai ancora scelto un dolce. Chiedi un consiglio.",ptHint:"Você quer provar um doce, mas ainda não escolheu. Peça uma sugestão.",
   replies:["Mi consiglia qualcosa di dolce?","Ho già pagato, grazie.","Dov’è la biglietteria?"],answer:0,accept:/\b(consiglia|consiglierebbe|suggerisce)\b/,
   retry:"Posso aiutarla a scegliere?",feedback:"«Mi consiglia…?» mantiene il registro formale.",
   reply:"Volentieri. Preferisce qualcosa al cioccolato o alla frutta?",memory:["Mi consiglia qualcosa di dolce?","Você me recomenda algo doce?"]}
 ]},
 {id:"donalfo",place:"7129040213",name:"Rita",level:"B1",title:"Una pizza da dividere",color:"#96634c",turns:[
  {line:"Avete già deciso? Posso portarvi una pizza a testa, oppure ne potete dividere una.",hint:"Volete una sola pizza da dividere, già tagliata.",ptHint:"Vocês querem dividir uma pizza. Peça para ela vir cortada.",
   replies:["Ne prendiamo una a testa e poi dividiamo il conto.","Ne dividiamo una. Potrebbe portarcela già tagliata?","La prendiamo intera da portare via."],answer:1,
   retry:"Quindi ne ordinate una in tutto o una per persona?",feedback:"«Portarcela» unisce portare, ci e la.",
   reply:"Certo, ve la faccio tagliare prima di servirla.",memory:["Potrebbe portarcela già tagliata?","Poderia trazê-la já cortada para nós?"]}
 ]},
 {id:"altipiano",landmark:[44.39808,7.81583],label:"Piazza Franco Centro · Altipiano",name:"Matteo",level:"B1",title:"Un cambio in stazione",color:"#58705c",turns:[
  {line:"Scusi, questo è il treno diretto? Sul tabellone c’è scritto che bisogna cambiare a Fossano.",hint:"Anche tu hai un dubbio. Proponi di controllare insieme.",ptHint:"Diga que também está em dúvida e sugira conferir o painel juntos.",
   replies:["Nemmeno io ne sono sicuro. Controlliamo il tabellone insieme?","Se è diretto bisogna cambiare due volte.","A Fossano scendo sempre a piedi."],answer:0,
   retry:"Mi aiuta a controllare? Non vorrei prendere il treno sbagliato.",feedback:"«Nemmeno io» esprime una situazione negativa condivisa.",
   reply:"Volentieri. Guardiamo anche il numero del treno, così siamo sicuri.",memory:["Controlliamo il tabellone insieme?","Vamos conferir o painel juntos?"]}
 ]},
 {id:"mediation",place:"5658664209",name:"Sofia",level:"C1",title:"Una piazza, due esigenze",color:"#395d68",
  brief:"Dopo un incontro sul mercato, riassumi le due posizioni e proponi una prova con criteri di valutazione.",
  voices:[
   ["Anna, ambulante","Spostarci in periferia sulla carta sembra comodo. Il punto è che molti clienti passano di qui a piedi: se il mercato scompare dal centro, non è detto che ci seguano."],
   ["Davide, residente","Non chiedo che il mercato se ne vada. Mi basterebbe poter uscire di casa senza trovare il portone bloccato alle sei del mattino. Se ci fosse un corridoio libero, il discorso cambierebbe."]
  ],
  criteria:["Ho chiarito che Davide chiede accessi liberi, senza chiedere di spostare il mercato.", "Ho spiegato il rischio di perdere i clienti che passano a piedi.", "Ho proposto una prova concreta e un criterio per valutarla.", "Ho attribuito le opinioni alle persone, mantenendo un tono equilibrato."],
  model:"Dall’incontro è emersa una preoccupazione condivisa per la vivibilità della piazza, seppure da prospettive diverse. Gli ambulanti temono che un trasferimento riduca il passaggio della clientela abituale. I residenti, dal canto loro, chiedono che gli ingressi restino accessibili durante l’allestimento. Si potrebbe quindi mantenere il mercato in centro per quattro settimane, lasciando un corridoio libero e concordando una fascia per lo scarico. Al termine della prova, raccoglieremmo le segnalazioni sugli accessi e confronteremmo l’affluenza con quella delle settimane precedenti."
 },
 {id:"interview",landmark:[44.39061,7.81634],label:"Piazza Monteregale · Altipiano",name:"Valentina",level:"C1",
  title:"Replicare in un’intervista",audioFirst:true,color:"#65648b",
  brief:"Difendi una sperimentazione di quattro settimane per il mercato di Breo. Ascolta la domanda e prepara una risposta di circa un minuto. Apri la trascrizione solo se ne hai bisogno.",
  voices:[
   ["Valentina, intervistatrice","Quattro settimane di prova, certo. Ma non crede che, una volta approvata la sperimentazione, si finirà per lasciare tutto com’è? E chi ci garantisce che le segnalazioni dei residenti non verranno accantonate?"]
  ],
  criteria:["Ho riconosciuto il rischio di una proroga automatica.", "Ho spiegato chi raccoglie le segnalazioni e come vengono valutate.", "Ho usato una concessione o una condizione per limitare la promessa.", "Ho risposto nel registro di un’intervista senza trasformare il dubbio in un attacco."],
  model:"Capisco l’obiezione. Una prova avrebbe senso solo a condizione che la scadenza fosse fissata prima di iniziare e che i criteri fossero pubblici. Le segnalazioni sugli accessi andrebbero raccolte ogni settimana, insieme ai dati sull’affluenza. Dopo quattro settimane, residenti e ambulanti potrebbero discuterne in un incontro aperto. Se i problemi persistessero, il test non dovrebbe trasformarsi automaticamente in una soluzione definitiva."
 }
];
const skills = [
 ["A1","Ordinare, salutare e rispondere a domande brevi."],
 ["A2","Gestire acquisti e spostamenti. Precisare quantità e dettagli."],
 ["B1","Raccontare esperienze, spiegare preferenze e progetti."],
 ["B2","Negoziare alternative e adattare il registro agli imprevisti."],
 ["C1","Cogliere impliciti, mediare prospettive e argomentare con precisione."]
];
