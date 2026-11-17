const encounters = [
 {id:"coffee",place:"1916401476",name:"Lucia",level:"A1", title:"Un caffè al banco",color:"#aa5146",turns:[
  {line:"Buongiorno! Mi dica.",hint:"Faça o pedido no balcão. «Un caffè» costuma ser um espresso.",
   replies:["Buongiorno! Un caffè, per favore.","Mi fa il conto?","A che ora chiudete?"],answer:0,accept:/\b(un|il) (caffe|espresso)\b/,
   retry:"La macchina è già calda. Cosa le preparo?",feedback:"«Un caffè, per favore» faz o pedido. «Il conto» é a conta, no fim.",
   reply:"Subito. Lo prende qui o da portare via?",memory:["Un caffè, per favore.","Um café, por favor."]},
  {line:"Lo prende qui o da portare via? Se resta, può berlo al banco.",hint:"Você tem tempo para beber no balcão.",
   replies:["Da portare via, grazie.","Qui, al banco. Grazie!","Non ancora."],answer:1,accept:/^(qui\b|al banco\b)/,
   retry:"Resta al banco o vuole portarlo con sé?",feedback:"«Al banco» é no balcão. «Da portare via» é para viagem.",
   reply:"Eccolo. Attenzione, la tazzina scotta!",memory:["Qui, al banco.","Aqui, no balcão."]}
 ]},
 {id:"market",place:"5658664209",name:"Elena",level:"A2",title:"Al mercato",color:"#a8773a",turns:[
  {line:"Oggi ho delle pere belle mature. Quante gliene metto?",hint:"Peça meio quilo de peras. «Gliene» retoma a fruta e o destinatário.",
   replies:["Me ne dia mezzo chilo, per favore.","Ci vediamo tra mezz’ora.","Sono mezzo chilo?"],answer:0,accept:/\b(mezzo chilo|cinquecento grammi)\b/,
   retry:"Mezzo chilo? Oppure ne vuole un chilo intero?",feedback:"«Me ne dia» serve para pedir uma quantidade de algo já mencionado.",
   reply:"Va bene. Sono due euro. Vuole anche un sacchetto?",memory:["Me ne dia mezzo chilo, per favore.","Me dê meio quilo, por favor."]},
  {line:"Vuole anche un sacchetto?",hint:"Você trouxe a própria bolsa e pode recusar com gentileza.",
   replies:["Sì, ne prendo due.","No, grazie. Ho già una borsa.","No, sono due euro."],answer:1,accept:/\b(ho gia|ho) (una|la|un) (borsa|sacchetto|sporta)\b/,
   retry:"Ha dove mettere le pere?",feedback:"Você pode dizer «Ho già una borsa» para explicar por que dispensa a sacola.",
   reply:"Perfetto, allora gliele metto qui.",memory:["Ho già una borsa.","Já tenho uma bolsa."]}
 ]},
 {id:"station",station:"Breo",name:"Giulia",level:"A2",title:"Un biglietto per Piazza",color:"#685d92",turns:[
  {line:"Buongiorno. Solo andata o andata e ritorno?",hint:"Você pretende ir a Piazza agora e descer a pé.",
   replies:["Andata e ritorno, grazie.","Un biglietto di sola andata, per favore.","Scendo qui, grazie."],answer:1,accept:/^(?!.*\britorno\b).*\b(sol[ao] andata|soltanto andata|andata soltanto)\b/,
   retry:"Torna anche in funicolare?",feedback:"«Sola andata» pede apenas o trajeto de ida.",
   reply:"Ecco il biglietto. Può aspettare qui il prossimo vagone.",memory:["Un biglietto di sola andata, per favore.","Um bilhete só de ida, por favor."]}
 ]},
 {id:"books",place:"11116642028",name:"Chiara",level:"B1",title:"Un libro da regalare",color:"#87547c",turns:[
  {line:"Per chi è il regalo? Se mi racconta che cosa legge di solito, le faccio vedere qualcosa.",hint:"É para uma amiga que adora mistério, mas não tem muito tempo para ler.",
   replies:["È per un’amica. Le piacciono i gialli, ma legge poco. Ha qualcosa di breve?","È per un’amica a cui devo spiegare dove abito.","Mi piacerebbe leggere qualcosa, ma oggi ho fretta."],answer:0,
   retry:"Certo. Ma che genere piace alla sua amica?",feedback:"Você dá contexto e transforma uma preferência e uma restrição em um pedido. «Un giallo» é uma história policial ou de mistério.",
   reply:"Avrei una raccolta di racconti gialli. Può leggerne uno alla volta, anche quando ha poco tempo.",memory:["Le piacciono i gialli. Ha qualcosa di breve?","Ela gosta de mistérios. Tem algo curto?"]}
 ]},
 {id:"restaurant",place:"5199784509",name:"Marta",level:"B2",title:"Una prenotazione da chiarire",color:"#a3543a",turns:[
  {line:"Ho una prenotazione per due, ma mi risulta per domani. Stasera siamo quasi al completo. Potreste rientrare più tardi?",hint:"Você esperava uma mesa hoje. Confirme se vale a pena voltar, sem soar acusatório.",
   replies:["Non importa, domani alle otto andrà bene.","Capisco. Prima di tornare, potremmo verificare se si libera un tavolo? Altrimenti ci organizziamo diversamente.","Ma come, è impossibile. Ci dovete dare un tavolo subito."],answer:1,
   retry:"Volete aspettare una conferma o preferite cercare un altro posto?",feedback:"«Mi risulta» apresenta o que consta no registro. «Potremmo» abre espaço para negociar. «Altrimenti» introduz a alternativa.",
   reply:"Facciamo così: vi confermo entro mezz’ora se riusciamo a sistemarvi.",memory:["Potremmo verificare se si libera un tavolo?","Poderíamos ver se alguma mesa fica livre?"]}
 ]},
 {id:"square",landmark:[44.38868,7.82978],label:"Piazza Maggiore",name:"Paolo",level:"B1",title:"Raccontare il tragitto",color:"#496e85",turns:[
  {line:"Sei salito a piedi? Io di solito evito le scale quando piove.",hint:"Conte que veio de funicular e quer voltar a pé, se o tempo ajudar. Você pode ensaiar esse trajeto mesmo se chegou por outro caminho.",
   replies:["Sono sceso a piedi e poi è piovuto.","Sono salito in funicolare. Se non piove, torno a piedi.","Non ho ancora preso la funicolare, ma sarebbe sceso."],answer:1,
   retry:"Quindi sei venuto a piedi o in funicolare?",feedback:"«Sono salito» localiza a viagem no passado. «Se non piove, torno» coloca a volta como possibilidade.",
   reply:"Allora ti conviene fare la Viota. Se inizia a piovere, puoi sempre riprendere la funicolare.",memory:["Se non piove, torno a piedi.","Se não chover, volto a pé."]}
 ]},
 {id:"moro",place:"11646092315",name:"Nico",level:"A2",title:"Un tavolo fuori",color:"#4d7482",turns:[
  {line:"Buonasera! Vi accomodate dentro o preferite stare fuori?",hint:"Peça uma mesa ao ar livre para duas pessoas.",
   replies:["Un tavolo fuori per due, se c’è posto.","Siamo fuori da due ore.","Ci vediamo fuori dopo cena."],answer:0,accept:/\b(tavolo|posto)\b.*\b(fuori|aperto)\b/,
   retry:"Avete una preferenza? Posso controllare se c’è posto fuori.",feedback:"«Se c’è posto» é uma forma natural de deixar o pedido em aberto.",
   reply:"Certo, accomodatevi pure in piazza.",memory:["Un tavolo fuori per due, se c’è posto.","Uma mesa lá fora para dois, se tiver lugar."]}
 ]},
 {id:"aragno",place:"7123095496",name:"Serena",level:"A2",title:"Qualcosa di dolce",color:"#ae6543",turns:[
  {line:"Ha già scelto o vuole dare un’occhiata alla vetrina?",hint:"Você quer provar um doce, mas ainda não escolheu. Peça uma sugestão.",
   replies:["Mi consiglia qualcosa di dolce?","Ho già pagato, grazie.","Dov’è la biglietteria?"],answer:0,accept:/\b(consiglia|consiglierebbe|suggerisce)\b/,
   retry:"Posso aiutarla a scegliere?",feedback:"Com «Mi consiglia…?» você pede uma sugestão no registro formal.",
   reply:"Volentieri. Preferisce qualcosa al cioccolato o alla frutta?",memory:["Mi consiglia qualcosa di dolce?","Você me recomenda algo doce?"]}
 ]},
 {id:"donalfo",place:"7129040213",name:"Rita",level:"B1",title:"Una pizza da dividere",color:"#96634c",turns:[
  {line:"Avete già deciso? Posso portarvi una pizza a testa, oppure ne potete dividere una.",hint:"Vocês querem dividir uma pizza. Peça para ela vir cortada.",
   replies:["Ne prendiamo una a testa e poi dividiamo il conto.","Ne dividiamo una. Potrebbe portarcela già tagliata?","La prendiamo intera da portare via."],answer:1,
   retry:"Quindi ne ordinate una in tutto o una per persona?",feedback:"«Ne dividiamo una» retoma a pizza. «Portarcela» combina trazer, para nós e a pizza.",
   reply:"Certo, ve la faccio tagliare prima di servirla.",memory:["Potrebbe portarcela già tagliata?","Poderia trazê-la já cortada para nós?"]}
 ]},
 {id:"altipiano",landmark:[44.39808,7.81583],label:"Piazza Franco Centro · Altipiano",name:"Matteo",level:"B1",title:"Un cambio in stazione",color:"#58705c",turns:[
  {line:"Scusi, questo è il treno diretto? Sul tabellone c’è scritto che bisogna cambiare a Fossano.",hint:"Diga que também está em dúvida e sugira conferir o painel juntos.",
   replies:["Nemmeno io ne sono sicuro. Controlliamo il tabellone insieme?","Se è diretto bisogna cambiare due volte.","A Fossano scendo sempre a piedi."],answer:0,
   retry:"Mi aiuta a controllare? Non vorrei prendere il treno sbagliato.",feedback:"«Nemmeno io» expressa que você compartilha a dúvida. «Bisogna cambiare» indica necessidade de baldeação.",
   reply:"Volentieri. Guardiamo anche il numero del treno, così siamo sicuri.",memory:["Controlliamo il tabellone insieme?","Vamos conferir o painel juntos?"]}
 ]},
 {id:"mediation",place:"5658664209",name:"Sofia",level:"C1",title:"Una piazza, due esigenze",color:"#395d68",
  brief:"Você está ajudando a redigir uma mensagem após uma reunião fictícia sobre o mercado. Resuma as duas posições e proponha um teste, com um jeito de avaliar se funcionou.",
  voices:[
   ["Anna, ambulante","Spostarci in periferia sulla carta sembra comodo. Il punto è che molti clienti passano di qui a piedi: se il mercato scompare dal centro, non è detto che ci seguano."],
   ["Davide, residente","Non chiedo che il mercato se ne vada. Mi basterebbe poter uscire di casa senza trovare il portone bloccato alle sei del mattino. Se ci fosse un corridoio libero, il discorso cambierebbe."]
  ],
  criteria:["Deixei claro que Davide quer acesso ao prédio e não pediu o fim do mercado no centro.","Expliquei que Anna teme perder a clientela que passa a pé.","Propus um teste concreto e indiquei como avaliá-lo.","Usei tom de síntese e atribuí as posições sem falar em nome das duas pessoas."],
  model:"Dall’incontro è emersa una preoccupazione condivisa per la vivibilità della piazza, seppure da prospettive diverse. Gli ambulanti temono che un trasferimento riduca il passaggio della clientela abituale. I residenti, dal canto loro, chiedono che gli ingressi restino accessibili durante l’allestimento. Si potrebbe quindi mantenere il mercato in centro per quattro settimane, lasciando un corridoio libero e concordando una fascia per lo scarico. Al termine della prova, raccoglieremmo le segnalazioni sugli accessi e confronteremmo l’affluenza con quella delle settimane precedenti."
 },
 {id:"interview",landmark:[44.39061,7.81634],label:"Piazza Monteregale · Altipiano",name:"Valentina",level:"C1",
  title:"Replicare in un’intervista",audioFirst:true,color:"#65648b",
  brief:"Em uma entrevista fictícia, você precisa defender um teste de quatro semanas para o mercado de Breo. Responda em italiano em cerca de um minuto. Ouça primeiro e abra a transcrição se precisar.",
  voices:[
   ["Valentina, intervistatrice","Quattro settimane di prova, certo. Ma non crede che, una volta approvata la sperimentazione, si finirà per lasciare tutto com’è? E chi ci garantisce che le segnalazioni dei residenti non verranno accantonate?"]
  ],
  criteria:["Reconheci a preocupação com a mudança virar permanente por inércia.","Expliquei quem recolhe as reclamações e como entra a avaliação.","Usei uma concessão ou uma condição para evitar fazer uma promessa que não posso cumprir.","Mantive um tom de entrevista, sem tratar a pergunta como ataque pessoal."],
  model:"Capisco l’obiezione. Una prova avrebbe senso solo a condizione che la scadenza fosse fissata prima di iniziare e che i criteri fossero pubblici. Le segnalazioni sugli accessi andrebbero raccolte ogni settimana, insieme ai dati sull’affluenza. Dopo quattro settimane, residenti e ambulanti potrebbero discuterne in un incontro aperto. Se i problemi persistessero, il test non dovrebbe trasformarsi automaticamente in una soluzione definitiva."
 }
];
const skills = [
 ["A1","Pedir, cumprimentar, entender perguntas curtas e responder no balcão."],
 ["A2","Resolver compras e deslocamentos. Pedir quantidades, confirmar detalhes e recusar com educação."],
 ["B1","Contar o que aconteceu e explicar preferências, planos e restrições."],
 ["B2","Negociar alternativas e ajustar a maneira de falar diante de um imprevisto."],
 ["C1","Inferir o que ficou implícito, conciliar perspectivas e adaptar o registro ao interlocutor."]
];
