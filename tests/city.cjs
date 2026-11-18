const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const source = fs.readFileSync(new URL('../index.html', pathToFileURL(__filename)), 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
const elements = new Map();
const storage = new Map();
const context2d = new Proxy({}, { get: (o, k) => o[k] || (() => {}) });
class Element {
  constructor() {
    this.children = [];
    this.open = false;
    this.style = {};
    this.dataset = {};
    this.width = 620;
    this.height = 392;
    this.value = '';
    this.textContent = '';
    this.checked = false;
  }
  set innerHTML(value) {
    this.children = [];
    for (const match of value.matchAll(/\bid="([^"]+)"/g)) elements.set(match[1], new Element());
    this.html = value;
  }
  getContext() { return context2d; }
  append(...children) { this.children.push(...children); }
  insertBefore(child) { this.children.unshift(child); }
  replaceChildren(...children) { this.children = children; }
  setAttribute() {}
  querySelectorAll() { return []; }
  addEventListener() {}
  focus() {}
  showModal() { this.open = true; }
  close() { this.open = false; }
  setCustomValidity(value) { this.validationMessage = value; }
  reportValidity() {}
}
const document = {
  getElementById(id) {
    if (!elements.has(id)) elements.set(id, new Element());
    return elements.get(id);
  },
  createElement: () => new Element(),
  querySelectorAll: () => []
};
const env = vm.createContext({
  document, console, assert,
  window: { addEventListener() {} },
  localStorage: { getItem: key => storage.get(key), setItem: (k, v) => storage.set(k, v) },
  requestAnimationFrame() {}
});
vm.runInContext(source, env);
vm.runInContext(`
const submit = { preventDefault() {} };
assert(saved.settings.challenge);
assert(!saved.settings.portuguese);
assert(city.places.every(p => actors.some(a => a.place === p[0])));
assert(actors.every(a => canWalk(a.point)));
assert(directory.length > 100);
const core = actorById('coffee');
conversationMenu(core);
assert(modal.children.some(c => c.className === 'portrait'));
assert(!modal.children.some(c => c.className === 'assist'));
startEncounter(core);
assert($('choices').hidden !== false);
$('answer').value = core.turns[0].replies[0];
$('answerForm').onsubmit(submit);
$('advance').onclick();
$('answer').value = core.turns[1].replies[1];
$('answerForm').onsubmit(submit);
assert(!saved.done.coffee, 'grammar must gate completion');
const question = questionFor(core);
$('grammarAnswer').value = 'risposta sbagliata';
$('grammarForm').onsubmit(submit);
assert(!saved.done.coffee);
$('grammarAnswer').value = question.answers[0];
$('grammarForm').onsubmit(submit);
$('grammarContinue').onclick();
assert(saved.done.coffee);
$('advance').onclick();
const shop = actors.find(a => a.generic);
conversationMenu(shop);
assert($('topics').children.length >= 4);
$('topics').children[0].onclick();
assert.equal(active.id, shop.id);
modal.close();
player = pedestrians[0].point;
pedestrianTalk();
assert.equal(speaker.id, pedestrians[0].id);
assert(modal.children.some(c => c.className === 'portrait'));
const stopped = [...pedestrians[0].point];
updatePedestrians(1);
assert.deepEqual(pedestrians[0].point, stopped);
modal.close();
const originalSegments = pedestrians.map(p => p.segment);
for(let i=0;i<120;i++)updatePedestrians(1);
assert(pedestrians.some((p,i) => p.segment !== originalSegments[i]), 'pedestrians must traverse intersections');
assert(pedestrians.every(p => p.point.every(Number.isFinite)));
player = parked[0].point;
vehicleAction();
assert(driven && driveState);
for(let i=0;i<600;i++)moveAssistedCar(0,-1,1/60);
assert(player.every(Number.isFinite));
assert(driveable(player));
const controlOrigin=inCityEdges.map(lane=>lane.a.map((v,i)=>(v+lane.b[i])/2))
 .find(p=>[[3,0],[-3,0],[0,3],[0,-3]].every(([x,y])=>driveable([p[0]+x,p[1]+y])));
assert(controlOrigin,'find open road space for directional control');
for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
 player=[...controlOrigin];driveState=attachCar();
 for(let i=0;i<4;i++)moveAssistedCar(dx,dy,1/60);
 assert((player[0]-controlOrigin[0])*dx+(player[1]-controlOrigin[1])*dy>0);
 if(!dx)assert.equal(player[0],controlOrigin[0],'vertical key must not force a horizontal turn');
 if(!dy)assert.equal(player[1],controlOrigin[1],'horizontal key must not force a vertical turn');
}
player=[...controlOrigin];driveState=attachCar();
moveAssistedCar(1,0,1/60);
const afterRight=[...player];
moveAssistedCar(0,-1,1/60);
assert.equal(player[0],afterRight[0],'changing key must change direction immediately');
assert(player[1]<afterRight[1]);
const beforeStop=[...player];
moveAssistedCar(0,0,1/60);
assert.deepEqual(player,beforeStop,'release must stop without drift');

for(let i=0;i<100;i++)moveAssistedCar(0,0,1/60);
assert.equal(driveState.speed,0);
vehicleAction();
assert.equal(driven, null);
settingsDialog();
$('ptSetting').checked=true;
$('challengeSetting').checked=true;
$('saveSettings').onclick();
conversationMenu(core);
assert(modal.children.some(c => c.className === 'assist'));
saved.settings.portuguese=false;
journal();
assert($('phrases').children.every(c => !c.textContent.includes('Um café')));
startEncounter(actorById('mediation'));
$('draft').value = 'Una risposta troppo breve.';
$('writing').onsubmit(submit);
assert(!saved.done.mediation);
$('draft').value = Array(100).fill('proposta').join(' ');
$('writing').onsubmit(submit);
assert(!saved.done.mediation, 'comparison alone must not complete a C1 activity');
$('selfReview').onsubmit(submit);
assert(!saved.done.mediation);
active.criteria.forEach((_,i) => $('criterion'+i).checked=true);
$('selfReview').onsubmit(submit);
assert(saved.done.mediation);
modal.close();
trackMission(missions[0]);
assert(pin && navigationRoute);
mapDialog();
$('zoomIn').onclick();$('zoomOut').onclick();$('centerMap').onclick();
for (const name of ['Bar del Moro','Don Alfo','Altipiano']) {
  $('mapSearch').value=name;$('mapSearch').oninput();
  assert($('results').children.length);
}
modal.close();
saved.settings.challenge=false;
const mission = missions[0];
for (const [id] of mission.steps) {
  const actor=actorById(id);startEncounter(actor);
  for (const turn of actor.turns) { finishTurn(turn);$('advance').onclick(); }
}
assert.equal(missionStep(mission), mission.steps.length);
expressionPractice(core);
$('expressionOptions').children[0].onclick();
assert(saved.language.seen.expression);
savePosition();
assert(saved.geoPosition.every(Number.isFinite));
console.log('Verified immersion settings, all mapped establishments, pixel portraits, grammar gates, C1 review, pedestrian journeys, assisted driving, missions, zoom and persistence.');
`, env);

